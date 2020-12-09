import {
  compose,
  flatten,
  groupBy,
  join,
  map,
  mapObjIndexed,
  nth,
  prop,
  split,
  values
} from "ramda";
import { getAnchorPart } from "utils/common";

const getKohteenTarkenninValue = changeObj => {
  const typeOfRajoite = getAnchorPart(changeObj.anchor, 3);
  if (typeOfRajoite === "autocomplete") {
    return join(", ", map(prop("label"), changeObj.properties.value));
  }
};

export function rajoitteet(
  data,
  isReadOnly,
  locale,
  changeObjects,
  { onAddRestriction }
) {
  // data.restrictions = luvalta tulevat rajoitteet
  const changeObjectsByRajoiteId = groupBy(
    compose(nth(1), split("."), prop("anchor")),
    changeObjects
  );

  const rajoitteetGrouped = mapObjIndexed((changeObjects, rajoiteId) => {
    return {
      changeObjects,
      elements: groupBy(
        compose(nth(2), split("."), prop("anchor")),
        changeObjects
      )
    };
  }, changeObjectsByRajoiteId);

  const rajoitteet = values(
    mapObjIndexed((rajoite, rajoiteId) => {
      const {
        label: kohdeLabel,
        value: kohdeValue
      } = rajoite.elements.kohteenValinta[0].properties.value;
      const kohteenTarkenninChangeObject = rajoite.elements[kohdeValue][0];
      const kohteenTarkenninValue = getKohteenTarkenninValue(
        kohteenTarkenninChangeObject
      );

      return {
        anchor: rajoiteId,
        components: [
          {
            anchor: "title",
            name: "StatusTextRow",
            properties: {
              title: `Rajoite ${rajoiteId}`
            }
          }
        ],
        categories: flatten([
          {
            anchor: "kohde",
            layout: { margins: { top: "none" } },
            components: [
              {
                anchor: "A",
                name: "StatusTextRow",
                properties: {
                  title: `Rajoitteen kohde: ${kohdeLabel}`
                }
              }
            ]
          },
          {
            anchor: "kohteenTarkennin",
            layout: { margins: { top: "none" } },
            components: [
              {
                anchor: "label",
                containerStyleClasses: "",
                name: "StatusTextRow",
                properties: {
                  title: "Testi vain:"
                },
                styleClasses: ["pr-2 font-bold"]
              },
              {
                anchor: "value",
                name: "StatusTextRow",
                properties: {
                  title: kohteenTarkenninValue
                }
              }
            ]
          },
          map(changeObj => {
            return {
              anchor: "kriteerit",
              layout: { margins: { top: "none" } },
              components: [
                {
                  anchor: getAnchorPart(changeObj.anchor, 3),
                  name: "StatusTextRow",
                  properties: {
                    title: `Rajoitteen kohde: `
                  }
                }
              ]
            };
          }, rajoite.elements.kriteerit)
        ])
      };
    }, rajoitteetGrouped)
  );

  const lomake = flatten(
    [
      {
        anchor: "ohjeteksti",
        components: [
          {
            anchor: "rajoiteosio",
            name: "StatusTextRow",
            properties: {
              title:
                "Lupaan kohdistuvia rajoitteita voit tehdä lomakkeella tekemiesi valintojen perusteella."
            }
          }
        ]
      },
      {
        anchor: "rajoitteenLisaaminen",
        components: [
          {
            anchor: "painike",
            name: "SimpleButton",
            onClick: onAddRestriction,
            properties: {
              text: "Lisää rajoite"
            }
          }
        ]
      },
      rajoitteet
    ].filter(Boolean)
  );

  return lomake;
}
