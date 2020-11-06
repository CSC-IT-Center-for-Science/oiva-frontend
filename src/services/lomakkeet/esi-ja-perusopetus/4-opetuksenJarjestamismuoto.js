import { isAdded, isRemoved } from "css/label";
import { find, flatten, map, pathEq, toUpper } from "ramda";
import { __ } from "i18n-for-browser";
import { getLisatiedotFromStorage } from "../../../helpers/lisatiedot";
import { getOpetuksenJarjestamismuodotFromStorage } from "../../../helpers/opetuksenJarjestamismuodot";

export async function opetuksenJarjestamismuoto(isReadOnly, locale) {
  const localeUpper = toUpper(locale);
  const lisatiedot = await getLisatiedotFromStorage();
  const opetuksenJarjestamismuodot = await getOpetuksenJarjestamismuodotFromStorage();

  const lisatiedotObj = find(
    pathEq(["koodisto", "koodistoUri"], "lisatietoja"),
    lisatiedot || []
  );

  return flatten([
    map(muoto => {
      return {
        anchor: muoto.koodiarvo,
        categories: [
          {
            anchor: "kuvaus",
            components: [
              {
                anchor: "A",
                name: "TextBox",
                properties: {
                  isReadOnly,
                  placeholder: __("common.kuvausPlaceholder"),
                  title: __("common.kuvaus"),
                  value: muoto.metadata[localeUpper].kuvaus
                }
              }
            ]
          }
        ],
        components: [
          {
            anchor: "valinta",
            name: "RadioButtonWithLabel",
            properties: {
              isReadOnly,
              isChecked: false, // TODO: Aseta arvo sen mukaan, mitä määräyksiä luvasta löytyy
              isIndeterminate: false,
              labelStyles: {
                addition: isAdded,
                removal: isRemoved
              },
              title: muoto.metadata[localeUpper].nimi
            }
          }
        ]
      };
    }, opetuksenJarjestamismuodot),
    {
      anchor: "0",
      components: [
        {
          anchor: "valinta",
          name: "RadioButtonWithLabel",
          properties: {
            isReadOnly,
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved
            },
            title: __("education.eiSisaOppilaitosTaiKotikoulumuotoinen")
          }
        }
      ]
    },
    {
      anchor: "lisatiedot",
      layout: { margins: { top: "large" } },
      components: [
        {
          anchor: "info",
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
          anchor: "tekstikentta",
          name: "TextBox",
          properties: {
            isReadOnly,
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
  ]);
}
