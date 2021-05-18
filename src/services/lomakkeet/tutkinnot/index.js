import { isAdded, isRemoved, isInLupa } from "../../../css/label";
import {
  toUpper,
  filter,
  map,
  propEq,
  find,
  isNil,
  reject,
  concat
} from "ramda";
import { __ } from "i18n-for-browser";
import { getMuutostarveCheckboxes } from "../perustelut/common";
import { getOivaPerustelutFromStorage } from "helpers/oivaperustelut";
import { getAnchorPart } from "utils/common";

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

async function getModificationForm(
  koulutusala,
  koulutustyypit,
  mode,
  title,
  tutkinnotByKoulutustyyppi,
  locale,
  isReadOnly = false,
  changeObjects = []
) {
  const oivaperustelut = await getOivaPerustelutFromStorage();
  const localeUpper = toUpper(locale);
  return map(koulutustyyppi => {
    const tutkinnot = tutkinnotByKoulutustyyppi[koulutustyyppi.koodiarvo];
    if (tutkinnot) {
      return {
        anchor: koulutustyyppi.koodiarvo,
        meta: {
          areaCode: koulutusala.koodiarvo,
          title
        },
        code: koulutustyyppi.koodiarvo,
        title: koulutustyyppi.metadata[localeUpper].nimi,
        categories: map(tutkinto => {
          const osaamisalatWithoutMaarays = filter(
            osaamisala => !osaamisala.maarays,
            tutkinto.osaamisalat
          );
          // Muodostetaan muutosobjektin ankkuri ja etsitään
          // sillä muutosta. Jos muutos on olemassa, luodaan
          // sille perustelukenttä.
          const anchor = `tutkinnot_${tutkinto.koulutusalakoodiarvo}.${tutkinto.koulutustyyppikoodiarvo}.${tutkinto.koodiarvo}.tutkinto`;
          const changeObj = find(propEq("anchor", anchor), changeObjects);

          const osaamisalaChangeObjsForTutkinto = reject(isNil)(
            map(osaamisala => {
              const anchorOsaamisala = `tutkinnot_${tutkinto.koulutusalakoodiarvo}.${tutkinto.koulutustyyppikoodiarvo}.${tutkinto.koodiarvo}.${osaamisala.koodiarvo}.osaamisala`;
              return find(changeObject => {
                return changeObject.anchor === anchorOsaamisala;
              }, changeObjects);
            }, tutkinto.osaamisalat)
          );

          let reasoningLomakeosio = [];

          if (mode === "reasoning") {
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

            reasoningLomakeosio = concat(
              tutkintoCategory,
              osaamisalaCategories
            );
          }

          return {
            anchor: tutkinto.koodiarvo,
            components:
              mode === "modification"
                ? [
                    {
                      anchor: "tutkinto",
                      name: "CheckboxWithLabel",
                      properties: {
                        code: tutkinto.koodiarvo,
                        title: tutkinto.metadata[localeUpper].nimi,
                        isChecked: !!tutkinto.maarays,
                        isIndeterminate:
                          osaamisalatWithoutMaarays.length !==
                          tutkinto.osaamisalat.length,
                        isReadOnly,
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
                  ]
                : [],
            categories:
              mode === "modification"
                ? map(osaamisala => {
                    return {
                      anchor: osaamisala.koodiarvo,
                      components: [
                        {
                          anchor: "osaamisala",
                          name: "CheckboxWithLabel",
                          properties: {
                            code: osaamisala.koodiarvo,
                            isReadOnly,
                            title: osaamisala.metadata[localeUpper].nimi,
                            labelStyles: {
                              addition: isAdded,
                              removal: isRemoved,
                              custom: Object.assign(
                                {},
                                // bold text if tutkinto is in lupa, but osaamisalarajoitus is not
                                !!tutkinto.maarays && !osaamisala.maarays
                                  ? isInLupa
                                  : {}
                              )
                            },
                            isChecked: !!tutkinto.maarays && !osaamisala.maarays
                          }
                        }
                      ]
                    };
                  }, tutkinto.osaamisalat)
                : mode === "reasoning"
                ? reasoningLomakeosio
                : []
          };
        }, tutkinnot).filter(Boolean)
      };
    }
    return null;
  }, koulutustyypit).filter(Boolean);
}

export default async function getTutkinnotLomake(
  mode,
  data,
  { isReadOnly },
  locale,
  changeObjects
) {
  return await getModificationForm(
    data.koulutusala,
    data.koulutustyypit,
    mode,
    data.title,
    data.tutkinnotByKoulutustyyppi,
    locale,
    isReadOnly,
    changeObjects
  );
}
