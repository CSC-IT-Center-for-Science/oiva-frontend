import { __ } from "i18n-for-browser";
import { find, path, pathEq } from "ramda";

export async function getKokonaisopiskelijamaaralomake(
  isReadOnly,
  osionData = [],
  locale
) {
  return {
    anchor: "rajoitus",
    layout: { components: { justification: "start" } },
    components: [
      {
        anchor: "opiskelijamaara",
        name: "Input",
        styleClasses: ["mr-2", "w-1/5"],
        properties: {
          forChangeObject: {
            section: "opiskelijamaarat"
          },
          isReadOnly,
          placeholder: __("education.oppilastaOpiskelijaa"),
          type: "number",
          value: ""
        }
      }
    ]
  };
}

export async function getOpiskelijamaaranRajausvaihtoehdot(
  isReadOnly,
  osionData
) {
  // Opiskelijamääriä koskeva päälomakkeen valinta on huomioitava siten, että
  // valitusta radio button -vaihtoehdosta riippuen piilotetaan kohdevalikosta
  // joko osa tai kaikki opiskelijamääriä koskevat vaihtoehdot. Selvitetään
  // siis, mikä päälomakkeen kohdista on valittuna.

  // const valittuOpiskelijamaarastrategia = path(
  //   ["properties", "forChangeObject", "strategia"],
  //   find(pathEq(["properties", "isChecked"], true), osionData) || {}
  // );

  const valittuOpiskelijamaarastrategia = "kokonaismaara";

  console.info(osionData, valittuOpiskelijamaarastrategia);
  return [
    {
      anchor: "opiskelijamaarastrategia",
      components: [
        {
          anchor: "opiskelijamaaratyyppi",
          styleClasses: ["mb-0", "mr-2", "w-2/3"],
          name: "Autocomplete",
          properties: {
            forChangeObject: {
              section: "opiskelijamaarat"
            },
            isMulti: false,
            isReadOnly,
            options: [
              {
                label: __("opiskelijamaara.kokonaisopiskelijamaara"),
                value: "1"
              },
              {
                label: __("opiskelijamaara.vainKohdennetutRajoitukset"),
                value: "2"
              }
            ],
            selectedOption: "2"
          }
        }
      ]
    }
  ];
}

export default async function getOpiskelijaMaarat(
  isReadOnly,
  osionData = [],
  locale
) {
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
          isReadOnly,
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
