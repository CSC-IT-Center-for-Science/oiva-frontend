import { getOpetustehtavatFromStorage } from "helpers/opetustehtavat";
import { compose, endsWith, find, map, prop, toUpper } from "ramda";

export default async function getOpetustehtavatlomake(osionData = [], locale) {
  const opetustehtavat = await getOpetustehtavatFromStorage();
  const localeUpper = toUpper(locale);

  if (opetustehtavat.length) {
    return {
      anchor: "rajoitus",
      // layout: { indentation: "none" },
      components: [
        {
          anchor: "opetustehtavat",
          name: "Autocomplete",
          styleClasses: ["w-2/3", "mb-6"],
          properties: {
            forChangeObject: {
              section: "getOpetustehtavatLomake"
            },
            options: map(opetustehtava => {
              /**
               * Tarkistetaan, onko kyseinen opetustehtävä valittuna
               * lomakkeella, jota vasten rajoituksia ollaan tekemässä.
               **/
              const stateObj = find(
                compose(
                  endsWith(`.${opetustehtava.koodiarvo}`),
                  prop("anchor")
                ),
                osionData
              );

              /**
               * Jos valinnan tilasta kertova objekti on olemassa ja sen
               * isChecked-arvo on true, tarkoittaa se sitä, että kyseinen
               * opetustehtävä on päälomakkeella valitttuna. Tällöin
               * mahdollistetaan sen valitseminen yhdeksi rajoitteista.
               */
              return stateObj && stateObj.properties.isChecked
                ? {
                    label: opetustehtava.metadata[localeUpper].nimi,
                    value: opetustehtava.koodiarvo
                  }
                : null;
            }, opetustehtavat).filter(Boolean),
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
