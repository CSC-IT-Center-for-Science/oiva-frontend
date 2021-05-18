import { isAdded, isInLupa, isRemoved } from "../../../../css/label";
import { getMuutostarveCheckboxes } from "../common";
import "../../i18n-config";
import { __ } from "i18n-for-browser";
import {
  compose,
  filter,
  find,
  isEmpty,
  map,
  not,
  prop,
  propEq,
  toUpper,
  reject,
  isNil,
  concat
} from "ramda";
import { getAnchorPart } from "../../../../utils/common";
import { getOivaPerustelutFromStorage } from "helpers/oivaperustelut";

export const getAdditionForm = (checkboxItems, locale, isReadOnly = false) => {
  const checkboxes = getMuutostarveCheckboxes(
    checkboxItems,
    locale,
    isReadOnly
  );
  return [
    {
      anchor: "perustelut",
      layout: {
        indentation: "none"
      },
      title: __("muutospyynnon.taustalla.olevat.syyt"),
      categories: checkboxes
    }
  ];
};

export const getRemovalForm = isReadOnly => {
  return [
    {
      anchor: "removal",
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly,
            title:
              "Perustele lyhyesti miksi tutkintoon tähtäävää koulutusta ei haluta enää järjestää",
            value: "",
            requiredMessage: "Pakollinen tieto puuttuu"
          }
        }
      ]
    }
  ];
};

export const getOsaamisalaForm = (isReadOnly, osaamisalaTitle, koodiarvo) => {
  return [
    {
      anchor: `osaamisala.${koodiarvo}`,
      title: osaamisalaTitle,
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly,
            title: "Perustele lyhyesti miksi tälle muutokselle on tarvetta",
            value: "",
            requiredMessage: "Pakollinen tieto puuttuu"
          }
        }
      ]
    }
  ];
};

async function getCategoriesForPerustelut(
  isReadOnly,
  changeObjects,
  koulutusala,
  koulutustyypit,
  title,
  tutkinnotByKoulutustyyppi,
  locale
) {
  const oivaperustelut = await getOivaPerustelutFromStorage();

  console.info(changeObjects, oivaperustelut);

  const localeUpper = toUpper(locale);
  const currentDate = new Date();
  const structure = map(koulutustyyppi => {
    const tutkinnot = tutkinnotByKoulutustyyppi[koulutustyyppi.koodiarvo];
    if (tutkinnot) {
      return {
        anchor: koulutustyyppi.koodiarvo,
        meta: {
          areaCode: koulutusala.koodiarvo,
          title
        },
        title: koulutustyyppi.metadata[localeUpper].nimi,
        categories: map(tutkinto => {
          const anchor = `tutkinnot_${tutkinto.koulutusalakoodiarvo}.${tutkinto.koulutustyyppikoodiarvo}.${tutkinto.koodiarvo}.tutkinto`;
          const changeObj = find(
            propEq("anchor", anchor),
            tutkinnotChangeObjects
          );

          const osaamisalaChangeObjsForTutkinto = reject(isNil)(
            map(osaamisala => {
              const anchorOsaamisala = `tutkinnot_${tutkinto.koulutusalakoodiarvo}.${tutkinto.koulutustyyppikoodiarvo}.${tutkinto.koodiarvo}.${osaamisala.koodiarvo}.osaamisala`;
              return find(changeObject => {
                return changeObject.anchor === anchorOsaamisala;
              }, tutkinnotChangeObjects);
            }, tutkinto.osaamisalat)
          );

          if (!changeObj && !osaamisalaChangeObjsForTutkinto.length) {
            return null;
          }

          const isAddition = changeObj.properties.isChecked;

          const tutkintoCategory = isAddition
            ? getAdditionForm(oivaperustelut, locale, isReadOnly)
            : getRemovalForm(isReadOnly);

          const osaamisalaCategories = map(osaamisalaChangeObj => {
            const osaamisalaKoodiarvo = getAnchorPart(
              osaamisalaChangeObj.anchor,
              3
            );
            const osaamisalaTitle =
              osaamisalaKoodiarvo +
              " " +
              find(
                osaamisala => osaamisalaKoodiarvo === osaamisala.koodiarvo,
                tutkinto.osaamisalat
              ).metadata[localeUpper].nimi;
            return getOsaamisalaForm(
              isReadOnly,
              osaamisalaTitle,
              osaamisalaKoodiarvo
            )[0];
          }, osaamisalaChangeObjsForTutkinto);

          const categories = concat(tutkintoCategory, osaamisalaCategories);

          return new Date(tutkinto.voimassaAlkuPvm) < currentDate
            ? {
                anchor: tutkinto.koodiarvo,
                components: [
                  {
                    anchor: "tutkinto",
                    name: "StatusTextRow",
                    properties: {
                      code: tutkinto.koodiarvo,
                      title: tutkinto.metadata[localeUpper].nimi,
                      labelStyles: {
                        addition: isAdded,
                        removal: isRemoved,
                        custom: Object.assign(
                          {},
                          tutkinto.maarays ? isInLupa : {}
                        )
                      }
                    }
                  }
                ],
                categories: categories
              }
            : null;
        }, tutkinnot).filter(Boolean)
      };
    }
    return null;
  }, koulutustyypit).filter(Boolean);

  return filter(compose(not, isEmpty, prop("categories")), structure);
}

export default async function getTutkinnotPerustelulomake(
  action,
  data,
  { isReadOnly },
  locale,
  changeObjects
) {
  switch (action) {
    case "addition":
      return getAdditionForm(data.checkboxItems, locale, isReadOnly);
    case "osaamisala":
      return getOsaamisalaForm(isReadOnly);
    case "reasoning":
      return await getCategoriesForPerustelut(
        isReadOnly,
        changeObjects,
        data.koulutusala,
        data.koulutustyypit,
        data.title,
        data.tutkinnotByKoulutustyyppi,
        locale
      );
    case "removal":
      return getRemovalForm();
    default:
      return [];
  }
}
