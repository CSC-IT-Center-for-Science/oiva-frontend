import { concat, flatten, map, find, path, propEq, toUpper } from "ramda";

/**
 * Palauttaa tutkintokieliin liittyvät backend-muotoiset muutosobjektit.
 * @param {*} tutkinto
 * @param {*} changeObjects
 * @param {*} kohde
 * @param {*} maaraystyypit
 * @param {*} locale
 */
export function createBEOofTutkintakielet(
  tutkinto,
  changeObjects,
  kohde,
  maaraystyypit,
  beoOfTutkinnotJaOsaamisalat
) {
  let additions = [];
  let removals = [];
  const tutkintoRelatedAnchorString = `${tutkinto.koulutusalakoodiarvo}.${tutkinto.koulutustyyppikoodiarvo}.${tutkinto.koodiarvo}`;
  const changeObj = find(
    propEq(
      "anchor",
      `kielet_tutkintokielet_${tutkintoRelatedAnchorString}.kielet`
    ),
    changeObjects.tutkintokielet.muutokset
  );

  /**
   * Jos tutkintokieliä on muokattu, käydään muutokset läpi ja muodostetaan
   * niistä backendin tarvitsemat muutosobjektit.
   **/
  if (changeObj) {
    const { value: listOfActiveLanguages } = changeObj.properties;
    const perustelut = changeObjects.tutkintokielet.perustelut;

    /**
     * TUTKINTAKIELIEN POISTAMINEN
     *
     * Käydään läpi tutkintokielet, joista on olemassa määräys eli siis kielet,
     * jotka kuuluvat lupaan ja ovat näin ollen aktiivia ennen mahdollisia
     * muutoksia.
     */
    removals = tutkinto.tutkintokielet
      ? map(tutkintokielimaarays => {
          const koodiarvoUpper = toUpper(tutkintokielimaarays.koodiarvo);
          const hasLanguageBeenRemoved = !listOfActiveLanguages || !!!find(
            propEq("value", koodiarvoUpper),
            listOfActiveLanguages
          );
          if (hasLanguageBeenRemoved) {
            return {
              generatedId: `${changeObj.anchor}-${koodiarvoUpper}`,
              koodiarvo: koodiarvoUpper,
              koodisto: tutkintokielimaarays.koodisto,
              kohde,
              maaraystyyppi: find(
                propEq("tunniste", "VELVOITE"),
                maaraystyypit
              ),
              maaraysUuid: tutkintokielimaarays.uuid,
              meta: {
                tunniste: "tutkintokieli",
                changeObjects: flatten([[changeObj], perustelut]).filter(
                  Boolean
                ),
                perusteluteksti: map(perustelu => {
                  if (path(["properties", "value"], perustelu)) {
                    return {
                      value: path(["properties", "value"], perustelu)
                    };
                  }
                  return {
                    value: path(
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
        }, tutkinto.tutkintokielet).filter(Boolean)
      : [];

    /**
     * TUTKINTAKIELIEN LISÄÄMINEN
     *
     * Käydään läpi frontin muutosobjektin sisältämät kielet ja luodaan niitä
     * vastaavat backend-muotoiset muutosobjektit.
     */
    additions = map(language => {
      let backendChangeObject = {
        generatedId: `${changeObj.anchor}-${language.value}`,
        koodiarvo: language.value,
        koodisto: "kieli",
        kohde,
        maaraystyyppi: find(propEq("tunniste", "VELVOITE"), maaraystyypit),
        meta: {
          tunniste: "tutkintokieli",
          changeObjects: flatten([[changeObj], perustelut]).filter(Boolean),
          perusteluteksti: map(perustelu => {
            if (path(["properties", "value"], perustelu)) {
              return {
                value: path(["properties", "value"], perustelu)
              };
            }
            return {
              value: path(["properties", "metadata", "fieldName"], perustelu)
            };
          }, perustelut)
        },
        tila: "LISAYS"
      };

      /**
       * Jos tutkinto ei (vielä) kuulu lupaan eli sille ei ole määräystä,
       * etsitään tutkinnon muutosobjekti, jotta kielimuutos voidaan
       * linkittää oikeaan tutkintoon, jolle kieltä / kieliä ollaan lisäämässä.
       **/
      if (!tutkinto.maarays) {
        const tutkintomuutos = find(
          propEq("koodiarvo", tutkinto.koodiarvo),
          beoOfTutkinnotJaOsaamisalat || []
        );
        if (tutkintomuutos) {
          backendChangeObject.parent = tutkintomuutos.generatedId;
        } else {
          console.warn("Didn't manage to link tutkintokielet with tutkinto.");
        }
      } else {
        backendChangeObject.parentMaaraysUuid = tutkinto.maarays.uuid;
      }
      return backendChangeObject;
    }, listOfActiveLanguages || []);
  }

  return concat(additions, removals);
}
