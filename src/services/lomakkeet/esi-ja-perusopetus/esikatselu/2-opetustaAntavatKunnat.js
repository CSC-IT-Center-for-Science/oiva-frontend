import {
  append,
  compose,
  endsWith,
  find,
  flatten,
  includes,
  map,
  mapObjIndexed,
  path,
  prop,
  sortBy,
  values,
  path,
  concat
} from "ramda";
import { getRajoite } from "utils/rajoitteetUtils";

/**
 * Funktio luo lomakerakenteen, jonka myötä käyttäjälle näytetään lista
 * lupalomakkeelle valituista kunnista. Maakuntien nimiä ei esikatselun
 * puolella tarvita, joten eri maakuntiin kuuluvien kuntien taulukot
 * yhdistetään ja kunnat näytetään samassa listassa. Käytössä on List-
 * komponentti, jota varten luodaan { content: kunnan_nimi } -muotoisia
 * lista-alkoita.
 * @param {*} param0
 */
export async function previewOfOpetustaAntavaKunnat({
  lomakedata,
  rajoitteet
}) {
  let structure = [];

  const changeObjectsByProvinceNode = find(
    compose(endsWith(".maakunnatjakunnat"), prop("anchor")),
    lomakedata
  );


  const ulkomaaCheckbox = find(
    compose(endsWith("ulkomaa.200"), prop("anchor")),
    lomakedata
  );

  const ulkomaaTextBox = find(
    compose(endsWith("ulkomaa.200.lisatiedot"), prop("anchor")),
    lomakedata
  );

  const ulkomaaTextBoxValue = path(["properties", "isChecked"], ulkomaaCheckbox) ?
    path(["properties", "value"], ulkomaaTextBox) : null

  if (changeObjectsByProvinceNode) {
    const kunnat =
      flatten(
        values(
          mapObjIndexed(arrayOfLocationNodes => {
            const kuntienNimet = map(node => {
              const koodiarvo = path(
                ["properties", "metadata", "koodiarvo"],
                node
              );
              const { rajoiteId, rajoite } = getRajoite(koodiarvo, rajoitteet);
              // Haluamme listata vain kunnat, emme maakuntia.
              return includes(".kunnat.", node.anchor)
                ? {
                    anchor: "kunta",
                    components: [
                      rajoite
                        ? {
                            anchor: "rajoite",
                            name: "Rajoite",
                            properties: {
                              areTitlesVisible: false,
                              isReadOnly: true,
                              rajoiteId,
                              rajoite
                            }
                          }
                        : {
                            anchor: path(
                              ["properties", "metadata", "koodiarvo"],
                              node
                            ),
                            name: "HtmlContent",
                            properties: {
                              content: node.properties.metadata.title
                            }
                          }
                    ]
                  }
                : null;
            }, arrayOfLocationNodes).filter(Boolean);
            return kuntienNimet;
          }, changeObjectsByProvinceNode.properties.changeObjectsByProvince)
        )
      );

    const kunnatUlkomaatAdded = ulkomaaTextBoxValue ?
      sortBy(prop("content"), concat([{content: ulkomaaTextBoxValue}], kunnat)) : kunnat;

    if (kunnatUlkomaatAdded.length) {
      structure = append(
        {
          anchor: "valitut",
          components: [
            {
              anchor: "listaus",
              name: "List",
              properties: {
                isDense: true,
                items: kunnatUlkomaatAdded
              }
            }
          ]
        },
        structure
      );
    }
  }

  const lisatiedotNode = find(
    // 1 = koodiston koodiarvo
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
