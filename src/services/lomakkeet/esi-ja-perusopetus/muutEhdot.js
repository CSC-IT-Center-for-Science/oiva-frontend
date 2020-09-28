import { isAdded, isInLupa, isRemoved } from "css/label";
import { flatten, map, toUpper } from "ramda";

export function muutEhdot(data, isReadOnly, locale) {
  const localeUpper = toUpper(locale);
  return flatten([
    map(ehto => {
      return {
        anchor: "muut-ehdot",
        components: [
          {
            anchor: ehto.koodiarvo,
            name: "CheckboxWithLabel",
            properties: {
              title: ehto.metadata[localeUpper].nimi,
              labelStyles: {
                addition: isAdded,
                removal: isRemoved,
                custom: Object.assign({}, !!ehto.maarays ? isInLupa : {})
              },
              isChecked: !!ehto.maarays,
              isIndeterminate: false
            }
          }
        ]
      };
    }, data.poMuutEhdot),
    {
      anchor: "muut-ehdot",
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
      anchor: "muut-ehdot",
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
