import { isAdded, isInLupa, isRemoved } from "css/label";
import { __ } from "i18n-for-browser";
import {
  compose,
  find,
  flatten,
  includes,
  isNil,
  map,
  prop,
  reject,
  toLower
} from "ramda";
import { getDefaultAdditionForm } from "../../perustelut/muutMuutokset/index";
import getDefaultRemovalForm from "../../perustelut/lomakeosiot/poistolomake";

/**
 * Ammatillinen koulutus - Esittelijän lomakenäkymä - Osio 5 - Yhteistyosopimukset.
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
      anchor: "yhteistyosopimus",
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
                title
              }
            }
          ],
          categories: mitaHaluatHakea
        }
      ]
    };
  }, items);
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
