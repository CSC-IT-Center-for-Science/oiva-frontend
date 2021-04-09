import { isAdded, isRemoved } from "css/label";
import { find, flatten, map, path, pathEq, propEq, concat } from "ramda";
import { __ } from "i18n-for-browser";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { getAnchorPart } from "utils/common";

export async function getValtakunnallinenKehittamistehtavalomake(
  { maaraykset, checkboxStatesSection4 },
  { isPreviewModeOn, isReadOnly }
) {
  const _isReadOnly = isPreviewModeOn || isReadOnly;
  const lisatiedot = await getLisatiedotFromStorage();
  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  const lisatietomaarays = find(propEq("koodisto", "lisatietoja"), maaraykset);
  let kehittamistehtavatStructure = [
    {
      anchor: "info",
      components: [
        {
          anchor: "valinta",
          layout: { margins: { top: "large" } },
          name: "StatusTextRow",
          styleClasses: ["font-medium", "pb-2"],
          properties: {
            title: __("education.valtakunnallinenKehittamistehtavaInfo")
          }
        }
      ]
    }
  ];
  if (checkboxStatesSection4.length > 0) {
    kehittamistehtavatStructure = flatten(
      concat(kehittamistehtavatStructure, [
        map(checkboxObjSection4 => {
          const anchor = `${getAnchorPart(
            checkboxObjSection4.anchor,
            1
          )}.${getAnchorPart(checkboxObjSection4.anchor, 2)}`;
          return {
            anchor,
            components: [
              {
                anchor: "valintaelementti",
                name: "CheckboxWithLabel",
                properties: {
                  isChecked: path(
                    ["properties", "metadata", "isChecked"],
                    checkboxObjSection4
                  ),
                  isIndeterminate: false,
                  isPreviewModeOn,
                  isReadOnly: _isReadOnly,
                  labelStyles: {
                    addition: isAdded,
                    removal: isRemoved
                  },
                  title: path(["properties", "value"], checkboxObjSection4)
                }
              }
            ]
          };
        }, checkboxStatesSection4)
      ])
    );
  } else {
    kehittamistehtavatStructure = flatten(
      concat(kehittamistehtavatStructure, [
        {
          anchor: "info",
          components: [
            {
              anchor: "valinta",
              name: "StatusTextRow",
              properties: {
                title: __("education.valtakunnallinenKehittamistehtavaInfo2")
              }
            }
          ]
        }
      ])
    );
  }
  let lisatiedotStructure = flatten([
    {
      anchor: "valtakunnalliset-kehittamistehtavat",
      components: [
        {
          anchor: "lisatiedot-info",
          name: "StatusTextRow",
          properties: {
            title: __("common.lisatiedotInfo")
          }
        }
      ],
      layout: { margins: { top: "large" } },
      styleClasses: ["mt-10", "pt-10", "border-t"]
    },
    lisatiedotObj
      ? {
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
                isPreviewModeOn,
                isReadOnly: _isReadOnly,
                title: __("common.lisatiedot"),
                value: lisatietomaarays ? lisatietomaarays.meta.arvo : ""
              }
            }
          ]
        }
      : null
  ]);

  return flatten([kehittamistehtavatStructure, lisatiedotStructure]).filter(
    Boolean
  );
}
