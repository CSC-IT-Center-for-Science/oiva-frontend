import { __ } from "i18n-for-browser";
import { find, flatten, pathEq } from "ramda";

export function opiskelijamaarat(data) {
  console.info(data.lisatiedot);
  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    data.lisatiedot || []
  );

  return flatten([
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
    lisatiedotObj
      ? [
          {
            anchor: "lisatiedotTitle",
            layout: { margins: { top: "large" } },
            components: [
              {
                anchor: lisatiedotObj.koodiarvo,
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
                anchor: lisatiedotObj.koodiarvo,
                name: "TextBox",
                properties: {
                  forChangeObject: {
                    koodiarvo: lisatiedotObj.koodiarvo,
                    koodisto: lisatiedotObj.koodisto,
                    versio: lisatiedotObj.versio,
                    voimassaAlkuPvm: lisatiedotObj.voimassaAlkuPvm
                  },
                  placeholder: __("common.lisatiedot")
                }
              }
            ]
          }
        ]
      : null
  ]).filter(Boolean);
}
