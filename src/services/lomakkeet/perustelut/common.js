import * as R from "ramda";

export const getMuutostarveCheckboxes = (
  oivaperustelut,
  locale,
  isReadOnly = false
) => {
  const localeUpper = R.toUpper(locale);
  const structure = R.addIndex(R.map)((perustelu, i) => {
    const checkboxCategory = {
      anchor: perustelu.koodiarvo,
      layout: {
        margins: { top: "none" },
        indentation: "none"
      },
      components: [
        {
          anchor: "A",
          name: "CheckboxWithLabel",
          properties: {
            isChecked: false,
            isReadOnly,
            title: perustelu.metadata[localeUpper].nimi,
            forChangeObject: {
              fieldName: perustelu.metadata[localeUpper].nimi
            }
          }
        }
      ]
    };
    if (i === oivaperustelut.length - 1) {
      checkboxCategory.categories = [
        {
          anchor: "muu-perustelu",
          components: [
            {
              anchor: "A",
              name: "TextBox",
              properties: {
                isReadOnly,
                title:
                  "Perustele lyhyesti miksi tutkintoon johtavaa koulutusta halutaan järjestää",
                value: "",
                requiredMessage: "Pakollinen tieto puuttuu"
              }
            }
          ]
        }
      ];
    }
    return checkboxCategory;
  }, oivaperustelut);

  return structure;
};
