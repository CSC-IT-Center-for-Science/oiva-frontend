import { isAdded, isInLupa, isRemoved } from "css/label";
import { isNil, map, reject } from "ramda";

/**
 * Ammatillinen koulutus - Esittelijän lomakenäkymä - Osio 5 - Selvitykset.
 * @param {*} data
 * @param {*} isReadOnly
 * @param {*} locale
 */
export function getMuutSelvitykset(
  { items, maarayksetByKoodiarvo },
  isReadOnly,
  locale
) {
  const localeUpper = locale.toUpperCase();
  return map(item => {
    const maarays = maarayksetByKoodiarvo[item.koodiarvo];
    return {
      anchor: "selvitykset",
      categories: [
        {
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
                title:
                  item.metadata[localeUpper].kuvaus ||
                  item.metadata[localeUpper].nimi
              }
            }
          ]
        }
      ]
    };
  }, items);
}
