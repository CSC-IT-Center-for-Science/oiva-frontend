import { __ } from "i18n-for-browser";

export default async function getOpiskelijaMaarat(osionData = [], locale) {
  return {
    anchor: "rajoitus",
    layout: { components: { justification: "start" } },
    components: [
      {
        anchor: "opiskelijamaaratyyppi",
        styleClasses: ["mb-0", "mr-2", "w-1/5"],
        name: "Autocomplete",
        properties: {
          forChangeObject: {
            section: "opiskelijamaarat"
          },
          isMulti: false,
          options: [
            // 1 = koodiarvo 1, enintään, koodisto: kujalisamaareet
            { label: __("common.enintaan"), value: "1" },
            // 2 = koodiarvo 2, enintään, koodisto: kujalisamaareet
            { label: __("common.vahintaan"), value: "2" }
          ]
        }
      },
      {
        anchor: "opiskelijamaara",
        name: "Input",
        styleClasses: ["mr-2", "w-1/5"],
        properties: {
          forChangeObject: {
            section: "opiskelijamaarat"
          },
          placeholder: __("education.oppilastaOpiskelijaa"),
          type: "number",
          value: ""
        }
      }
    ]
  };
}
