import {
  addIndex,
  append,
  endsWith,
  filter,
  find,
  length,
  map,
  mapObjIndexed,
  nth,
  path,
  split,
  values
} from "ramda";
import Lisatiedot from "../../lisatiedot";
import { __ } from "i18n-for-browser";
import {
  getRajoiteListamuodossa,
  getRajoitteetFromMaarays
} from "../../../../utils/rajoitteetUtils";
import { getAnchorPart } from "../../../../utils/common";

export const previewOfOpiskelijamaarat = (
  { lomakedata, rajoitteet, maaraykset },
  booleans,
  locale
) => {
  let structure = [];

  const opiskelijamaararajoiteChangeObjsHtml = values(
    mapObjIndexed(rajoite => {
      return getRajoiteListamuodossa(
        rajoite.changeObjects,
        locale,
        nth(
          1,
          split(
            "_",
            getAnchorPart(
              path(["changeObjects", "0", "anchor"], rajoite || []),
              0
            )
          )
        )
      );
    }, rajoitteet || {})
  );

  /** Suodatetaan lisätietomääräys pois */
  const maarayksetFiltered = filter(
    maarays => maarays.koodisto === "kujalisamaareet",
    maaraykset
  );

  const opiskelijamaararajoiteMaarayksetHtml = map(
    maarays =>
      getRajoitteetFromMaarays(
        maarays.aliMaaraykset,
        locale,
        __("rajoitteet.ajalla"),
        "tyyppi",
        true,
        maarays
      ),
    maarayksetFiltered
  );

  const hasKokonaisopiskelijamaararajoitus =
    !!find(rajoite => {
      return find(
        rajoite =>
          path(["properties", "metadata", "section"], rajoite) ===
            "opiskelijamaarat" &&
          path(["properties", "value", "value"], rajoite) === "kokonaismaara",
        rajoite.changeObjects
      );
    }, values(rajoitteet)) ||
    !!find(
      maarays => path(["meta", "tyyppi"], maarays) === "kokonaismaara",
      maaraykset
    );

  if (length(values(rajoitteet)) > 0 || length(maaraykset) > 0) {
    if (!hasKokonaisopiskelijamaararajoitus) {
      const eiKokonaisoppilasmaararajoitustaContent = {
        components: [
          {
            name: "HtmlContent",
            properties: {
              content: __("opiskelijamaara.kokonaismaaraEiRajattu")
            }
          }
        ]
      };
      structure = append(eiKokonaisoppilasmaararajoitustaContent, structure);
    }

    /** Lisätään määräyksistä luotu html struktuuriin */
    addIndex(map)((html, index) => {
      structure = append(
        {
          anchor: index,
          components: [
            {
              anchor: "opiskelijamaara",
              name: "HtmlContent",
              properties: {
                content: html
              }
            }
          ]
        },
        structure
      );
    }, opiskelijamaararajoiteMaarayksetHtml);

    /** Lisätään muutos-objekteista luotu html struktuuriin */
    addIndex(map)((html, index) => {
      structure = append(
        {
          anchor: index,
          components: [
            {
              anchor: "opiskelijamaara",
              name: "HtmlContent",
              properties: {
                content: html
              }
            }
          ]
        },
        structure
      );
    }, opiskelijamaararajoiteChangeObjsHtml);
  }

  const lisatiedotNode = find(
    // 1 = koodiston koodiarvo
    node => endsWith(".lisatiedot.1", node.anchor),
    lomakedata
  );

  if (lisatiedotNode && lisatiedotNode.properties.value) {
    structure = append(Lisatiedot(lisatiedotNode.properties.value), structure);
  }

  return structure;
};
