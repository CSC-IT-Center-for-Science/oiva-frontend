import { isAdded, isInLupa, isRemoved } from "css/label";
import { getChangeObjByAnchor } from "okm-frontend-components/dist/components/02-organisms/CategorizedListRoot/utils";
import {flatten, map, path, toUpper, filter, endsWith, startsWith} from "ramda";
import {getAnchorPart} from "../../../utils/common";

export function muutEhdot(data, isReadOnly, locale, changeObjects) {
  const localeUpper = toUpper(locale);

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
           * Dynaamiset tekstikentät, joita käyttäjä voi luoda lisää erillisen painikkeen avulla.
           */
          map(changeObj => {
           return {
             anchor: getAnchorPart(changeObj.anchor, 2),
             components: [
               {
                 anchor: "nimi",
                 name: "TextBox",
                 properties: {
                   placeholder: "Kirjoita tähän ehto vapaamuotoisesti",
                   title: "Nimi",
                   isRemovable: true,
                   value: changeObj.properties.value
                 }
               }
             ]
           }
          }, filter(changeObj =>
            endsWith('.nimi', changeObj.anchor) && !startsWith('muutEhdot.muuehto.0', changeObj.anchor),
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
