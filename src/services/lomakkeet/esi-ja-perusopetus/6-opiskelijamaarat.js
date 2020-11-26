import { __ } from "i18n-for-browser";
import { find, flatten, pathEq } from "ramda";
import { getLisatiedotFromStorage } from "../../../helpers/lisatiedot";

export async function opiskelijamaarat(data, { isPreviewModeOn, isReadOnly }) {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
  const lisatiedot = await getLisatiedotFromStorage();
  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot
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
          styleClasses: ["mb-0", "mr-2", "w-1/5"],
          name: "Dropdown",
          properties: {
            isPreviewModeOn,
            isReadOnly: _isReadOnly,
            options: [
              // 1 = koodiarvo 1, enintään, koodisto: kujalisamaareet
              {
                label: __("common.enintaan"),
                value: "1"
              },
              // 2 = koodiarvo 2, enintään, koodisto: kujalisamaareet
              {
                label: __("common.vahintaan"),
                value: "2"
              }
            ]
          }
        },
        {
          anchor: "input",
          name: "Input",
          properties: {
            isPreviewModeOn,
            isReadOnly: _isReadOnly,
            placeholder: __("education.oppilastaOpiskelijaa"),
            type: "number",
            value: ""
          }
        }
      ]
    },
    !!lisatiedotObj
      ? [
          {
            anchor: "lisatiedotTitle",
            layout: { margins: { top: "large" } },
            components: [
              {
                anchor: lisatiedotObj.koodiarvo,
                name: "StatusTextRow",
                styleClasses: isPreviewModeOn ? [] : ["pt-8", "border-t"],
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
                  isPreviewModeOn,
                  isReadOnly: _isReadOnly,
                  placeholder: __("common.lisatiedot")
                }
              }
            ]
          }
        ]
      : null
  ]).filter(Boolean);
}
