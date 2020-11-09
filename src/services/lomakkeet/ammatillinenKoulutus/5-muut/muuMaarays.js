import { isAdded, isInLupa, isRemoved } from "css/label";
import { __ } from "i18n-for-browser";
import { isNil, map, reject } from "ramda";

/**
 * Ammatillinen koulutus - Esittelijän lomakenäkymä - Osio 5 - Muu määräys.
 * @param {*} data
 * @param {*} isReadOnly
 * @param {*} locale
 */
export function getMuutMuuMaarays(
  { items, maarayksetByKoodiarvo },
  isReadOnly,
  locale
) {
  const localeUpper = locale.toUpperCase();
  return map(item => {
    const maarays = maarayksetByKoodiarvo[item.koodiarvo];
    let lomakerakenne = null;
    if (item.koodiarvo !== "15" || !!maarays) {
      lomakerakenne = {
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
      };

      if (item.koodiarvo === "22") {
        lomakerakenne.categories = [
          {
            anchor: "other",
            components: [
              {
                anchor: "A",
                name: "TextBox",
                properties: {
                  forChangeObject: {
                    koodiarvo: item.koodiarvo,
                    koodisto: item.koodisto
                  },
                  placeholder: __("other.placeholder")
                }
              }
            ]
          }
        ];
      }
    }
    return !!lomakerakenne
      ? {
          anchor: "muumaarays",
          categories: [lomakerakenne]
        }
      : null;
  }, items).filter(Boolean);
}
