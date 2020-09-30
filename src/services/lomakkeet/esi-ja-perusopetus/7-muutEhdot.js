import { isAdded, isInLupa, isRemoved } from "css/label";
import { getChangeObjByAnchor } from "okm-frontend-components/dist/components/02-organisms/CategorizedListRoot/utils";
import { addIndex, flatten, map, path, toUpper } from "ramda";

export function muutEhdot(data, isReadOnly, locale, changeObjects) {
  const localeUpper = toUpper(locale);
  /**
   * Selvitetään, montako valinnaista tekstikenttää lomakkeelle on luotava.
   */
  const changeObjOfOptionalFields = getChangeObjByAnchor(
    `muutEhdot.muuehto.lisaaPainike`,
    changeObjects
  );

  const amountOfOptionalTextBoxes = !!changeObjOfOptionalFields
    ? changeObjOfOptionalFields.properties.amountOfClicks
    : 0;

  const changeObj = getChangeObjByAnchor(
    `muutEhdot.muuehto.valintaelementti`,
    changeObjects
  );

  const isCheckedByChange = !!path(["properties", "isChecked"], changeObj);

  return flatten([
    map(ehto => {
      return {
        anchor: ehto.koodiarvo,
        components: [
          {
            anchor: "valintaelementti",
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
      anchor: "muuehto",
      categories: flatten([
        [
          {
            anchor: "0",
            components: [
              {
                anchor: "nimi",
                name: "TextBox",
                properties: {
                  placeholder: "Kirjoita tähän ehto vapaamuotoisesti",
                  title: "Muu ehto"
                }
              }
            ]
          },
          /**
           * Luodaan dynaamiset tekstikentät, joita käyttäjä voi luoda lisää
           * erillisen painikkeen avulla.
           */
          addIndex(map)(
            (item, index) => ({
              anchor: String(index + 1),
              components: [
                {
                  anchor: "nimi",
                  name: "TextBox",
                  properties: {
                    placeholder: "Kirjoita tähän ehto vapaamuotoisesti",
                    title: "Nimi"
                  }
                }
              ]
            }),
            new Array(amountOfOptionalTextBoxes)
          ),
          /**
           * Luodaan painike, jolla käyttäjä voi luoda lisää tekstikenttiä.
           */
          {
            anchor: "lisaaPainike",
            components: [
              {
                anchor: "A",
                name: "SimpleButton",
                onClick: data.onAddButtonClick,
                properties: {
                  isVisible: isCheckedByChange,
                  text: "Lisää uusi nimi"
                }
              }
            ]
          }
        ]
      ]),
      components: [
        {
          anchor: "valintaelementti",
          name: "CheckboxWithLabel",
          properties: {
            title: "Muu ehto",
            labelStyles: {
              addition: isAdded,
              removal: isRemoved
            },
            isChecked: false,
            isIndeterminate: false
          }
        }
      ]
    },
    {
      anchor: "lisatiedot",
      layout: { margins: { top: "large" } },
      components: [
        {
          anchor: "infoteksti",
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
      anchor: "lisatiedot",
      components: [
        {
          anchor: "tekstikentta",
          name: "TextBox",
          properties: {
            placeholder: "Lisätiedot"
          }
        }
      ]
    }
  ]);
}
