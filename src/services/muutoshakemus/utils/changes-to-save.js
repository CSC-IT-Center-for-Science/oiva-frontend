import { getAnchorPart, findObjectWithKey } from "../../../utils/common";
import { fillForBackend } from "../../lomakkeet/backendMappings";
import * as R from "ramda";

// Return changes of Tutkinnot
const getMuutos = (changeObj, perustelut, kohde, maaraystyyppi) => {
  const metadata = R.path(["properties", "metadata"], changeObj);
  const anchorParts = changeObj.anchor.split(".");
  const koulutusCode = R.nth(2, anchorParts);
  const subcodeCandidate = R.nth(3, anchorParts);
  const subcode =
    subcodeCandidate && !isNaN(subcodeCandidate) ? subcodeCandidate : undefined;
  const finnishInfo = R.find(R.propEq("kieli", "FI"), metadata.metadata);
  const maaraysUuid = changeObj.properties.metadata.maaraysId;
  const perustelutForBackend = fillForBackend(perustelut, changeObj.anchor);
  const perusteluteksti = perustelutForBackend
    ? perustelutForBackend.perusteluteksti
    : null;
  const muutos = {
    generatedId: R.join(".", R.init(anchorParts)),
    isInLupa: metadata.isInLupa,
    kohde,
    koodiarvo: subcode || koulutusCode,
    koodisto: metadata.koodisto.koodistoUri,
    kuvaus: finnishInfo.kuvaus,
    maaraystyyppi,
    meta: {
      changeObjects: R.flatten([[changeObj], perustelut]),
      nimi: finnishInfo.nimi,
      koulutusala: anchorParts[0],
      koulutustyyppi: anchorParts[1],
      perusteluteksti,
      muutosperustelukoodiarvo: []
    },
    nimi: finnishInfo.nimi,
    tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO",
    type: changeObj.properties.isChecked ? "addition" : "removal"
  };

  if (subcode && maaraysUuid) {
    // in case parent maarays exists
    muutos["maaraysUuid"] = maaraysUuid;
  } else if (subcode) {
    muutos["parent"] = R.compose(R.join("."), R.dropLast(2))(anchorParts);
  }
  return muutos;
};

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

export function getChangesToSave(
  key,
  changeObjects = {},
  backendMuutokset = [],
  kohde,
  maaraystyyppi,
  muut
) {
  // Update changes if already exits with perustelut and attachements
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

  let uudetMuutokset = [];

  if (key === "tutkinnot") {
    uudetMuutokset = R.map(changeObj => {
      const anchorInit = R.compose(
        R.join("."),
        R.init,
        R.split(".")
      )(changeObj.anchor);
      const perustelut = R.filter(
        R.compose(R.contains(anchorInit), R.prop("anchor")),
        changeObjects.perustelut
      );
      return getMuutos(changeObj, perustelut, kohde, maaraystyyppi);
    }, unhandledChangeObjects).filter(Boolean);
  } else if (key === "koulutukset") {
    uudetMuutokset = R.map(changeObj => {
      const anchorInit = R.compose(
        R.join("."),
        R.init,
        R.split(".")
      )(changeObj.anchor);
      const code = getAnchorPart(changeObj.anchor, 1);
      const metadata = R.path(["properties", "metadata"], changeObj);
      const finnishInfo = R.find(R.propEq("kieli", "FI"), metadata.metadata);
      const perustelut = R.filter(
        R.compose(R.contains(anchorInit), R.prop("anchor")),
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
          changeObjects: R.flatten([[changeObj], perustelut]),
          muutosperustelukoodiarvo: []
        },
        perustelutForBackend,
        perusteluteksti ? { perusteluteksti } : null
      );

      return {
        isInLupa: metadata.isInLupa,
        liitteet: R.map(file => {
          return R.dissoc("tiedosto", file);
        }, findObjectWithKey(changeObjects, "attachments")),
        kohde,
        koodiarvo: code,
        koodisto: metadata.koodisto.koodistoUri,
        maaraystyyppi,
        meta,
        nimi: finnishInfo.nimi,
        tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO",
        type: changeObj.properties.isChecked ? "addition" : "removal"
      };
    }, unhandledChangeObjects).filter(Boolean);
  } else if (key === "opetuskielet") {
    uudetMuutokset = R.map(changeObj => {
      const anchorParts = changeObj.anchor.split(".");
      const code = R.view(R.lensIndex(1), anchorParts);
      const perustelut = R.filter(
        R.compose(
          R.equals(code),
          R.view(R.lensIndex(1)),
          R.split("."),
          R.prop("anchor")
        ),
        changeObjects.perustelut
      );
      const meta = R.path(["properties", "metadata"], changeObj) || {};
      return {
        koodiarvo: code,
        koodisto: "oppilaitoksenopetuskieli",
        nimi: meta.kuvaus, // TODO: Tähän oikea arvo, jos tarvitaan, muuten poistetaan
        kuvaus: meta.kuvaus, // TODO: Tähän oikea arvo, jos tarvitaan, muuten poistetaan
        isInLupa: meta.isInLupa,
        kohde, //: meta.kohde.kohdeArvot[0].kohde,
        maaraystyyppi, // : meta.maaraystyyppi,
        meta: {
          tunniste: "opetuskieli",
          changeObjects: R.flatten([[changeObj], perustelut]),
          perusteluteksti: R.map(perustelu => {
            if (R.path(["properties", "value"], perustelu)) {
              return { value: R.path(["properties", "value"], perustelu) };
            }
            return {
              value: R.path(["properties", "metadata", "fieldName"], perustelu)
            };
          }, perustelut)
        },
        tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO",
        type: changeObj.properties.isChecked ? "addition" : "removal"
      };
    }, unhandledChangeObjects).filter(Boolean);
  } else if (key === "tutkintokielet") {
    uudetMuutokset = R.map(changeObj => {
      const anchorInit = R.compose(
        R.join("."),
        R.init,
        R.split(".")
      )(changeObj.anchor);
      const perustelut = R.filter(perustelu => {
        // Let's remove chars between | | marks
        const simplifiedAnchor = R.replace(/\|.*\|/, "", perustelu.anchor);
        return R.contains(anchorInit, simplifiedAnchor);
      }, changeObjects.perustelut);
      const code = getAnchorPart(changeObj.anchor, 1);
      const meta = changeObj.properties.metadata;

      return {
        koodiarvo: code,
        koodisto: "kieli",
        nimi: meta.nimi, // TODO: Tähän oikea arvo, jos tarvitaan, muuten poistetaan
        kuvaus: meta.kuvaus, // TODO: Tähän oikea arvo, jos tarvitaan, muuten poistetaan
        isInLupa: meta.isInLupa,
        kohde,
        maaraystyyppi,
        meta: {
          tunniste: "tutkintokieli",
          changeObjects: R.flatten([[changeObj], perustelut]),
          perusteluteksti: R.map(perustelu => {
            if (R.path(["properties", "value"], perustelu)) {
              return { value: R.path(["properties", "value"], perustelu) };
            }
            return {
              value: R.path(["properties", "metadata", "fieldName"], perustelu)
            };
          }, perustelut)
        },
        tila: "LISAYS",
        type: "addition"
      };
    }, unhandledChangeObjects).filter(Boolean);
  } else if (key === "muut") {
    uudetMuutokset = R.map(changeObj => {
      const anchorInit = R.compose(
        R.join("."),
        R.init,
        R.split(".")
      )(changeObj.anchor);
      let tila = changeObj.properties.isChecked ? "LISAYS" : "POISTO";
      let type = changeObj.properties.isChecked ? "addition" : "removal";

      if (
        (changeObj.properties.isChecked === undefined ||
          changeObj.properties.isChecked === null) &&
        changeObj.properties.value
      ) {
        tila = "MUUTOS";
        type = "modification";
      }

      const perustelut = R.filter(
        R.compose(R.contains(anchorInit), R.prop("anchor")),
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
      return {
        koodiarvo: R.path(["properties", "metadata", "koodiarvo"], changeObj),
        koodisto: R.path(
          ["properties", "metadata", "koodisto", "koodistoUri"],
          changeObj
        ),
        isInLupa: R.path(["properties", "metadata", "isInLupa"], changeObj),
        kohde,
        maaraystyyppi,
        meta,
        tila,
        type
      };
    }, unhandledChangeObjects).filter(Boolean);
  } else if (key === "toimintaalue") {
    uudetMuutokset = R.map(changeObj => {
      const perustelut = R.filter(
        R.compose(R.contains(changeObj.anchor), R.prop("anchor")),
        changeObjects.perustelut
      );
      let koodiarvo = null;
      const anchorPart1 = getAnchorPart(changeObj.anchor, 1);

      if (R.equals(anchorPart1, "maakunnat-ja-kunnat")) {
        koodiarvo = "FI0";
      } else if (R.equals(anchorPart1, "valtakunnallinen")) {
        koodiarvo = "FI1";
      } else if (R.equals(anchorPart1, "ei-maariteltya-toiminta-aluetta")) {
        koodiarvo = "FI2";
      }

      if (koodiarvo) {
        const tilaVal = changeObj.properties.isChecked ? "LISAYS" : "POISTO";
        const typeVal = changeObj.properties.isChecked ? "addition" : "removal";

        return {
          tila: tilaVal,
          type: typeVal,
          meta: {
            changeObjects: R.flatten([[changeObj], perustelut]),
            perusteluteksti: [
              {
                value:
                  perustelut && perustelut.length > 0
                    ? perustelut[0].properties.value
                    : ""
              }
            ]
          },
          muutosperustelukoodiarvo: null,
          kohde,
          maaraystyyppi,
          koodisto: "nuts1",
          koodiarvo
        };
      } else if (
        R.equals(anchorPart1, "valintakentat") ||
        R.includes("lupaan-lisattavat", anchorPart1)
      ) {
        return {
          koodiarvo: changeObj.properties.metadata.koodiarvo,
          koodisto: changeObj.properties.metadata.koodisto.koodistoUri,
          tila: "LISAYS",
          type: "addition",
          meta: {
            perusteluteksti: [
              { value: perustelut ? perustelut[0].properties.value : "" }
            ],
            changeObjects: R.flatten([[changeObj], perustelut])
          },
          muutosperustelukoodiarvo: null,
          kohde,
          maaraystyyppi
        };
      } else {
        return {
          koodiarvo: R.path(["properties", "metadata", "koodiarvo"], changeObj),
          koodisto: R.path(
            ["properties", "metadata", "koodisto", "koodistoUri"],
            changeObj
          ),
          tila: "POISTO",
          type: "removal",
          meta: {
            perusteluteksti: [
              { value: perustelut ? perustelut[0].properties.value : "" }
            ],
            changeObjects: R.flatten([[changeObj], perustelut])
          },
          muutosperustelukoodiarvo: null,
          kohde,
          maaraystyyppi
        };
      }
    }, unhandledChangeObjects).filter(Boolean);
  } else if (key === "opiskelijavuodet") {
    uudetMuutokset = R.map(changeObj => {
      const anchorParts = R.split(".", changeObj.anchor);
      const koodiarvo = changeObj.properties.metadata.koodiarvo;
      let koodisto = { koodistoUri: "koulutussektori" };
      if (!R.equals("vahimmaisopiskelijavuodet", R.nth(1, anchorParts))) {
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
      return {
        arvo: changeObj.properties.applyForValue,
        kategoria: R.head(anchorParts),
        koodiarvo,
        koodisto: koodisto.koodistoUri,
        kohde,
        maaraystyyppi,
        meta,
        tila: "MUUTOS",
        type: "change"
      };
    }, unhandledChangeObjects).filter(Boolean);
  }

  return R.flatten([paivitetytBackendMuutokset, uudetMuutokset]);
}
