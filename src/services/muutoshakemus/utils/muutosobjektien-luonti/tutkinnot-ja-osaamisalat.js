import { getAnchorPart, findObjectWithKey } from "../../../../utils/common";
import { fillForBackend } from "../../../lomakkeet/backendMappings";
import * as R from "ramda";

// Return changes of Tutkinnot
const getMuutos = (changeObj, perustelut, kohde, maaraystyypit) => {
  let tila;

  if (R.endsWith("osaamisala", changeObj.anchor)) {
    tila = changeObj.properties.isChecked ? "POISTO" : "LISAYS";
  } else {
    tila = changeObj.properties.isChecked ? "LISAYS" : "POISTO";
  }

  const metadata = R.path(["properties", "metadata"], changeObj);
  const anchorParts = changeObj.anchor.split(".");
  const koulutusCode = R.nth(2, anchorParts);
  const subcodeCandidate = R.nth(3, anchorParts);
  const subcode =
    subcodeCandidate && !isNaN(subcodeCandidate) ? subcodeCandidate : undefined;
  const finnishInfo = R.find(R.propEq("kieli", "FI"), metadata.metadata);
  const maaraysUuid = changeObj.properties.metadata.maaraysUuid;
  const perustelutForBackend = fillForBackend(perustelut, changeObj.anchor);
  const perusteluteksti = perustelutForBackend
    ? perustelutForBackend.perusteluteksti
    : null;
  const tyyppi = subcode
    ? R.find(R.propEq("tunniste", "RAJOITE"), maaraystyypit)
    : R.find(R.propEq("tunniste", "OIKEUS"), maaraystyypit);
  const muutos = {
    generatedId: R.join(".", R.init(anchorParts)),
    isInLupa: metadata.isInLupa,
    kohde,
    koodiarvo: subcode || koulutusCode,
    koodisto: metadata.koodisto.koodistoUri,
    kuvaus: finnishInfo.kuvaus,
    maaraystyyppi: tyyppi,
    maaraysUuid,
    meta: {
      changeObjects: R.flatten([[changeObj], perustelut]),
      nimi: finnishInfo.nimi,
      koulutusala: anchorParts[0],
      koulutustyyppi: anchorParts[1],
      perusteluteksti,
      muutosperustelukoodiarvo: []
    },
    nimi: finnishInfo.nimi,
    tila
  };

  if (subcode) {
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

export async function createChangeObjects(
  changeObjects = {},
  backendMuutokset = [],
  kohde,
  maaraystyypit,
  lupakohteet,
  parsedTutkinnot,
  locale
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

  const tutkintoChangeObjects = R.filter(
    R.compose(R.endsWith(".tutkinto"), R.prop("anchor")),
    unhandledChangeObjects
  );

  // There should always be a change object for a degree.
  if (!tutkintoChangeObjects.length) {
    uudetMuutokset = [];
  } else {
    function calculateNewChanges() {
      return R.flatten(
        R.map(tutkintoChangeObj => {
          const koulutusalanKoodiarvo = R.split(
            "_",
            getAnchorPart(tutkintoChangeObj.anchor, 0)
          )[1];
          const koulutustyypinKoodiarvo = getAnchorPart(
            tutkintoChangeObj.anchor,
            1
          );
          const koulutuksenKoodiarvo = getAnchorPart(
            tutkintoChangeObj.anchor,
            2
          );
          if (
            koulutusalanKoodiarvo &&
            koulutustyypinKoodiarvo &&
            koulutuksenKoodiarvo
          ) {
            const tutkinto = R.find(
              R.propEq("koodiArvo", koulutuksenKoodiarvo),
              parsedTutkinnot[koulutusalanKoodiarvo].koulutukset[
                koulutustyypinKoodiarvo
              ].koulutukset
            );

            if (tutkinto) {
              const anchorInit = R.compose(
                R.join("."),
                R.init,
                R.split(".")
              )(tutkintoChangeObj.anchor);

              const perustelut = R.filter(
                R.compose(R.contains(anchorInit), R.prop("anchor")),
                changeObjects.perustelut
              );

              let tutkintoMuutos =
                tutkintoChangeObj.properties.isChecked !==
                tutkintoChangeObj.properties.metadata.isInLupa
                  ? getMuutos(
                      tutkintoChangeObj,
                      perustelut,
                      kohde,
                      maaraystyypit
                    )
                  : null;

              // Let's create backend changes for tutkinto and its unchecked osaamisalat
              const osaamisalamuutokset = R.map(osaamisala => {
                const osaamisalaChangeObj = R.find(changeObj => {
                  return R.equals(
                    getAnchorPart(changeObj.anchor, 3),
                    osaamisala.koodiArvo
                  );
                }, changeObjects.muutokset);
                if (!osaamisalaChangeObj) {
                  const metadata = R.find(
                    R.propEq("kieli", locale),
                    osaamisala.metadata
                  );
                  return {
                    generatedId: `osaamisala-${Math.random()}`,
                    isInLupa: false,
                    koodiarvo: osaamisala.koodiArvo,
                    kohde,
                    koodisto: osaamisala.koodisto.koodistoUri,
                    kuvaus: metadata.kuvaus,
                    maaraystyyppi: R.find(
                      R.propEq("tunniste", "RAJOITE"),
                      maaraystyypit
                    ),
                    maaraysUuid: undefined,
                    meta: {
                      nimi: metadata.nimi,
                      koulutusala: koulutusalanKoodiarvo,
                      koulutustyyppi: koulutustyypinKoodiarvo
                    },
                    nimi: metadata.nimi,
                    parent: tutkintoMuutos.generatedId,
                    tila: "LISAYS",
                    type: "addition"
                  };
                } else {
                  const anchorInit = R.compose(
                    R.join("."),
                    R.init,
                    R.split(".")
                  )(osaamisalaChangeObj.anchor);
                  const perustelut = R.filter(
                    R.compose(R.contains(anchorInit), R.prop("anchor")),
                    changeObjects.perustelut
                  );
                  let osaamisalamuutos = null;
                  if (!osaamisalaChangeObj.properties.isChecked) {
                    // Osaamisalan rajoituksen lisääminen
                    osaamisalamuutos = getMuutos(
                      osaamisalaChangeObj,
                      perustelut,
                      kohde,
                      maaraystyypit
                    );
                  } else if (
                    osaamisalaChangeObj.properties.metadata.isTutkintoInLupa
                  ) {
                    /**
                     * Removal of osaamisalan rajoitus. This is needed when
                     * lupa includes the current degree (tutkinto).
                     **/
                    osaamisalamuutos = getMuutos(
                      osaamisalaChangeObj,
                      perustelut,
                      kohde,
                      maaraystyypit
                    );
                    if (!tutkintoMuutos) {
                      delete osaamisalamuutos.parent;
                    }
                  }
                  if (tutkintoMuutos) {
                    tutkintoMuutos.meta.changeObjects.push(osaamisalaChangeObj);
                  } else if (tutkintoChangeObj) {
                    osaamisalamuutos.meta.changeObjects.push(tutkintoChangeObj);
                  }
                  return osaamisalamuutos;
                }
              }, tutkinto.osaamisalat).filter(Boolean);
              return R.concat(osaamisalamuutokset, [tutkintoMuutos]).filter(
                Boolean
              );
            } else {
              console.warn("Tutkinto wasn't found!");
            }
          }
          return null;
        }, tutkintoChangeObjects).filter(Boolean)
      );
    }
    uudetMuutokset = calculateNewChanges();
  }

  const muutosobjektit = R.flatten([
    paivitetytBackendMuutokset,
    uudetMuutokset
  ]);
  return muutosobjektit;
}
