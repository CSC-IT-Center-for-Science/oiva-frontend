import { __ } from "i18n-for-browser";
import { find, flatten, pathEq, propEq } from "ramda";
import { getLisatiedotFromStorage } from "../../../helpers/lisatiedot";

export async function opiskelijamaarat(
  { maaraykset },
  { isPreviewModeOn, isReadOnly }
) {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
  const lisatiedot = await getLisatiedotFromStorage();
  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );
  const optionValueMaarays = find(
    propEq("koodisto", "kujalisamaareet"),
    maaraykset
  );
  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);

  const lomakerakenne = flatten([
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
            ],
            selectedOption: optionValueMaarays
              ? optionValueMaarays.koodiarvo
              : ""
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
            value: optionValueMaarays ? optionValueMaarays.arvo : ""
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
                  placeholder: __("common.lisatiedot"),
                  value: lisatietomaarays ? lisatietomaarays.meta.arvo : ""
                }
              }
            ]
          }
        ]
      : null
  ]).filter(Boolean);

  return lomakerakenne;
}
