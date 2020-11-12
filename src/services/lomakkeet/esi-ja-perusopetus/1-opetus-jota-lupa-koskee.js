import {isAdded, isInLupa, isRemoved} from "css/label";
import {flatten, map, toUpper} from "ramda";
import {__} from "i18n-for-browser";
import { getOpetustehtavatFromStorage } from "../../../helpers/opetustehtavat";

export async function opetusJotaLupaKoskee(data, isReadOnly, locale) {
  const localeUpper = toUpper(locale);
  const opetustehtavat = await getOpetustehtavatFromStorage();

  return flatten(
    [
      map(opetustehtava => {
        return {
          anchor: "opetustehtava",
          components: [
            {
              anchor: opetustehtava.koodiarvo,
              name: "CheckboxWithLabel",
              properties: {
                title: opetustehtava.metadata[localeUpper].nimi,
                labelStyles: {
                  addition: isAdded,
                  removal: isRemoved,
                  custom: Object.assign({}, !!opetustehtava.maarays ? isInLupa : {})
                },
                isChecked: !!opetustehtava.maarays,
                isIndeterminate: false
              }
            }
          ]
        };
      }, opetustehtavat),
      {
        anchor: "opetus",
        layout: {margins: {top: "large"}},
        components: [
          {
            anchor: "lisatiedot-info",
            name: "StatusTextRow",
            styleClasses: ["pt-8 border-t"],
            properties: {
              title:
                __("common.lisatiedotInfo")
            }
          }
        ]
      },
      {
        anchor: "opetus",
        components: [
          {
            anchor: "lisatiedot",
            name: "TextBox",
            properties: {
              placeholder: __("common.lisatiedot")
            }
          }
        ]
      }
    ]
  );
}
