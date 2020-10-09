import { isAdded, isRemoved } from "css/label";
import { flatten, map, toUpper } from "ramda";
import {__} from "i18n-for-browser";

export function opetuksenJarjestamismuoto(data, isReadOnly, locale) {
  const localeUpper = toUpper(locale);
  return flatten([
    map(muoto => {
      return {
        anchor: muoto.koodiarvo,
        categories: [
          {
            anchor: "nimi",
            components: [
              {
                anchor: "A",
                name: "TextBox",
                properties: {
                  title: __("common.nimi")
                }
              }
            ]
          }
        ],
        components: [
          {
            anchor: "A",
            name: "RadioButtonWithLabel",
            properties: {
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
    }, data.opetuksenJarjestamismuodot),
    {
      anchor: "0",
      components: [
        {
          anchor: "ei-jarjesteta",
          name: "RadioButtonWithLabel",
          properties: {
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved
            },
            title:
              __("education.eiSisaOppilaitosTaiKotikoulumuotoinen")
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
            placeholder: __("common.lisatiedot")
          }
        }
      ]
    }
  ]);
}
