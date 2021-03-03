import { getPOMuutEhdotFromStorage } from "helpers/poMuutEhdot";
import {
  compose,
  endsWith,
  filter,
  find,
  flatten,
  map,
  path,
  prop,
  toUpper
} from "ramda";
import { getAnchorPart } from "utils/common";

export default async function getMuutEhdot(
  isReadOnly,
  osionData = [],
  locale,
  useMultiselect = false,
  inputId
) {
  const muutEhdot = await getPOMuutEhdotFromStorage();
  const localeUpper = toUpper(locale);

  if (muutEhdot.length) {
    return [
      {
        anchor: "komponentti",
        name: "Autocomplete",
        styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
        properties: {
          forChangeObject: {
            section: "muutEhdot"
          },
          inputId,
          isMulti: useMultiselect,
          isReadOnly,
          options: flatten(
            map(muuEhto => {
              /**
               * Tarkistetaan, onko kyseinen erityinen koulutustehtävä
               * valittuna lomakkeella, jota vasten rajoituksia ollaan
               * tekemässä.
               **/
              const stateObj = find(
                compose(
                  endsWith(`.${muuEhto.koodiarvo}.valintaelementti`),
                  prop("anchor")
                ),
                osionData
              );

              if (stateObj && stateObj.properties.isChecked) {
                // Vaihtoehtoina näytetään kuvaukset, joten ne
                // on kaivettava osion datasta koodiarvolla.
                const kuvausStateObjects = filter(stateObj => {
                  return (
                    getAnchorPart(stateObj.anchor, 1) === muuEhto.koodiarvo &&
                    endsWith(".kuvaus", stateObj.anchor)
                  );
                }, osionData);

                /** Näytetään kuvaukset muille koulutuksenjärjestämiseen liittyville ehdoille, joille on koodistoon
                 * asetettu muuttujaan metadata.FI.kayttoohje arvo "Kuvaus". Muille näytetään nimi
                 */
                const options =
                  path(["metadata", "FI", "kayttoohje"], muuEhto) === "Kuvaus"
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
                        label: muuEhto.metadata[localeUpper].nimi,
                        value: `${muuEhto.koodiarvo}-0`
                      };

                return options;
              }

              return null;
            }, muutEhdot).filter(Boolean)
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
