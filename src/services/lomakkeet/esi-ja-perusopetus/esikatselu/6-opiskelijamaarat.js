import {
  append,
  endsWith,
  find,
  keys,
  length,
  map,
  path,
  pipe,
  prepend
} from "ramda";
import Lisatiedot from "../../lisatiedot";
import { __ } from "i18n-for-browser";

export const previewOfOpiskelijamaarat = ({ lomakedata, rajoitteet }) => {
  let structure = [];

  let opiskelijaMaaraRajoitteet = pipe(
    keys,
    map(rajoiteId => {
      const rajoite = rajoitteet[rajoiteId];
      return {
        anchor: rajoiteId,
        components: [
          {
            anchor: "rajoite",
            name: "Rajoite",
            properties: {
              areTitlesVisible: false,
              isReadOnly: true,
              rajoiteId,
              rajoite
            }
          }
        ]
      };
    })
  )(rajoitteet);

  const hasKokonaisopiskelijamaararajoitus = !!find(rajoite => {
    const rajoiteCobjs = path(
      ["components", "0", "properties", "rajoite", "changeObjects"],
      rajoite
    );
    return find(
      rajoite =>
        path(["properties", "metadata", "section"], rajoite) ===
          "opiskelijamaarat" &&
        path(["properties", "value", "value"], rajoite) === "kokonaismaara",
      rajoiteCobjs
    );
  }, opiskelijaMaaraRajoitteet);

  if (length(opiskelijaMaaraRajoitteet) > 0) {
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
      opiskelijaMaaraRajoitteet = prepend(
        eiKokonaisoppilasmaararajoitustaContent,
        opiskelijaMaaraRajoitteet
      );
    }

    structure = append(
      {
        anchor: "opiskelijamaarat",
        components: [
          {
            anchor: "listaus",
            name: "List",
            properties: {
              isDense: true,
              items: opiskelijaMaaraRajoitteet
            }
          }
        ]
      },
      structure
    );
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
