import { getMuutostarveCheckboxes } from "./common";

export const getAdditionFormStructure = (
  checkboxItems,
  locale,
  isReadOnly = false
) => {
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
      title: "Muutospyynnön taustalla olevat syyt",
      categories: checkboxes
    },
    {
      anchor: "vapaa-tekstikentta",
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            isReadOnly,
            placeholder:
              "Perustele lyhyesti miksi tutkintoon johtavaa koulutusta halutaan järjestää"
          }
        }
      ]
    }
  ];
};

export const getRemovalFormStructure = () => {
  return [
    {
      anchor: "vapaa-tekstikentta",
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            placeholder:
              "Perustele lyhyesti miksi tutkintoon tähtäävää koulutusta ei haluta enää järjestää"
          }
        }
      ]
    }
  ];
};

export const getOsaamisalaFormStructure = () => {
  return [
    {
      anchor: "vapaa-tekstikentta",
      components: [
        {
          anchor: "A",
          name: "TextBox",
          properties: {
            placeholder:
              "Perustele lyhyesti miksi tälle muutokselle on tarvetta"
          }
        }
      ]
    }
  ];
};
