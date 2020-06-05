import { findObjectWithKey, getAnchorPart } from "../../../../utils/common";
import { fillForBackend } from "../../../lomakkeet/backendMappings";
import * as R from "ramda";

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
  maaraystyypit,
  tutkinnot = []
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

  if (key === "tutkintokielet") {
    uudetMuutokset = R.flatten(
      R.map(changeObj => {
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
        const metadata = changeObj.properties.metadata;
        const tutkinnonKoodiarvo = getAnchorPart(changeObj.anchor, 2);
        const tutkinto = tutkinnot[tutkinnonKoodiarvo];

        let muutosobjektit = [];

        if (tutkinto) {
          // Let's loop through all the languages that are already in LUPA.
          muutosobjektit = R.map(tutkintokieli => {
            const koodiarvoUpper = R.toUpper(tutkintokieli.koodiarvo);
            /**
             * If value array doesn't include language with the current koodiarvo
             * then we know that the language has been removed and a muutosobjekti
             * for it have to be created.
             **/
            const hasLanguageBeenRemoved = !!!R.find(
              R.propEq("value", koodiarvoUpper),
              changeObj.properties.value
            );

            console.info(tutkinto, changeObj);

            if (hasLanguageBeenRemoved) {
              // Return POISTO
              return {
                generatedId: `${changeObj.anchor}-${koodiarvoUpper}`,
                koodiarvo: koodiarvoUpper,
                koodisto: metadata.kieli.koodisto.koodistoUri,
                kohde,
                maaraystyyppi: R.find(
                  R.propEq("tunniste", "VELVOITE"),
                  maaraystyypit
                ),
                maaraysUuid: tutkintokieli.uuid,
                meta: {
                  tunniste: "tutkintokieli",
                  changeObjects: R.flatten([[changeObj], perustelut]),
                  perusteluteksti: R.map(perustelu => {
                    if (R.path(["properties", "value"], perustelu)) {
                      return {
                        value: R.path(["properties", "value"], perustelu)
                      };
                    }
                    return {
                      value: R.path(
                        ["properties", "metadata", "fieldName"],
                        perustelu
                      )
                    };
                  }, perustelut)
                },
                parentMaaraysUuid: tutkinto.maarays.uuid,
                tila: "POISTO"
              };
            }
            return null;
          }, tutkinto.tutkintokielet).filter(Boolean);
        } else {
          console.warn(
            `Unable to find tutkinto by koodiarvo ${tutkinnonKoodiarvo}`
          );
        }

        muutosobjektit = R.flatten([
          muutosobjektit,
          R.flatten(
            R.map(language => {
              // Return LISAYS
              return {
                generatedId: `${changeObj.anchor}-${language.value}`,
                koodiarvo: language.value,
                koodisto: metadata.kieli.koodisto.koodistoUri,
                kohde,
                maaraystyyppi: R.find(
                  R.propEq("tunniste", "VELVOITE"),
                  maaraystyypit
                ),
                maaraysUuid: changeObj.properties.metadata.maaraysUuid,
                meta: {
                  tunniste: "tutkintokieli",
                  changeObjects: R.flatten([[changeObj], perustelut]),
                  perusteluteksti: R.map(perustelu => {
                    if (R.path(["properties", "value"], perustelu)) {
                      return {
                        value: R.path(["properties", "value"], perustelu)
                      };
                    }
                    return {
                      value: R.path(
                        ["properties", "metadata", "fieldName"],
                        perustelu
                      )
                    };
                  }, perustelut)
                },
                parentMaaraysUuid: tutkinto.maarays
                  ? tutkinto.maarays.uuid
                  : null,
                parent: "", // tähän tulee tutkintomuutoksen generatedId,
                tila: "LISAYS"
              };
            }, changeObj.properties.value)
          )
        ]);

        console.info(muutosobjektit);
        return muutosobjektit;
      }, unhandledChangeObjects).filter(Boolean)
    );
  }

  console.info("Uudet muutokset: ", uudetMuutokset);

  return R.flatten([paivitetytBackendMuutokset, uudetMuutokset]);
}
