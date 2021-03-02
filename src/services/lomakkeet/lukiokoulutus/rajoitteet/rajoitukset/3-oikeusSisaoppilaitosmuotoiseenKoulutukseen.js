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
import { getOikeusSisaoppilaitosmuotoiseenKoulutukseenFromStorage } from "helpers/oikeusSisaoppilaitosmuotoiseenKoulutukseen";

export default async function getOikeusSisaoppilaitosmuotoiseenKoulutukseen(
  isReadOnly,
  osionData = [],
  locale,
  useMultiselect = false
) {
  const oikeusSisaoppilaitosmuotoiseenKoulutukseen = await getOikeusSisaoppilaitosmuotoiseenKoulutukseenFromStorage();
  const localeUpper = toUpper(locale);

  if (oikeusSisaoppilaitosmuotoiseenKoulutukseen.length) {
    return [
      {
        anchor: "komponentti",
        name: "Autocomplete",
        styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
        properties: {
          forChangeObject: {
            section: "oikeusSisaoppilaitosmuotoiseenKoulutukseen"
          },
          isMulti: useMultiselect,
          isReadOnly,
          options: flatten(
            map(item => {
              /**
               * Tarkistetaan, onko kyseinen erityinen koulutustehtävä
               * valittuna lomakkeella, jota vasten rajoituksia ollaan
               * tekemässä.
               **/
              const stateObj = find(
                compose(
                  endsWith(`.${item.koodiarvo}.valinta`),
                  prop("anchor")
                ),
                osionData
              );

              if (stateObj && stateObj.properties.isChecked) {
                // Vaihtoehtoina näytetään kuvaukset, joten ne
                // on kaivettava osion datasta koodiarvolla.
                const kuvausStateObjects = filter(stateObj => {
                  return (
                    getAnchorPart(stateObj.anchor, 1) === item.koodiarvo &&
                    endsWith(".kuvaus.A", stateObj.anchor)
                  );
                }, osionData);

                /** Näytetään kuvaukset muille koulutuksenjärjestämiseen liittyville ehdoille, joille on koodistoon
                 * asetettu muuttujaan metadata.FI.kayttoohje arvo "Kuvaus". Muille näytetään nimi
                 */
                const options =
                  path(["metadata", "FI", "kayttoohje"], item) === "Kuvaus"
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
                        label: item.metadata[localeUpper].nimi,
                        value: `${item.koodiarvo}`
                      };

                return options;
              }

              return null;
            }, oikeusSisaoppilaitosmuotoiseenKoulutukseen).filter(Boolean)
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
