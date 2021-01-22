import {
  find,
  filter,
  map,
  toUpper,
  equals,
  propEq,
  addIndex,
  split,
  flatten
} from "ramda";
import { getKieletFromStorage } from "helpers/kielet";
import { getKoulutustyypitFromStorage } from "helpers/koulutustyypit";
import { getAnchorPart } from "utils/common";
import { getTutkinnotFromStorage } from "helpers/tutkinnot";

async function getModificationForm(
  aktiivisetTutkinnot = [],
  isReadOnly,
  locale
) {
  const kielet = await getKieletFromStorage();
  const koulutustyypit = await getKoulutustyypitFromStorage();
  const localeUpper = toUpper(locale);
  const currentDate = new Date();
  return map(koulutustyyppi => {
    const tutkinnot = filter(tutkinto => {
      const koulutustyyppikoodiarvo = getAnchorPart(tutkinto.anchor, 1);
      return equals(koulutustyyppikoodiarvo, koulutustyyppi.koodiarvo);
    }, aktiivisetTutkinnot);
    if (tutkinnot.length) {
      return {
        anchor: koulutustyyppi.koodiarvo,
        title: koulutustyyppi.metadata[localeUpper].nimi,
        categories: map(tutkinto => {
          return {
            anchor: getAnchorPart(tutkinto.anchor, 2),
            components: [
              {
                anchor: "nimi",
                name: "StatusTextRow",
                properties: {
                  code: tutkinto.koodiarvo,
                  title: tutkinto.properties.title,
                  statusTextStyleClasses: [],
                  styleClasses: []
                }
              },
              {
                anchor: "kielet",
                name: "Autocomplete",
                properties: {
                  isReadOnly,
                  options: map(kieli => {
                    return {
                      label: kieli.metadata[localeUpper].nimi,
                      value: kieli.koodiarvo
                    };
                  }, kielet),
                  value: map(tutkintokielimaarays => {
                    if (
                      tutkintokielimaarays &&
                      (!tutkintokielimaarays.koodi.voimassaAlkuPvm ||
                        new Date(tutkintokielimaarays.koodi.voimassaAlkuPvm) <=
                          currentDate)
                    ) {
                      /**
                       * Jos tutkintokielelle löytyy voimassa oleva määräys,
                       * näytetään tutkintokieli autocomplete-kentässä.
                       **/
                      return {
                        label: find(
                          kieli =>
                            kieli.koodiarvo ===
                            toUpper(tutkintokielimaarays.koodiarvo),
                          kielet
                        ).metadata[localeUpper].nimi,
                        value: tutkintokielimaarays.koodiarvo
                      };
                    }
                    return null;
                  }, tutkinto.tutkintokielet || []).filter(Boolean)
                }
              }
            ]
          };
        }, tutkinnot).filter(Boolean)
      };
    }
    return null;
  }, koulutustyypit).filter(Boolean);
}

const getReasoningForm = async (
  { koulutusalakoodiarvo, maaraykset },
  isReadOnly,
  locale,
  changeObjects
) => {
  const localeUpper = toUpper(locale);
  const currentDate = new Date();

  const tutkinnot = await getTutkinnotFromStorage();

  return addIndex(map)((changeObj, i) => {
    const anchorParts = split(".", changeObj.anchor);
    const item = find(propEq("koodiarvo", anchorParts[2]), tutkinnot);

    // const koulutusalaMetadata = find(
    //   propEq("koodiarvo", item.koulutusalakoodiarvo),
    //   koulutusalat
    // ).metadata[toUpper(locale)];

    const metadata = item.metadata[toUpper(locale)];

    /**
     * There might be some sub articles (alimääräyksiä) under the current article (määräys).
     * We are interested of them which are related to tutkintokielet section.
     * */
    const maarays = find(propEq("koodiarvo", anchorParts[2]), maaraykset);
    const alimaaraykset = maarays ? maarays.aliMaaraykset : [];

    /**
     * selectedByDefault includes all the languages which already are in LUPA.
     * */
    const selectedByDefault = map(alimaarays => {
      if (
        alimaarays.kohde.tunniste === "opetusjatutkintokieli" &&
        new Date(alimaarays.koodi.voimassaAlkuPvm) < currentDate
      ) {
        const metadataObj = find(
          propEq("kieli", localeUpper),
          alimaarays.koodi.metadata
        );
        return metadataObj
          ? {
              label: metadataObj.nimi,
              value: alimaarays.koodi.koodiArvo
            }
          : null;
      }
      return null;
    }, alimaaraykset || []).filter(Boolean);
    return {
      anchor: `${anchorParts[1]}|${i}|`,
      code: item.koodiArvo,
      title: metadata.nimi,
      categories: addIndex(map)((language, index) => {
        const isSelectedByDefault = !!find(
          propEq("value", language.value),
          selectedByDefault
        );
        const isAdded = !isSelectedByDefault;
        const isRemoved =
          isSelectedByDefault &&
          !!!find(
            propEq("value", language.value),
            changeObj.properties.value || []
          );
        return isAdded || isRemoved
          ? {
              anchor: `${item.koodiarvo}${index > 0 ? index : ""}`,
              categories: [
                {
                  anchor: "title",
                  components: [
                    {
                      anchor: "A",
                      name: "StatusTextRow",
                      properties: {
                        title: `${language.label} (${language.value})`,
                        styleClasses: ["flex"],
                        statusTextStyleClasses: isAdded
                          ? ["text-green-600 pr-4 w-20 font-bold"]
                          : ["text-red-500 pr-4 w-20 font-bold"],
                        statusText: isAdded ? " LISÄYS:" : " POISTO:"
                      }
                    }
                  ]
                },
                {
                  anchor: "perustelut",
                  components: [
                    {
                      anchor: "A",
                      name: "TextBox",
                      properties: {
                        forChangeObject: {
                          koulutusalakoodiarvo,
                          title: "[Koulutusalan nimi tähän]"
                        },
                        isReadOnly: isReadOnly,
                        title: "Perustele muutos tähän, kiitos.",
                        value: ""
                      }
                    }
                  ]
                }
              ]
            }
          : [];
      }, flatten([selectedByDefault, changeObj.properties.value].filter(Boolean)))
    };
  }, changeObjects || []).filter(Boolean);
};

export default async function getTutkintokieletLomake(
  mode,
  data,
  { isReadOnly },
  locale,
  changeObjects = []
) {
  switch (mode) {
    case "modification":
      return await getModificationForm(data.aktiiviset, isReadOnly, locale);
    case "reasoning":
      return await getReasoningForm(data, isReadOnly, locale, changeObjects);
    default:
      return [];
  }
}
