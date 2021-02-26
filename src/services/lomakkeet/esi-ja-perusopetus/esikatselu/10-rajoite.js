import {
  getKohdistuvatRajoitteet,
  getRajoiteListamuodossa
} from "utils/rajoitteetUtils";
import { nth, path, split } from "ramda";
import { getAnchorPart } from "../../../../utils/common";

export const previewOfRajoite = (data, booleans, locale) => {
  /** Opiskelijamäärien tapauksessa data.rajoitteet.changeObjectsissa on tavaraa.
   *  Opiskelijamäärät käsitellään getRajoiteListamuodossa -funktiolla...
   */

  const rajoiteListamuodossa = data.rajoitteet.changeObjects
    ? getRajoiteListamuodossa(
        data.rajoitteet.changeObjects,
        locale,
        nth(
          1,
          split(
            "_",
            getAnchorPart(
              path(["rajoitteet", "changeObjects", "0", "anchor"], data),
              0
            )
          )
        )
      )
    : getKohdistuvatRajoitteet(data.rajoitteet, locale);

  return [
    {
      anchor: data.rajoiteId,
      components: [
        {
          anchor: "sisalto",
          name: "HtmlContent",
          properties: {
            content: rajoiteListamuodossa
          }
        }
      ]
    }
  ];
};
