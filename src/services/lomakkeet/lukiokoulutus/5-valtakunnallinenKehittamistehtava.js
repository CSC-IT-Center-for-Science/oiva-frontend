import { isAdded, isRemoved } from "css/label";
import { filter, find, flatten, map, path, pathEq, propEq } from "ramda";
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

  return flatten(
    [
      map(checkboxObjSection4 => {
        return {
          anchor: getAnchorPart(checkboxObjSection4.anchor, 1),
          components: [
            {
              anchor: "valintaelementti",
              name: "CheckboxWithLabel",
              properties: {
                // TODO: huomioidaan määräys asetettaessa oletusarvoa isChecked
                isChecked: false,
                isIndeterminate: false,
                isPreviewModeOn,
                isReadOnly: _isReadOnly,
                labelStyles: {
                  addition: isAdded,
                  removal: isRemoved
                },
                title: path(["properties", "title"], checkboxObjSection4)
              }
            }
          ]
        };
      }, checkboxStatesSection4),
      {
        anchor: "valtakunnalliset-kehittamistehtavat",
        layout: { margins: { top: "large" } },
        components: [
          {
            anchor: "lisatiedot-info",
            name: "StatusTextRow",
            styleClasses: ["pt-8", "border-t"],
            properties: {
              title: __("common.lisatiedotInfo")
            }
          }
        ]
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
    ].filter(Boolean)
  );
}
