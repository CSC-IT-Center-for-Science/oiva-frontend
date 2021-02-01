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
  concat,
  filter,
  not,
  propEq,
  allPass
} from "ramda";
import { getRajoite } from "utils/rajoitteetUtils";
import { getMaakuntakunnat } from "../../../../helpers/maakunnat";
import { getLocalizedProperty } from "../../utils";

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
  let maakunnat = await getMaakuntakunnat();

  const changeObjectsByProvinceNode = find(
    compose(endsWith(".maakunnatjakunnat"), prop("anchor")),
    lomakedata
  );

  const locale = changeObjectsByProvinceNode.properties.locale;

  const ulkomaaCheckbox = find(
    compose(endsWith("ulkomaa.200"), prop("anchor")),
    lomakedata
  );

  const ulkomaaTextBox = find(
    compose(endsWith("ulkomaa.200.lisatiedot"), prop("anchor")),
    lomakedata
  );

  const getStructure = (kunta) => {
    const koodiarvo = kunta.koodiarvo || path(
      ["properties", "metadata", "koodiarvo"],
      kunta
    );
    const { rajoiteId, rajoite } = getRajoite(koodiarvo, rajoitteet || kunta.meta);
    return {
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
            anchor: koodiarvo,
            name: "HtmlContent",
            properties: {
              content: kunta.metadata && getLocalizedProperty(kunta.metadata, locale, "nimi") ||
                kunta.koodi && find(propEq("kieli", locale.toUpperCase()), kunta.koodi.metadata).nimi ||
                kunta.properties && kunta.properties.metadata.title
            }
          }
      ]
    };
  };

  const ulkomaaTextBoxValue = path(["properties", "isChecked"], ulkomaaCheckbox) ?
    path(["properties", "value"], ulkomaaTextBox) : null

  const currentMunicipalities = path(["properties", "currentMunicipalities"], changeObjectsByProvinceNode);

  if (changeObjectsByProvinceNode) {
    const kunnat =
      flatten(
        values(
          mapObjIndexed(arrayOfLocationNodes => {
            const kuntienNimet = map(node => {
              // Haluamme listata vain kunnat, emme maakuntia.
              return includes(".kunnat.", node.anchor) ?
                getStructure(node)
                : null;
            }, arrayOfLocationNodes).filter(Boolean);
            return kuntienNimet;
          }, changeObjectsByProvinceNode.properties.changeObjectsByProvince)
        )
      );

    const kunnatUlkomaatAdded = ulkomaaTextBoxValue ?
      sortBy(path(["components", "0", "properties", "content"]),
        concat([{components: [{name: "HtmlContent", properties: {content: ulkomaaTextBoxValue}}]}], kunnat)) : kunnat;
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

  if (currentMunicipalities) {
    const existingMunicipalities = filter(allPass([compose(not, propEq("koodiarvo", "200")), compose(not, propEq("koodiarvo", "1"))]), currentMunicipalities);
    const existingForeignMunicipalities = filter(propEq("koodiarvo", "200"), currentMunicipalities);

    const municipalities = sortBy(
      prop("content"),
      flatten(
        values(
          map(node => {
            if (node.koodisto !== "maakunta") {
              return getStructure(node);
            } else {
              const province = find(propEq("koodiarvo", node.koodiarvo), maakunnat);
              return map(node2 => {
                return getStructure(node2);
              }, province.kunnat);
            }
          }, existingMunicipalities.filter(Boolean))
        )
      )
    );

    const foreignMunicipalities = sortBy(
      prop("content"),
      flatten(
        values(
          map(municipality => {
            if (municipality.meta.arvo) {
              return {
                anchor: "kunta",
                components: [
                  {
                    anchor: municipality.koodiarvo,
                    name: "HtmlContent",
                    properties: {
                      content: municipality.meta.arvo
                    }
                  }
                ]
              };
            }
          }, existingForeignMunicipalities.filter(Boolean))
        )
      )
    );

    structure = append(
      {
        anchor: "valitut",
        components: [
          {
            anchor: "listaus",
            name: "List",
            properties: {
              isDense: true,
              items: concat(municipalities.filter(Boolean), foreignMunicipalities.filter(Boolean))
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
