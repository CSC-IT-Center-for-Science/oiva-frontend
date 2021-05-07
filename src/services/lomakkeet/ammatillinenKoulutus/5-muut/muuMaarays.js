import { isAdded, isInLupa, isRemoved } from "css/label";
import { __ } from "i18n-for-browser";
import {
  compose,
  find,
  flatten,
  includes,
  isNil,
  map,
  path,
  prop,
  reject
} from "ramda";
import { getDefaultAdditionForm } from "../../perustelut/muutMuutokset/index";
import getDefaultRemovalForm from "../../perustelut/lomakeosiot/poistolomake";

/**
 * Ammatillinen koulutus - Esittelijän lomakenäkymä - Osio 5 - Muu määräys.
 * @param {*} data
 * @param {*} isReadOnly
 * @param {*} locale
 */
export function getModificationForm(
  { items, maarayksetByKoodiarvo },
  { isReadOnly },
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
                custom: maarays ? isInLupa : {}
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
                  value: path(["meta", "value"], maarays),
                  placeholder: __("other.placeholder")
                }
              }
            ]
          }
        ];
      }
    }
    return lomakerakenne
      ? {
          anchor: "muumaarays",
          categories: [lomakerakenne]
        }
      : null;
  }, items).filter(Boolean);
}

/**
 * Ammatillinen koulutus - Osio 5
 * Muu määräys - Perustelulomakkeen muodostaminen.
 * @param {*} data
 * @param {*} isReadOnly
 * @param {*} locale
 */
export function getReasoningForm(
  { items, maarayksetByKoodiarvo },
  { isReadOnly },
  locale,
  changeObjects,
  prefix
) {
  const localeUpper = locale.toUpperCase();
  return map(item => {
    const maarays = maarayksetByKoodiarvo[item.koodiarvo];
    const changeObj = find(
      compose(includes(`.muumaarays.${item.koodiarvo}.`), prop("anchor")),
      changeObjects
    );
    if (!changeObj) {
      return null;
    }

    const isAddition = changeObj.properties.isChecked;

    return {
      anchor: "muumaarays",
      categories: [
        {
          anchor: item.koodiarvo,
          components: [
            {
              anchor: "A",
              name: "StatusTextRow",
              properties: {
                forChangeObject: reject(isNil, {
                  koodiarvo: item.koodiarvo,
                  koodisto: item.koodisto,
                  maaraysUuid: (maarays || {}).uuid
                }),
                isReadOnly,
                labelStyles: {
                  addition: isAdded,
                  removal: isRemoved,
                  custom: maarays ? isInLupa : {}
                },
                title:
                  item.metadata[localeUpper].kuvaus ||
                  item.metadata[localeUpper].nimi
              }
            }
          ],
          categories: flatten([
            item.koodiarvo === "22"
              ? {
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
                        isReadOnly: true,
                        placeholder: __("other.placeholder")
                      }
                    }
                  ]
                }
              : null,
            isAddition
              ? getDefaultAdditionForm(isReadOnly)
              : getDefaultRemovalForm(isReadOnly, prefix)
          ]).filter(Boolean)
        }
      ]
    };
  }, items).filter(Boolean);
}

export function getMuutMuuMaarays(
  mode,
  data,
  booleans,
  locale,
  changeObjects = [],
  functions,
  prefix
) {
  switch (mode) {
    case "modification":
      return getModificationForm(data, booleans, locale);
    case "reasoning":
      return getReasoningForm(data, booleans, locale, changeObjects, prefix);
    default:
      return [];
  }
}
