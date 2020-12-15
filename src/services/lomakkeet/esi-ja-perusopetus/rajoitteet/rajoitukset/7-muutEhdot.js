import { getPOMuutEhdotFromStorage } from "helpers/poMuutEhdot";
import { compose, endsWith, find, map, prop, toUpper } from "ramda";

export default async function getMuutEhdot(osionData = [], locale) {
  const muutEhdot = await getPOMuutEhdotFromStorage();
  const localeUpper = toUpper(locale);

  console.info(osionData);

  if (muutEhdot.length) {
    return {
      anchor: "rajoitus",
      components: [
        {
          anchor: "muutEhdot",
          name: "Autocomplete",
          styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
          properties: {
            forChangeObject: {
              section: "muutEhdot"
            },
            options: map(muuEhto => {
              console.info(muuEhto.koodiarvo);
              /**
               * Tarkistetaan, onko kyseinen muu ehto
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
              return stateObj && stateObj.properties.isChecked
                ? {
                    label: muuEhto.metadata[localeUpper].nimi,
                    value: muuEhto.koodiarvo
                  }
                : null;
            }, muutEhdot).filter(Boolean),
            value: ""
          }
        }
      ]
    };
  } else {
    return {
      anchor: "ei-valintamahdollisuutta",
      components: [
        {
          anchor: "teksti",
          name: "StatusTextRow",
          properties: {
            title: "Ei valintamahdollisuutta."
          }
        }
      ]
    };
  }
}
