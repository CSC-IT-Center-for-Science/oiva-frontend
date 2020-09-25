import { isAdded, isRemoved } from "css/label";
import { flatten, map, toUpper } from "ramda";

export function opetuksenJarjestamismuoto(data, isReadOnly, locale) {
  const localeUpper = toUpper(locale);
  return flatten([
    map(muoto => {
      return {
        anchor: "opetuksen-jarjestamismuodot",
        categories: [
          {
            anchor: "nimi",
            components: [
              {
                anchor: "A",
                name: "TextBox",
                properties: {
                  title: "Nimi"
                }
              }
            ]
          }
        ],
        components: [
          {
            anchor: muoto.koodiarvo,
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
      anchor: "opetuksen-jarjestamismuodot",
      components: [
        {
          anchor: "0",
          name: "RadioButtonWithLabel",
          properties: {
            isChecked: true,
            isIndeterminate: false,
            labelStyles: {
              addition: isAdded,
              removal: isRemoved
            },
            title:
              "Opetusta ei järjestetä sisäoppilaitosmuotoisesti, eikä kotikouluopetusmuotoisena"
          }
        }
      ]
    },
    {
      anchor: "opetuksen-jarjestamismuodot",
      layout: { margins: { top: "large" } },
      components: [
        {
          anchor: "lisatiedot-info",
          name: "StatusTextRow",
          styleClasses: ["pt-8 border-t"],
          properties: {
            title:
              "Voit kirjoittaa tähän osioon liittyviä lisätietoja alla olevaan kenttään. Lisätiedot näkyvät luvassa tämän osion valintojen yhteydessä."
          }
        }
      ]
    },
    {
      anchor: "opetuksen-jarjestamismuodot",
      components: [
        {
          anchor: "lisatiedot",
          name: "TextBox",
          properties: {
            placeholder: "Lisätiedot"
          }
        }
      ]
    }
  ]);
}
