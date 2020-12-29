import { getPOErityisetKoulutustehtavatFromStorage } from "helpers/poErityisetKoulutustehtavat";
import { compose, endsWith, find, map, prop, toUpper } from "ramda";

export default async function getErityisetKoulutustehtavat(
  isReadOnly,
  osionData = [],
  locale
) {
  const erityisetKoulutustehtavat = await getPOErityisetKoulutustehtavatFromStorage();
  const localeUpper = toUpper(locale);

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
          options: map(erityinenKoulutustehtava => {
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

            return stateObj && stateObj.properties.isChecked
              ? {
                  label: erityinenKoulutustehtava.metadata[localeUpper].nimi,
                  value: erityinenKoulutustehtava.koodiarvo
                }
              : null;
          }, erityisetKoulutustehtavat).filter(Boolean),
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
