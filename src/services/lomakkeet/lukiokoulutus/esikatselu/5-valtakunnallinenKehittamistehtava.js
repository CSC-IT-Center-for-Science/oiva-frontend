import { append, endsWith, find, map, pathEq } from "ramda";
import { getAnchorPart } from "utils/common";
import Lisatiedot from "../../lisatiedot";
import { createEsikatseluHTML } from "../../../../helpers/esikatselu";

export async function previewOfValtakunnallinenKehittamistehtava(
  { lomakedata, rajoitteet, maaraykset },
  booleans,
  locale
) {
  let structure = [];
  if (!lomakedata || !lomakedata.length) {
    return structure;
  }
  /**
   * Muodostetaan lista-alkiot hyödyntäen ListItem-komponenttiamme.
   * Huomioidaan vain opetustehtävät, jotka ovat aktivoituina lomakkeella
   * (!!isChecked = true).
   */
  const listItems = map(kehittamistehtava => {
    const koodiarvo = getAnchorPart(kehittamistehtava.anchor, 1);
    const kuvausnumero = getAnchorPart(kehittamistehtava.anchor, 2);

    const maarays = find(
      maarays =>
        maarays.koodiarvo === koodiarvo &&
        pathEq(["meta", "ankkuri"], kuvausnumero, maarays),
      maaraykset
    );

    const html = createEsikatseluHTML(
      maarays,
      `${koodiarvo}-${kuvausnumero}`,
      rajoitteet,
      locale,
      "nimi",
      kehittamistehtava.properties.title
    );
    if (kehittamistehtava.properties.isChecked) {
      return {
        anchor: koodiarvo,
        components: [
          {
            anchor: kuvausnumero,
            name: "HtmlContent",
            properties: { content: html }
          }
        ]
      };
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
    structure = append(Lisatiedot(lisatiedotNode.properties.value), structure);
  }

  return structure;
}
