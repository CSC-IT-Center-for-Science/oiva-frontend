import {} from "ramda";
import { __ } from "i18n-for-browser";

export default async function opiskelijaMaarat(changeObjects) {
  const isReadOnly = false;

  return {
    anchor: "maaraaika",
    components: [
      {
        anchor: "dropdown",
        styleClasses: "mb-0 mr-2 w-1/5",
        name: "Dropdown",
        properties: {
          options: [
            // 1 = koodiarvo 1, enintään, koodisto: kujalisamaareet
            { label: __("common.enintaan"), value: "1" },
            // 2 = koodiarvo 2, enintään, koodisto: kujalisamaareet
            { label: __("common.vahintaan"), value: "2" }
          ],
          isReadOnly
        }
      },
      {
        anchor: "input",
        name: "Input",
        properties: {
          placeholder: __("education.oppilastaOpiskelijaa"),
          type: "number",
          value: "",
          isReadOnly
        }
      }
    ]
  };
}
