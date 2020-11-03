import { isAdded, isInLupa, isRemoved } from "css/label";
import { __ } from "i18n-for-browser";
import { isNil, map, reject, toLower } from "ramda";

/**
 * Ammatillinen koulutus - Esittelijän lomakenäkymä - Osio 5 - Yhteistyosopimukset.
 * @param {*} data
 * @param {*} isReadOnly
 * @param {*} locale
 */
export function getMuutYhteistyosopimus(
  { items, maarayksetByKoodiarvo },
  isReadOnly,
  locale
) {
  const localeUpper = locale.toUpperCase();

  return map(item => {
    const maarays = maarayksetByKoodiarvo[item.koodiarvo];
    let title =
      item.metadata[localeUpper].kuvaus || item.metadata[localeUpper].nimi;
    let mitaHaluatHakea = [];

    /**
     * Koodi 8 on erikoistapaus. Sen kohdalla, ei käytetä koodistosta tulevaa
     * kuvaustekstiä, vaan kuvausteksti kaivetaan koodiarvoa 8 koskevan
     * määräyksen alta. Tämä johtuu siitä, että eri koulutuksen
     * järjestäjillä on koodiarvolla 8 erilaisia kuvaustekstejä.
     **/
    if (item.koodiarvo === "8") {
      title = maarays
        ? maarays.meta["yhteistyösopimus"][toLower(locale)]
        : title;
      mitaHaluatHakea = [
        {
          anchor: "tekstikentta",
          components: [
            {
              anchor: "A",
              name: "TextBox",
              properties: {
                forChangeObject: reject(isNil, {
                  koodiarvo: item.koodiarvo,
                  koodisto: item.koodisto,
                  maaraysUuid: (maarays || {}).uuid
                }),
                placeholder: __("other.placeholder")
              }
            }
          ]
        }
      ];
    }

    return {
      anchor: item.koodiarvo,
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            forChangeObject: reject(isNil, {
              koodiarvo: item.koodiarvo,
              koodisto: item.koodisto,
              maaraysUuid: (maarays || {}).uuid
            }),
            isChecked: !!maarays,
            isReadOnly,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved,
              custom: !!maarays ? isInLupa : {}
            },
            title
          }
        }
      ],
      categories: mitaHaluatHakea
    };
  }, items);
}
