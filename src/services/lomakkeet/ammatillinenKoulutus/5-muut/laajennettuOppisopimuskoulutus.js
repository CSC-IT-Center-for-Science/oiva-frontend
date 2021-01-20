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
import { getOppisopimusPerusteluLomake } from "../../perustelut/muut";
import getDefaultRemovalForm from "services/lomakkeet/perustelut/lomakeosiot/poistolomake";

/**
 * Ammatillinen koulutus - Esittelijän lomakenäkymä - Osio 5 - Laajennettu.
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
      anchor: "laajennettuOppisopimuskoulutus",
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
 * Laajennettu oppisopimuskoulutus - Perustelulomakkeen muodostaminen.
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
      compose(
        includes(`.laajennettuOppisopimuskoulutus.${item.koodiarvo}.`),
        prop("anchor")
      ),
      changeObjects
    );
    if (!changeObj) {
      return null;
    }

    const isAddition = changeObj.properties.isChecked;

    return {
      anchor: "laajennettuOppisopimuskoulutus",
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
          ? getOppisopimusPerusteluLomake(isReadOnly)
          : getDefaultRemovalForm(isReadOnly, prefix)
      ])
    };
  }, items).filter(Boolean);
}

export function getMuutLaajennettu(
  mode,
  data,
  booleans,
  locale,
  changeObjects,
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
