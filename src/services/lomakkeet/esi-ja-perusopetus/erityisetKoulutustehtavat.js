import { isAdded, isRemoved } from "css/label";
import { flatten, map, toUpper } from "ramda";

export function erityisetKoulutustehtavat(data, isReadOnly, locale) {
  const localeUpper = toUpper(locale);
  return flatten([
    map(erityinenKoulutustehtava => {
      return {
        anchor: erityinenKoulutustehtava.koodiarvo,
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
            anchor: erityinenKoulutustehtava.koodiarvo,
            name: "CheckboxWithLabel",
            properties: {
              isChecked: false, // TODO: Aseta arvo sen mukaan, mitä määräyksiä luvasta löytyy
              isIndeterminate: false,
              labelStyles: {
                addition: isAdded,
                removal: isRemoved
              },
              title: erityinenKoulutustehtava.metadata[localeUpper].nimi
            }
          }
        ]
      };
    }, data.poErityisetKoulutustehtavat),
    {
      anchor: "erityiset-koulutustehtavat",
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
      anchor: "erityiset-koulutustehtavat",
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
