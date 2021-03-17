import { getOpetustehtavatFromStorage } from "helpers/opetustehtavat";
import { compose, endsWith, find, map, prop } from "ramda";
import { getLocalizedProperty } from "services/lomakkeet/utils";

export default async function getOpetustehtavakomponentit(
  isReadOnly,
  osionData = [],
  locale,
  isMulti,
  inputId
) {
  const opetustehtavat = await getOpetustehtavatFromStorage();
  let lomakerakenne = [
    {
      anchor: "teksti",
      name: "StatusTextRow",
      properties: {
        title: "Ei valintamahdollisuutta."
      }
    }
  ];
  if (opetustehtavat.length) {
    lomakerakenne = [
      {
        anchor: "komponentti",
        name: "Autocomplete",
        styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
        properties: {
          forChangeObject: {
            section: "getOpetustehtavatLomake"
          },
          inputId,
          isMulti,
          isReadOnly,
          options: map(opetustehtava => {
            /**
             * Tarkistetaan, onko kyseinen opetustehtävä valittuna
             * lomakkeella, jota vasten rajoituksia ollaan tekemässä.
             **/
            const stateObj = find(
              compose(endsWith(`.${opetustehtava.koodiarvo}`), prop("anchor")),
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
                  label: getLocalizedProperty(
                    opetustehtava.metadata,
                    locale,
                    "nimi"
                  ),
                  value: opetustehtava.koodiarvo
                }
              : null;
          }, opetustehtavat).filter(Boolean),
          value: ""
        }
      }
    ];
  }

  return lomakerakenne;
}
