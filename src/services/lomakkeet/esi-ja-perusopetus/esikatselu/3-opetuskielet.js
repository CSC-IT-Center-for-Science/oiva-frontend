import { __ } from "i18n-for-browser";
import {
  append,
  compose,
  concat,
  endsWith,
  find,
  map,
  prop,
  sortBy
} from "ramda";

export async function previewOfOpetuskielet({ lomakedata }) {
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
          return {
            content: opetuskieli.label
          };
        }, ensisijaiset.properties.value).filter(Boolean)
      )
    : [];

  const toissijaisetListItems = !!toissijaiset
    ? sortBy(
        prop("content"),
        map(opetuskieli => {
          return {
            content: opetuskieli.label
          };
        }, toissijaiset.properties.value).filter(Boolean)
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
              level: 3,
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

  if (lisatiedotNode) {
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
