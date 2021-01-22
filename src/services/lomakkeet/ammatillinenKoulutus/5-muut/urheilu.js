import { isAdded, isInLupa, isRemoved } from "css/label";
import {
  compose,
  find,
  flatten,
  includes,
  isNil,
  map,
  prop,
  reject
} from "ramda";
import {
  getDefaultAdditionForm,
  getDefaultRemovalForm
} from "services/lomakkeet/perustelut/muutMuutokset";

/**
 * Ammatillinen koulutus - Esittelijän lomakenäkymä - Osio 5 - Urheilu.
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
    return {
      anchor: "urheilu",
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

/**
 * Ammatillinen koulutus - Osio 5
 * Urheilu - Perustelulomakkeen muodostaminen.
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
      compose(includes(`.urheilu.${item.koodiarvo}.`), prop("anchor")),
      changeObjects
    );
    if (!changeObj) {
      return null;
    }

    const isAddition = changeObj.properties.isChecked;

    return {
      anchor: "urheilu",
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

export function getMuutUrheilu(
  mode,
  data,
  booleans,
  locale,
  changeObjects = [],
  functions,
  prefix
) {
  console.info(mode, changeObjects);
  switch (mode) {
    case "modification":
      return getModificationForm(data, booleans, locale);
    case "reasoning":
      return getReasoningForm(data, booleans, locale, changeObjects, prefix);
    default:
      return [];
  }
}
