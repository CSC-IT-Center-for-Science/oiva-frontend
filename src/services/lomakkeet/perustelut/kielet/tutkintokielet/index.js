import * as R from "ramda";

const getReasoningForm = (
  areaCode,
  changeObjects,
  maaraykset,
  tutkinnot,
  isReadOnly,
  locale
) => {
  const localeUpper = R.toUpper(locale);
  const currentDate = new Date();
  return R.addIndex(R.map)((changeObj, i) => {
    const anchorParts = R.split(".", changeObj.anchor);
    const item = R.find(
      R.propEq("koodiArvo", anchorParts[2]),
      tutkinnot[areaCode].koulutukset[anchorParts[1]].koulutukset
    );
    const koulutusalaMetadata = R.find(
      R.propEq("kieli", R.toUpper(locale)),
      tutkinnot[areaCode].metadata
    );
    const metadata = R.find(
      R.propEq("kieli", R.toUpper(locale)),
      item.metadata
    );

    /**
     * There might be some sub articles (alimääräyksiä) under the current article (määräys).
     * We are interested of them which are related to tutkintokielet section.
     * */
    const maarays = R.find(R.propEq("koodiarvo", anchorParts[2]), maaraykset);
    const alimaaraykset = maarays ? maarays.aliMaaraykset : [];

    /**
     * selectedByDefault includes all the languages which already are in LUPA.
     * */
    const selectedByDefault = R.map(alimaarays => {
      if (
        alimaarays.kohde.tunniste === "opetusjatutkintokieli" &&
        new Date(alimaarays.koodi.voimassaAlkuPvm) < currentDate
      ) {
        const metadataObj = R.find(
          R.propEq("kieli", localeUpper),
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
      categories: R.addIndex(R.map)((language, index) => {
        const isSelectedByDefault = !!R.find(
          R.propEq("value", language.value),
          selectedByDefault
        );
        const isAdded = !isSelectedByDefault;
        const isRemoved =
          isSelectedByDefault &&
          !!!R.find(
            R.propEq("value", language.value),
            changeObj.properties.value || []
          );
        return isAdded || isRemoved
          ? {
              anchor: `${item.koodiArvo}${index > 0 ? index : ""}`,
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
                          areaCode,
                          title: koulutusalaMetadata.nimi
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
      }, R.flatten([selectedByDefault, changeObj.properties.value].filter(Boolean)))
    };
  }, changeObjects || []).filter(Boolean);
};

export default function getTutkintokieletPerustelulomake(
  action,
  data,
  isReadOnly,
  locale
) {
  switch (action) {
    case "reasoning":
      return getReasoningForm(
        data.areaCode,
        data.changeObjectsPage1,
        data.maaraykset,
        data.tutkinnot,
        isReadOnly,
        locale
      );
    default:
      return [];
  }
}
