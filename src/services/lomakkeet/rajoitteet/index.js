import {
  compose,
  flatten,
  groupBy,
  last,
  mapObjIndexed,
  nth,
  prop,
  split
} from "ramda";
import { __ } from "i18n-for-browser";

export function rajoitteet(
  data,
  isReadOnly,
  locale,
  changeObjects,
  { onAddRestriction, onModifyRestriction, onRemoveRestriction }
) {
  // data.restrictions = luvalta tulevat rajoitteet
  const changeObjectsByRajoiteId = groupBy(
    compose(last, split("_"), nth(0), split("."), prop("anchor")),
    changeObjects
  );

  const rajoitteetGrouped = mapObjIndexed(changeObjects => {
    return {
      changeObjects
    };
  }, changeObjectsByRajoiteId);

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
        ],
        styleClasses: ["mb-6"]
      },
      {
        anchor: "rajoitteenLisaaminen",
        components: [
          {
            anchor: "painike",
            name: "SimpleButton",
            onClick: onAddRestriction,
            properties: {
              text: __("rajoitteet.lisaaRajoite"),
              color: "secondary",
              variant: "outlined"
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
              areTitlesVisible: false,
              isBorderVisible: false,
              locale,
              onModifyRestriction,
              onRemoveRestriction,
              rajoitteet: rajoitteetGrouped,
              rajoiteMaaraykset: data.restrictions
            }
          }
        ]
      }
    ].filter(Boolean)
  );

  return lomake;
}
