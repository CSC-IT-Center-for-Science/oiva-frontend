import { isAdded, isRemoved } from "css/label";
import { getChangeObjByAnchor } from "okm-frontend-components/dist/components/02-organisms/CategorizedListRoot/utils";
import { endsWith, filter, flatten, map, path, startsWith, toUpper } from "ramda";
import {__} from "i18n-for-browser";
import { getAnchorPart } from "../../../utils/common";

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
            map(changeObj => {
                return {
                  anchor: getAnchorPart(changeObj.anchor, 2),
                  components: [
                    {
                      anchor: "nimi",
                      name: "TextBox",
                      properties: {
                        placeholder: __("common.nimi"),
                        title: "Nimi",
                        isRemovable: true,
                        value: changeObj.properties.value
                      }
                    }
                  ]
                }
              }, filter(changeObj =>
              startsWith(`erityisetKoulutustehtavat.${erityinenKoulutustehtava.koodiarvo}`, changeObj.anchor) &&
              endsWith('.nimi', changeObj.anchor) &&
              !startsWith(`erityisetKoulutustehtavat.${erityinenKoulutustehtava.koodiarvo}.0`, changeObj.anchor),
              changeObjects)
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
                    text: __("common.lisaaUusiNimi"),
                    icon: "FaPlus",
                    iconFontSize: 10,
                    variant: "text"
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
              __("common.lisatiedotInfo")
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
            placeholder: __("common.lisatiedot")
          }
        }
      ]
    }
  ]);
}
