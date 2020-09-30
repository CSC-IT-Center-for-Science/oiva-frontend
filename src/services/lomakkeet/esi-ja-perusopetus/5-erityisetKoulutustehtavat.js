import { isAdded, isRemoved } from "css/label";
import { getChangeObjByAnchor } from "okm-frontend-components/dist/components/02-organisms/CategorizedListRoot/utils";
import { addIndex, flatten, map, path, toUpper } from "ramda";

export function erityisetKoulutustehtavat(
  data,
  isReadOnly,
  locale,
  changeObjects
) {
  const localeUpper = toUpper(locale);

  return flatten([
    map(erityinenKoulutustehtava => {
      /**
       * Selvitetään, montako valinnaista tekstikenttää lomakkeelle on luotava.
       */
      const changeObjOfOptionalFields = getChangeObjByAnchor(
        `erityisetKoulutustehtavat.${erityinenKoulutustehtava.koodiarvo}.lisaaPainike`,
        changeObjects
      );

      const amountOfOptionalTextBoxes = !!changeObjOfOptionalFields
        ? changeObjOfOptionalFields.properties.amountOfClicks
        : 0;

      const changeObj = getChangeObjByAnchor(
        `erityisetKoulutustehtavat.${erityinenKoulutustehtava.koodiarvo}.valintaelementti`,
        changeObjects
      );

      const isCheckedByChange = !!path(["properties", "isChecked"], changeObj);

      return {
        anchor: erityinenKoulutustehtava.koodiarvo,
        categories: flatten([
          [
            /**
             * Jokaisen valinnan alla tulee olla ainakin yksi tekstikenttä,
             * joten varmistetaan se luomalla se yksi tekstikenttä tässä.
             */
            {
              anchor: "0",
              components: [
                {
                  anchor: "A",
                  name: "TextBox",
                  properties: {
                    title: "Nimi"
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
                    anchor: "A",
                    name: "TextBox",
                    properties: {
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
