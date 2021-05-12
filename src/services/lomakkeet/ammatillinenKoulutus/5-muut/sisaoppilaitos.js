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
  reject
} from "ramda";
import { scrollToOpiskelijavuodet } from "services/lomakkeet/muut/utils";
import getDefaultRemovalForm from "services/lomakkeet/perustelut/lomakeosiot/poistolomake";
import { getDefaultAdditionForm } from "../../perustelut/muutMuutokset/index";

/**
 * Ammatillinen koulutus - Esittelijän lomakenäkymä - Osio 5 - Sisaoppilaitos.
 * @param {*} data
 * @param {*} isReadOnly
 * @param {*} locale
 */
export function getModificationForm(
  { isApplyForValueSet, items, koodiarvot, maarayksetByKoodiarvo },
  { isReadOnly },
  locale
) {
  const localeUpper = locale.toUpperCase();
  return map(item => {
    const maarays = maarayksetByKoodiarvo[item.koodiarvo];
    const lomakerakenne = {
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

    /**
     * Mikäli käyttäjä ei ole täyttänyt opiskelijavuosiosiossa olevaa
     * sisäoppilaitosta koskevaa kenttää ja mikäli sisäoppilaitosta koskeva
     * checkbox-valinta on tässä osiossa aktiivinen, näytetään käyttäjälle
     * Alert-komponentti, joka opastaa käyttäjää täyttämään kentän.
     * Osana Alert-komponenttia näytetään linkki, jota klikkaamalla sivu
     * liukuu opiskelija-vuosiosion kohdalle.
     */
    if (includes(item.koodiarvo, koodiarvot) && !isApplyForValueSet) {
      lomakerakenne.categories = [
        {
          anchor: "notification",
          components: [
            {
              anchor: "A",
              name: "Alert",
              properties: {
                id: `${item.koodiarvo}-notification`,
                ariaLabel: "Notification",
                message: __("info.osion.4.tayttamisesta"),
                linkText: __("ilmoita.opiskelijavuosimaara"),
                handleLinkClick: scrollToOpiskelijavuodet
              }
            }
          ]
        }
      ];
    }

    return {
      anchor: "sisaoppilaitos",
      categories: [lomakerakenne]
    };
  }, items);
}

/**
 * Ammatillinen koulutus - Osio 5 -
 * Perustelulomakkeen muodostaminen - Sisaoppilaitos.
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
      compose(includes(`.sisaoppilaitos.${item.koodiarvo}.`), prop("anchor")),
      changeObjects
    );
    if (!changeObj) {
      return null;
    }

    const isAddition = changeObj.properties.isChecked;

    return {
      anchor: "sisaoppilaitos",
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
                  custom: maarays ? isInLupa : {}
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

export function getMuutSisaoppilaitos(
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
