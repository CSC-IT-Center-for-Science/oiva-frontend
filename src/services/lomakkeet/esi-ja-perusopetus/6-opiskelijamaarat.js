import { __ } from "i18n-for-browser";

export function opiskelijamaarat() {
  return [
    {
      anchor: "kenttaotsikko",
      components: [
        {
          anchor: "A",
          name: "StatusTextRow",
          properties: {
            title: __("education.oppilastaOpiskelijaaOtsikko")
          }
        }
      ]
    },
    {
      anchor: "kentat",
      layout: { components: { justification: "start" } },
      components: [
        {
          anchor: "dropdown",
          styleClasses: "mb-0 mr-2 w-1/5",
          name: "Dropdown",
          properties: {
            options: [
              { label: __("common.vahintaan"), value: "vahintaan" },
              { label: __("common.enintaan"), value: "enintaan" }
            ]
          }
        },
        {
          anchor: "input",
          name: "Input",
          properties: {
            placeholder: __("education.oppilastaOpiskelijaa"),
            type: "number",
            value: ""
          }
        }
      ]
    },
    {
      anchor: "ohjeteksti",
      layout: { margins: { top: "large" } },
      components: [
        {
          anchor: "lisatiedot",
          name: "StatusTextRow",
          styleClasses: ["pt-8 border-t"],
          properties: {
            title: __("common.lisatiedotInfo")
          }
        }
      ]
    },
    {
      anchor: "lisatiedot",
      components: [
        {
          anchor: "textarea",
          name: "TextBox",
          properties: {
            placeholder: __("common.lisatiedot")
          }
        }
      ]
    }
  ];
}
