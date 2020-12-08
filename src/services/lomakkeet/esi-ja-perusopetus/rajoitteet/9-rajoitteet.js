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
  values,
  tail,
  filter,
  find,
  pipe,
  startsWith,
  path, addIndex
} from "ramda";
import { getAnchorPart, removeAnchorPart, replaceAnchorPartWith } from "utils/common";

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
    addIndex(mapObjIndexed)((rajoite, rajoiteId, foo, ind) => {
      const changeObj = rajoite.elements.asetukset[0];
      const anchor = removeAnchorPart(replaceAnchorPartWith(changeObj.anchor, 3, "rajoitus"), 4);
      const tarkenninChangeObj = find(pipe(prop("anchor"), startsWith(anchor)), rajoite.elements.asetukset);
      const rajoiteValue = path(["properties", "value"], tarkenninChangeObj || {}) || [];
      const rajoitteenArvo = Array.isArray(rajoiteValue) ? join(", ", map(prop("label"), rajoiteValue)) : rajoiteValue;
      return {
        anchor: rajoiteId,
        components: [
          {
            anchor: "title",
            name: "StatusTextRow",
            styleClasses: ["font-bold", "text-lg"],
            properties: {
              title: `Rajoite ${ind + 1}`,
            }
          },
        ],
        categories: flatten([
          {
            anchor: "kohde",
            layout: {indentation: "none"},
            components: [
              {
                anchor: "A",
                name: "StatusTextRow",
                properties: {
                  statusText: `Rajoitteen kohde:`,
                  statusTextStyleClasses: ["font-bold", "pr-2"],
                  title: `${changeObj.properties.value.label}`,
                }
              },
            ]
          },
          {
            anchor: "kohteenTarkennin",
            layout: {margins: {top: "none"}, indentation: "none"},
            components: [
              {
                anchor: "label",
                name: "StatusTextRow",
                properties: {
                  title: `${rajoitteenArvo}`
                },
              }
            ]
          },
          map(changeObj => {
            console.log(changeObj);
            const anchor = removeAnchorPart(replaceAnchorPartWith(changeObj.anchor, 4, "rajoitus"), 5);
            const tarkenninChangeObj = find(pipe(prop("anchor"), startsWith(anchor)), rajoite.elements.asetukset);
            const rajoiteValue = path(["properties", "value"], tarkenninChangeObj || {}) || [];
            const rajoitteenArvo = Array.isArray(rajoiteValue) ? join(", ", map(prop("label"), rajoiteValue)) : rajoiteValue;
            return tarkenninChangeObj ?
              [
                {
                  anchor: "kriteerit",
                  layout: {margins: {top: "none"}, indentation: "none"},
                  components: [
                    {
                      anchor: getAnchorPart(changeObj.anchor, 3),
                      name: "StatusTextRow",
                      properties: {
                        statusText: `${changeObj.properties.value.label}`,
                        statusTextStyleClasses: ["font-bold", "pr-2"],
                        styleClasses: ["font-bold"],
                        title: rajoitteenArvo,
                      }
                    }
                  ],
                },
              ] : {}
          }, filter(changeObj => getAnchorPart(changeObj.anchor, 4) === "kohde", tail(rajoite.elements.asetukset))),
          {
            anchor: "toiminnot",
            components:
              [
                {
                  anchor: "muokkaa",
                  name: "SimpleButton",
                  onClick: data.onModifyRestriction,
                  properties: {
                    text: "Muokkaa rajoitetta",
                    variant: "text"
                  }
                },
                {
                  anchor: "poista",
                  name: "SimpleButton",
                  onClick: data.onRemoveRestriction,
                  properties: {
                    text: "Poista rajoite",
                    variant: "text"
                  }
                }
              ]
          }])
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
