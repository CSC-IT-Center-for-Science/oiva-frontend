import { append, endsWith, find, map } from "ramda";

export async function previewOfOpetusJotaLupaKoskee({ lomakedata }) {
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
    return opetustehtava.properties.isChecked
      ? {
          content: opetustehtava.properties.title
        }
      : null;
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
