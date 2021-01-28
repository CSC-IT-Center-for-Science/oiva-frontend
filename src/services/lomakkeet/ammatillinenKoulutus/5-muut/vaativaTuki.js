import { isAdded, isInLupa, isRemoved } from "css/label";
import { __ } from "i18n-for-browser";
import {
  compose,
  concat,
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
import { getVaativaErityinenTukilomake } from "services/lomakkeet/perustelut/muut";

/**
 * Ammatillinen koulutus - Esittelijän lomakenäkymä - Osio 5 - Vaativa tuki.
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
  return [
    {
      /**
       * Radio button -valinnat
       */
      anchor: "vaativatuki",
      title: __("wizard.chooseOnlyOne"),
      categories: map(item => {
        const maarays = maarayksetByKoodiarvo[item.koodiarvo];
        const lomakerakenne = {
          anchor: item.koodiarvo,
          components: [
            {
              anchor: "A",
              name: "RadioButtonWithLabel",
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

        /**
         * Kun jokin radio button -elementti on valittuna - pois lukien -
         * viimeinen, eikä opiskelijavuosiosiossa ole arvoa vaativaa tukea
         * koskevassa kentässä, näytetään Alert-komponentti, joka opastaa
         * käyttäjää täyttämään opiskelijavuosiosion tyhjän kentän.
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

        return lomakerakenne;
      }, items.vaativa_1)
    },
    {
      /**
       * Checkbox-valinnat
       */
      anchor: "vaativatuki",
      title: __("wizard.chooseAdditional"),
      categories: map(item => {
        const maarays = maarayksetByKoodiarvo[item.koodiarvo];
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
                title:
                  item.metadata[localeUpper].kuvaus ||
                  item.metadata[localeUpper].nimi
              }
            }
          ]
        };
      }, items.vaativa_2)
    }
  ];
}

/**
 * Ammatillinen koulutus - Osio 5
 * Vaativa tuki - Perustelulomakkeen muodostaminen.
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
      compose(includes(`.vaativatuki.${item.koodiarvo}.`), prop("anchor")),
      changeObjects
    );
    if (!changeObj) {
      return null;
    }

    const isAddition = changeObj.properties.isChecked;

    return {
      anchor: "vaativatuki",
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
          ? getVaativaErityinenTukilomake(isReadOnly)
          : getDefaultRemovalForm(isReadOnly, prefix)
      ])
    };
  }, concat(items.vaativa_1, items.vaativa_2)).filter(Boolean);
}

export function getMuutVaativaTuki(
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
