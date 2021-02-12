import { isAdded, isInLupa, isRemoved } from "css/label";
import { compose, find, flatten, head, includes, isEmpty, isNil, map, path, prop, reject, toLower } from "ramda";
import { getDefaultAdditionForm } from "../../perustelut/muutMuutokset/index";
import getDefaultRemovalForm from "../../perustelut/lomakeosiot/poistolomake";
import { __ } from "i18n-for-browser";

/**
 * Ammatillinen koulutus - Esittelijän lomakenäkymä - Osio 5 - Yhteistyosopimukset.
 * @param {*} data
 * @param {*} isReadOnly
 * @param {*} locale
 */
export async function getModificationForm({ items, maarayksetByKoodiarvo }, { isReadOnly }, locale) {
    const localeUpper = locale.toUpperCase();
  const lomakerakenne = map(item => {
    // Käsitellään vain ensimmäinen määräys, koska niin on sovittu.
    const maarays =
      head(data.maarayksetByKoodiarvo[item.koodiarvo] || []) || {};
    
    const forChangeObject = reject(isNil, {
      koodiarvo: item.koodiarvo,
      koodisto: item.koodisto,
      maaraysUuid: maarays.uuid
    });

    return {
      anchor: "yhteistyosopimukset",
      components: [
        {
          anchor: "valintaelementti",
          name: "CheckboxWithLabel",
          properties: {
            forChangeObject,
            isChecked: !isEmpty(maarays),
            isIndeterminate: false,
            isReadOnly,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved,
              custom: !isEmpty(maarays) ? isInLupa : {}
            },
            title: __("common.lupaSisaltaaYhteistyosopimuksia")
          }
        }
      ],
      categories: [
        {
          anchor: "tekstikentta",
          components: [
            {
              anchor: "A",
              name: "TextBox",
              properties: {
                forChangeObject,
                isReadOnly,
                placeholder: __("common.kuvausPlaceholder"),
                title: __("common.maarayksenKuvaus"),
                value:
                  path(["meta", "yhteistyosopimus", "kuvaus"], maarays) || ""
              }
            }
          ]
        }
      ]
    };
  }, data.items);

  return lomakerakenne;
}

/**
 * Ammatillinen koulutus - Osio 5
 * Yhteistyö - Perustelulomakkeen muodostaminen.
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
      compose(includes(`.yhteistyosopimus.${item.koodiarvo}.`), prop("anchor")),
      changeObjects
    );
    if (!changeObj) {
      return null;
    }

    const isAddition = changeObj.properties.isChecked;

    return {
      anchor: "yhteistyosopimus",
      categories: flatten([
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
                  custom: !!maarays ? isInLupa : {}
                },
                title:
                  item.metadata[localeUpper].kuvaus ||
                  item.metadata[localeUpper].nimi
              }
            }
          ]
        },
        isAddition
          ? getDefaultAdditionForm(isReadOnly)
          : getDefaultRemovalForm(isReadOnly, prefix)
      ])
    };
  }, items).filter(Boolean);
}

export function getMuutYhteistyosopimus(
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
