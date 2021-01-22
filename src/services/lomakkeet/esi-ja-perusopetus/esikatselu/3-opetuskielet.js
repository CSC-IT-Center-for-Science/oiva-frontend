import { __ } from "i18n-for-browser";
import {
  append,
  compose,
  concat,
  endsWith,
  find,
  map,
  path,
  prop,
  sortBy
} from "ramda";
import { getRajoite } from "utils/rajoitteetUtils";

export async function previewOfOpetuskielet({ lomakedata, rajoitteet }) {
  let structure = [];

  const ensisijaiset = find(
    compose(endsWith(".ensisijaiset"), prop("anchor")),
    lomakedata
  );

  const toissijaiset = find(
    compose(endsWith(".toissijaiset"), prop("anchor")),
    lomakedata
  );

  const ensisijaisetListItems = !!ensisijaiset
    ? sortBy(
        prop("content"),
        map(opetuskieli => {
          const { rajoiteId, rajoite } = getRajoite(
            opetuskieli.value,
            rajoitteet
          );
          if (rajoiteId) {
            return {
              anchor: opetuskieli.value,
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
          } else {
            console.info("Ei rajoitetta.", opetuskieli.label);
            return {
              anchor: "opetuskieli",
              components: [
                {
                  anchor: opetuskieli.value,
                  name: "HtmlContent",
                  properties: {
                    content: opetuskieli.label
                  }
                }
              ]
            };
          }
        }, path(["properties", "value"], ensisijaiset) || []).filter(Boolean)
      )
    : [];

  const toissijaisetListItems = !!toissijaiset
    ? sortBy(
        prop("content"),
        map(opetuskieli => {
          const { rajoiteId, rajoite } = getRajoite(
            opetuskieli.value,
            rajoitteet
          );
          if (rajoiteId) {
            return {
              anchor: opetuskieli.value,
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
          } else {
            return {
              anchor: "opetuskieli",
              components: [
                {
                  anchor: opetuskieli.value,
                  name: "HtmlContent",
                  properties: {
                    content: opetuskieli.label
                  }
                }
              ]
            };
          }
        }, path(["properties", "value"], toissijaiset) || []).filter(Boolean)
      )
    : [];

  if (ensisijaisetListItems.length) {
    structure = append(
      {
        anchor: "ensisijaiset",
        components: [
          {
            anchor: "listaus",
            name: "List",
            properties: {
              isDense: true,
              items: ensisijaisetListItems
            }
          }
        ]
      },
      structure
    );
  }

  if (toissijaisetListItems.length) {
    structure = concat(structure, [
      {
        anchor: "muilla-kielilla",
        components: [
          {
            anchor: "otsikko",
            name: "FormTitle",
            properties: {
              isPreviewModeOn: true,
              level: 4,
              title: __("education.voidaanAntaaMyosSeuraavillaKielilla")
            }
          }
        ]
      },
      {
        anchor: "toissijaiset",
        components: [
          {
            anchor: "listaus",
            name: "List",
            properties: {
              isDense: true,
              items: toissijaisetListItems
            }
          }
        ]
      }
    ]);
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
