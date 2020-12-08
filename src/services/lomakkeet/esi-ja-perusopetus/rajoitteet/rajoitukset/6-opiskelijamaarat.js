import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { __ } from "i18n-for-browser";

export default async function opiskelijaMaarat(
    changeObjects,
    locale
) {
  const lisatiedot = await getLisatiedotFromStorage();
  const isReadOnly = false;

  return {
      anchor: "rajoitus",
      components: [
          {
              anchor: "opiskelijamaaratyyppi",
              styleClasses: "mb-0 mr-2 w-1/5",
              name: "Dropdown",
              properties: {
                  forChangeObject: {
                      section: "opiskelijamaarat",
                  },
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
              anchor: "opiskelijamaara",
              name: "Input",
              properties: {
                  forChangeObject: {
                      section: "opiskelijamaarat",
                  },
                  placeholder: __("education.oppilastaOpiskelijaa"),
                  type: "number",
                  value: "",
                  isReadOnly
              }
          }
      ]
  };
}
