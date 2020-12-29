import {
  compose,
  flatten,
  groupBy,
  mapObjIndexed,
  nth,
  prop,
  split
} from "ramda";

export function rajoitteet(
  data,
  isReadOnly,
  locale,
  changeObjects,
  { onAddRestriction, onModifyRestriction, onRemoveRestriction }
) {
  // data.restrictions = luvalta tulevat rajoitteet
  const changeObjectsByRajoiteId = groupBy(
    compose(nth(1), split("."), prop("anchor")),
    changeObjects
  );

  const rajoitteetGrouped = mapObjIndexed(changeObjects => {
    return {
      changeObjects,
      elements: groupBy(
        compose(nth(2), split("."), prop("anchor")),
        changeObjects
      )
    };
  }, changeObjectsByRajoiteId);

  console.info(rajoitteetGrouped);

  const lomake = flatten(
    [
      {
        anchor: "ohjeteksti",
        components: [
          {
            anchor: "rajoiteosio",
            name: "StatusTextRow",
            styleClasses: ["mb-6"],
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
      {
        anchor: "listaus",
        components: [
          {
            anchor: "A",
            name: "RajoitteetList",
            properties: {
              areTitlesVisible: true,
              isBorderVisible: true,
              onModifyRestriction,
              onRemoveRestriction,
              rajoitteet: rajoitteetGrouped
            }
          }
        ]
      }
    ].filter(Boolean)
  );

  return lomake;
}
