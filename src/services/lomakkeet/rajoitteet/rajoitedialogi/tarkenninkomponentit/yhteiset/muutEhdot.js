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
import { getLukioMuutEhdotFromStorage } from "../../../../../../helpers/lukioMuutEhdot";

export default async function getMuutEhdot(
  isReadOnly,
  osionData = [],
  locale,
  isMulti,
  inputId,
  koulutustyyppi
) {

  const muutEhdot =
    koulutustyyppi === "2"
      ? await getLukioMuutEhdotFromStorage()
      : await getPOMuutEhdotFromStorage();

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
          isMulti,
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
                return map(stateObj => {
                    return path(["metadata", "FI", "kayttoohje"], muuEhto) === "Kuvaus" ? {
                      value: `${getAnchorPart(
                        stateObj.anchor,
                        1
                      )}-${getAnchorPart(stateObj.anchor, 2)}`,
                      label: stateObj.properties.value,
                      useKuvausInRajoite: true
                    } : {
                      label: muuEhto.metadata[localeUpper].nimi,
                      value: `${muuEhto.koodiarvo}-0`,
                      kuvaus: stateObj.properties.value,
                      useKuvausInRajoite: false
                    };
                  }, kuvausStateObjects)
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
