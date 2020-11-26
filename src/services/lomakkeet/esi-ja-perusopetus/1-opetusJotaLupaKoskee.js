import { isAdded, isInLupa, isRemoved } from "css/label";
import { find, flatten, map, pathEq, toUpper } from "ramda";
import { getOpetustehtavatFromStorage } from "../../../helpers/opetustehtavat";
import { getLisatiedotFromStorage } from "helpers/lisatiedot";
import { __ } from "i18n-for-browser";

export async function opetusJotaLupaKoskee(
  data,
  { isPreviewModeOn, isReadOnly },
  locale
) {
  const _isReadOnly = isReadOnly || isPreviewModeOn;
  const lisatiedot = await getLisatiedotFromStorage();
  const localeUpper = toUpper(locale);
  const opetustehtavat = await getOpetustehtavatFromStorage();

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  return flatten([
    map(opetustehtava => {
      return {
        anchor: "opetustehtava",
        components: [
          {
            anchor: opetustehtava.koodiarvo,
            name: "CheckboxWithLabel",
            styleClasses: isPreviewModeOn ? ["pl-4"] : [],
            properties: {
              title: opetustehtava.metadata[localeUpper].nimi,
              labelStyles: {
                addition: isAdded,
                removal: isRemoved,
                custom: Object.assign(
                  {},
                  !!opetustehtava.maarays ? isInLupa : {}
                )
              },
              isChecked: !!opetustehtava.maarays,
              isIndeterminate: false,
              isPreviewModeOn,
              isReadOnly: _isReadOnly
            }
          }
        ]
      };
    }, opetustehtavat),
    lisatiedotObj
      ? [
          {
            anchor: "opetus",
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
