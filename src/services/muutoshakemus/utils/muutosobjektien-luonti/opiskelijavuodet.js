import * as R from "ramda";
import { fillForBackend } from "../../../lomakkeet/backendMappings";
import { findObjectWithKey, findChange } from "../../../../utils/common";

// These first two functions should me moved to common helper utilities because same implementation is needed
// in ~all savings functions
function findBackendMuutos(anchor, backendMuutokset) {
  const backendMuutos = R.find(muutos => {
    return !!R.find(R.propEq("anchor", anchor), muutos.meta.changeObjects);
  }, backendMuutokset);
  if (!backendMuutos && R.includes(".", anchor)) {
    return findBackendMuutos(
      R.compose(R.join("."), R.init, R.split("."), R.always(anchor)),
      backendMuutokset
    );
  }
  return { anchor, backendMuutos };
}

/**
 * Function returns change objects related to reasoning (perustelut)
 * and to current anchor. There are different methods to find the
 * correct change objects.
 * @param {string} anchor - Dot separated string, id of a change object.
 * @param {array} changeObjects - Array of change objects.
 */
function findPerustelut(anchor, changeObjects) {
  function getPerustelut(anchor, perustelut, method = R.includes) {
    return R.filter(R.compose(method(anchor), R.prop("anchor")), perustelut);
  }
  // Method 1: Add perustelut_ string in front of the anchor.
  let perustelutAnchor = `perustelut_${anchor}`;
  let perustelut = getPerustelut(perustelutAnchor, changeObjects);
  if (R.isEmpty(perustelut)) {
    // Method 2: Remove the last part of the anchor and try method 1 again.
    let anchorInit = R.slice(0, R.lastIndexOf(".", anchor), anchor);
    perustelutAnchor = `perustelut_${anchorInit}`;
    perustelut = getPerustelut(perustelutAnchor, changeObjects);
    if (R.isEmpty(perustelut)) {
      // Method 3: Take the anchor of method to and replace the dots with
      // underscores.
      perustelutAnchor = `perustelut_${R.replace(".", "_", anchorInit)}`;
      perustelut = getPerustelut(perustelutAnchor, changeObjects, R.startsWith);
    }
  }
  return perustelut;
}

export function createChangeObjects(
  changeObjects = {},
  backendMuutokset = [],
  kohde,
  maaraystyypit,
  muut,
  lupamuutokset,
  muutMuutokset
) {
  const paivitetytBackendMuutokset = R.map(changeObj => {
    let { anchor, backendMuutos } = findBackendMuutos(
      changeObj.anchor,
      backendMuutokset
    );
    let backendMuutosWithPerustelut = [];
    let backendMuutosWithChangeObjectsWithPerustelut = [];
    if (backendMuutos) {
      const perustelut = findPerustelut(anchor, changeObjects.perustelut);
      const perustelutForBackend = fillForBackend(perustelut, anchor);
      if (!perustelutForBackend) {
        const perusteluTexts = R.reject(R.equals(null))(
          R.map(perustelu => {
            if (R.path(["properties", "value"], perustelu)) {
              return { value: R.path(["properties", "value"], perustelu) };
            }
            return {
              value: R.path(["properties", "metadata", "fieldName"], perustelu)
            };
          }, perustelut)
        );
        backendMuutosWithPerustelut = R.assocPath(
          ["meta", "perusteluteksti"],
          perusteluTexts,
          backendMuutos
        );
      } else {
        backendMuutosWithPerustelut = R.assoc(
          "meta",
          perustelutForBackend,
          backendMuutos
        );
      }
      backendMuutosWithChangeObjectsWithPerustelut = R.assocPath(
        ["meta", "changeObjects"],
        R.flatten([[changeObj], perustelut]),
        backendMuutosWithPerustelut
      );
      // Let's add the attachments
      return R.assocPath(
        ["liitteet"],
        R.map(file => {
          return R.dissoc("tiedosto", file);
        }, findObjectWithKey(changeObjects, "attachments")),
        backendMuutosWithChangeObjectsWithPerustelut
      );
    }
    return backendMuutosWithChangeObjectsWithPerustelut;
  }, changeObjects.muutokset).filter(Boolean);

  const alreadyHandledChangeObjects = R.flatten(
    R.map(R.path(["meta", "changeObjects"]))(paivitetytBackendMuutokset)
  );

  const unhandledChangeObjects = R.difference(
    changeObjects.muutokset,
    alreadyHandledChangeObjects
  );

  const uudetMuutokset = R.map(changeObj => {
    const anchorParts = R.split(".", changeObj.anchor);
    const koodiarvo = changeObj.properties.metadata.koodiarvo;
    let koodisto = { koodistoUri: "koulutussektori" };
    const isVahimmaismaara = R.equals(
      "vahimmaisopiskelijavuodet",
      R.nth(1, anchorParts)
    );
    if (!isVahimmaismaara) {
      koodisto = (R.find(R.propEq("koodiArvo", koodiarvo), muut) || {})
        .koodisto;
    }
    const anchorInit = R.compose(
      R.join("."),
      R.init,
      R.split(".")
    )(changeObj.anchor);

    let anchor = "";

    if (anchorInit === "opiskelijavuodet.vahimmaisopiskelijavuodet")
      anchor = "perustelut_opiskelijavuodet_vahimmaisopiskelijavuodet";
    else if (anchorInit === "opiskelijavuodet.vaativatuki")
      anchor = "perustelut_opiskelijavuodet_vaativatuki";
    else if (anchorInit === "opiskelijavuodet.sisaoppilaitos")
      anchor = "perustelut_opiskelijavuodet_sisaoppilaitos";

    const perustelut = R.filter(
      R.compose(R.includes(anchor), R.prop("anchor")),
      changeObjects.perustelut
    );

    const perustelutForBackend = fillForBackend(perustelut, changeObj.anchor);

    const perusteluteksti = perustelutForBackend
      ? null
      : R.map(perustelu => {
          if (R.path(["properties", "value"], perustelu)) {
            return { value: R.path(["properties", "value"], perustelu) };
          }
          return {
            value: R.path(["properties", "metadata", "fieldName"], perustelu)
          };
        }, perustelut);

    let meta = Object.assign(
      {},
      {
        tunniste: "tutkintokieli",
        changeObjects: R.flatten([[changeObj], perustelut]),
        muutosperustelukoodiarvo: []
      },
      perustelutForBackend,
      perusteluteksti ? { perusteluteksti } : null
    );

    let muutokset = [
      {
        arvo: changeObj.properties.applyForValue,
        kategoria: R.head(anchorParts),
        koodiarvo,
        koodisto: koodisto.koodistoUri,
        kohde,
        maaraystyyppi: isVahimmaismaara
          ? R.find(R.propEq("tunniste", "OIKEUS"), maaraystyypit)
          : R.find(R.propEq("tunniste", "RAJOITE"), maaraystyypit),
        meta,
        tila: "LISAYS"
      }
    ];

    // Add removal change if old maarays exists
    const maaraysUuid = R.path(
      ["properties", "metadata", "maaraysUuid"],
      changeObj
    );
    if (maaraysUuid) {
      muutokset = R.append({
        ...muutokset[0],
        meta: {},
        maaraysUuid: maaraysUuid,
        tila: "POISTO"
      })(muutokset);
    }

    return muutokset;
  }, unhandledChangeObjects).filter(Boolean);

  const findIsChecked = anchorStart =>
    R.path(["properties", "isChecked"], findChange(anchorStart, muutMuutokset));

  const findRajoitusMaarays = koodi =>
    R.compose(
      R.find(R.propEq("koodiarvo", koodi)),
      R.prop("rajoitukset"),
      R.head,
      R.values,
      R.filter(R.propEq("tunniste", "opiskelijavuodet"))
    )(lupamuutokset);

  const generateMuutosFromMaarays = maarays => ({
    kategoria: "opiskelijavuodet",
    koodiarvo: maarays.koodiarvo,
    koodisto: maarays.koodisto,
    kohde: maarays.kohde,
    maaraysUuid: maarays.maaraysUuid,
    maaraystyyppi: R.find(R.propEq("tunniste", "RAJOITE"), maaraystyypit),
    meta: {},
    tila: "POISTO"
  });

  // If last radio selection (23) is selected, vuosimaara should be removed
  if (findIsChecked("muut_02.vaativatuki.23")) {
    const vaativatukiMaarays = findRajoitusMaarays("2");
    uudetMuutokset.push(generateMuutosFromMaarays(vaativatukiMaarays));
  }

  // If sisaoppilaitos is changed to false, vuosimaara should be removed
  if (findIsChecked("muut_03.sisaoppilaitos.4") === false) {
    const sisaoppilaitosMaarays = findRajoitusMaarays("4");
    uudetMuutokset.push(generateMuutosFromMaarays(sisaoppilaitosMaarays));
  }

  return R.flatten([paivitetytBackendMuutokset, uudetMuutokset]);
}
