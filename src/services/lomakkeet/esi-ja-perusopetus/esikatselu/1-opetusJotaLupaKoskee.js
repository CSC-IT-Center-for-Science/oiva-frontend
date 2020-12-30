import {
  append,
  endsWith,
  filter,
  find,
  groupBy,
  head,
  isNil,
  keys,
  map,
  mapObjIndexed,
  path,
  pathEq,
  reject,
  values
} from "ramda";
import { getAnchorPart } from "utils/common";

export const getRajoite = (koodiarvo, rajoitteet) => {
  const rajoiteId = head(
    filter(key => {
      return pathEq(
        ["elements", "asetukset", 1, "properties", "value", "value"],
        koodiarvo,
        rajoitteet[key]
      )
        ? rajoitteet[key]
        : null;
    }, keys(rajoitteet))
  );

  return { rajoiteId, rajoite: rajoitteet[rajoiteId] };
};

export async function previewOfOpetusJotaLupaKoskee({
  lomakedata,
  rajoitteet
}) {
  let structure = [];

  if (!lomakedata || !lomakedata.length) {
    return structure;
  }

  /**
   * Muodostetaan lista-alkiot hyödyntäen ListItem-komponenttiamme.
   * Huomioidaan vain opetustehtävät, jotka ovat aktivoituina lomakkeella
   * (!!isChecked = true).
   */
  const listItems = map(opetustehtava => {
    const koodiarvo = getAnchorPart(opetustehtava.anchor, 2);
    const { rajoiteId, rajoite } = getRajoite(koodiarvo, rajoitteet);

    // Listaus voi pitää sisällään joko rajoitteita tai päälomakkeelta
    // valittuja arvoja (ilman rajoittteita)
    if (opetustehtava.properties.isChecked) {
      if (rajoite) {
        const rajoitus = rajoite.elements.asetukset[1];
        const rajoitusPropValue = [rajoitus.properties.value];
        const kriteerit = filter(asetus => {
          const anchorPart = getAnchorPart(asetus.anchor, 3);
          return (
            !isNaN(parseInt(anchorPart, 10)) &&
            getAnchorPart(asetus.anchor, 4) === "kohde"
          );
        }, rajoite.elements.asetukset);

        return {
          anchor: koodiarvo,
          components: [
            {
              anchor: "rajoite",
              name: "Rajoite",
              properties: {
                areTitlesVisible: false,
                id: rajoiteId,
                isReadOnly: true,
                kriteerit,
                rajoite,
                rajoitusPropValue
              }
            }
          ]
        };
      } else {
        return {
          anchor: koodiarvo,
          components: [
            {
              anchor: "opetustehtava",
              name: "StatuxTextRow",
              properties: {
                title: opetustehtava.properties.title
              }
            }
          ]
        };
      }
    }
  }, lomakedata).filter(Boolean);

  if (listItems.length) {
    structure = append(
      {
        anchor: "valitut",
        components: [
          {
            anchor: "listaus",
            name: "List",
            properties: {
              isDense: true,
              items: listItems
            }
          }
        ]
      },
      structure
    );
  }

  const lisatiedotNode = find(
    node => endsWith(".lisatiedot.1", node.anchor),
    lomakedata
  );

  if (lisatiedotNode && lisatiedotNode.properties.value) {
    structure = append(
      {
        anchor: "lisatiedot",
        components: [
          {
            anchor: "A",
            name: "StatusTextRow",
            properties: {
              title: lisatiedotNode.properties.value
            }
          }
        ]
      },
      structure
    );
  }

  return structure;
}
