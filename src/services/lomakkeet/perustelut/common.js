import * as R from "ramda";

export const getMuutostarveCheckboxes = (
  checkboxItems,
  locale,
  isReadOnly = false
) => {
  return R.addIndex(R.map)((checkboxItem, i) => {
    const metadata = R.find(R.propEq("kieli", locale))(checkboxItem.metadata);
    const checkboxCategory = {
      anchor: checkboxItem.koodiArvo,
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
            title: metadata.nimi,
            forChangeObject: {
              fieldName: metadata.nimi
            }
          }
        }
      ]
    };
    if (i === checkboxItems.length - 1) {
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
  }, checkboxItems);
};
