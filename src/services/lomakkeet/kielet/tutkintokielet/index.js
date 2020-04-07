import * as R from "ramda";

function getModificationForm(
  tutkintolomake,
  tutkintomuutokset,
  kielet,
  maaraykset = [],
  locale
) {
  const localeUpper = R.toUpper(locale);
  const currentDate = new Date();
  return R.map(category => {
    const areaCode = category.meta.areaCode;
    const categories = R.map(subCategory => {
      /**
       * There might be some sub articles (alimääräyksiä) under the current article (määräys).
       * We are interested of them which are related to tutkintokielet section.
       * */
      const maarays = R.find(
        R.propEq("koodiarvo", subCategory.anchor),
        maaraykset
      );
      const alimaaraykset = maarays ? maarays.aliMaaraykset : [];

      /**
       * selectedByDefault includes all the languages which already are in LUPA.
       * Those languages must be shown on Autocomplete as selected by default.
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
            ? { label: metadataObj.nimi, value: alimaarays.koodi.koodiArvo }
            : null;
        }
        return null;
      }, alimaaraykset || []).filter(Boolean);

      // Let's create the updatedSubCategory variable without categories key
      let { categories, ...updatedSubCategory } = subCategory;
      let changeObj = null;
      if (tutkintomuutokset) {
        const anchor = `tutkinnot_${R.join(".", [
          areaCode,
          category.anchor,
          subCategory.anchor,
          subCategory.components[0].anchor
        ])}`;
        changeObj = R.find(R.propEq("anchor", anchor), tutkintomuutokset || []);
      }
      if (
        (subCategory.components[0].properties.isChecked && !changeObj) ||
        (changeObj && changeObj.properties.isChecked)
      ) {
        updatedSubCategory.components = [
          {
            ...subCategory.components[0],
            anchor: "A",
            name: "StatusTextRow",
            properties: {
              name: "StatusTextRow",
              code: subCategory.components[0].properties.code,
              title: subCategory.components[0].properties.title,
              labelStyles: {}
            }
          },
          {
            anchor: "B",
            name: "Autocomplete",
            properties: {
              forChangeObject:
                subCategory.components[0].properties.forChangeObject,
              options: R.map(language => {
                return {
                  label:
                    R.find(m => {
                      return m.kieli === localeUpper;
                    }, language.metadata).nimi || "[Kielen nimi tähän]",
                  value: language.koodiArvo
                };
              }, kielet),
              value: selectedByDefault
            }
          }
        ];
      } else {
        updatedSubCategory = null;
      }
      return updatedSubCategory;
    }, category.categories).filter(Boolean);
    return categories.length
      ? {
          ...category,
          categories
        }
      : null;
  }, tutkintolomake).filter(Boolean);
}

export default function getTutkintokieletLomake(
  action,
  data,
  isReadOnly,
  locale
) {
  switch (action) {
    case "modification":
      return getModificationForm(
        data.tutkintolomake,
        data.tutkintomuutokset,
        data.kielet,
        data.maaraykset,
        locale
      );
    default:
      return [];
  }
}
