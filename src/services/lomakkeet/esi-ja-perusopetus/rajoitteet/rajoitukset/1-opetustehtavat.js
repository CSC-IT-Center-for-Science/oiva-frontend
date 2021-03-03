import { getOpetustehtavatFromStorage } from "helpers/opetustehtavat";
import { compose, endsWith, find, map, prop } from "ramda";
import { getLocalizedProperty } from "../../../utils";

export default async function getOpetustehtavakomponentit(
  isReadOnly,
  osionData = [],
  locale,
  useMultiselect = false,
  inputId
) {
  const opetustehtavat = await getOpetustehtavatFromStorage();

  if (opetustehtavat.length) {
    return [
      {
        anchor: "komponentti",
        name: "Autocomplete",
        styleClasses: ["w-4/5", "xl:w-2/3", "mb-6"],
        properties: {
          forChangeObject: {
            section: "getOpetustehtavatLomake"
          },
          inputId,
          isMulti: useMultiselect,
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
