import { getPOErityisetKoulutustehtavatFromStorage } from "helpers/poErityisetKoulutustehtavat";
import {
  compose,
  endsWith,
  filter,
  find,
  flatten,
  length,
  map,
  prop,
  toUpper,
  path
} from "ramda";
import { getAnchorPart } from "utils/common";

export default async function getErityisetKoulutustehtavat(
  isReadOnly,
  osionData = [],
  locale
) {
  const localeUpper = toUpper(locale);
  const erityisetKoulutustehtavat = await getPOErityisetKoulutustehtavatFromStorage();

  if (erityisetKoulutustehtavat.length) {
    return [
      {
        anchor: "erityisetKoulutustehtavat",
        name: "Autocomplete",
        styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
        properties: {
          forChangeObject: {
            section: "erityisetKoulutustehtavat"
          },
          isMulti: false,
          isReadOnly,
          options: flatten(
            map(erityinenKoulutustehtava => {
              /**
               * Tarkistetaan, onko kyseinen erityinen koulutustehtävä
               * valittuna lomakkeella, jota vasten rajoituksia ollaan
               * tekemässä.
               **/
              const stateObj = find(
                compose(
                  endsWith(
                    `.${erityinenKoulutustehtava.koodiarvo}.valintaelementti`
                  ),
                  prop("anchor")
                ),
                osionData
              );

              if (stateObj && stateObj.properties.isChecked) {
                // Vaihtoehtoina näytetään kuvaukset, joten ne
                // on kaivettava osion datasta koodiarvolla.
                const kuvausStateObjects = filter(stateObj => {
                  return (
                    getAnchorPart(stateObj.anchor, 1) ===
                      erityinenKoulutustehtava.koodiarvo &&
                    endsWith(".kuvaus", stateObj.anchor)
                  );
                }, osionData);

                /** Näytetään kuvaus/kuvaukset seuraaville koodiarvoille (Jos ensimmäiseen kuvaukseen on kirjoitettu jotain)
                 * 2 - Kieliin ja kulttuuriin painottuva opetus
                 * 3 - Muu erityinen koulutustehtävä */
                const options =
                  (erityinenKoulutustehtava.koodiarvo === "2" || erityinenKoulutustehtava.koodiarvo === "3")
                  && length(kuvausStateObjects) > 0 && path(["properties", "value"], kuvausStateObjects[0])
                    ? map(stateObj => {
                        const option = {
                          value: `${getAnchorPart(
                            stateObj.anchor,
                            1
                          )}-${getAnchorPart(stateObj.anchor, 2)}`,
                          label: stateObj.properties.value
                        };
                        return option;
                      }, kuvausStateObjects)
                    : {
                        label:
                          erityinenKoulutustehtava.metadata[localeUpper].nimi,
                        value: `${erityinenKoulutustehtava.koodiarvo}-`
                      };

                return options;
              }

              return null;
            }, erityisetKoulutustehtavat).filter(Boolean)
          ),
          value: ""
        }
      }
    ];
  } else {
    return [
      {
        anchor: "teksti",
        name: "StatusTextRow",
        properties: {
          title: "Ei valintamahdollisuutta."
        }
      }
    ];
  }
}
