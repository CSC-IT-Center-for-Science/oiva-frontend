import { __ } from "i18n-for-browser";
import {
  append,
  compose,
  concat,
  endsWith,
  find,
  isEmpty,
  map,
  path,
  prop,
  sortBy
} from "ramda";
import { getRajoitteet } from "utils/rajoitteetUtils";
import Lisatiedot from "../../lisatiedot";

export async function previewOfOpetuskielet({ lomakedata, rajoitteet }) {
  let structure = [];

  const ensisijaiset = find(
    compose(endsWith(".ensisijaiset"), prop("anchor")),
    lomakedata
  );

  const ensisijaisetListItems = getKieletPreview(ensisijaiset, rajoitteet);

  const toissijaiset = find(
    compose(endsWith(".toissijaiset"), prop("anchor")),
    lomakedata
  );

  const toissijaisetListItems = getKieletPreview(toissijaiset, rajoitteet);

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
      Lisatiedot(lisatiedotNode.properties.value),
      structure
    );
  }

  return structure;
}

const getKieletPreview = (kielet, rajoitteet) => {
  return !!kielet
    ? sortBy(
        prop("content"),
        map(opetuskieli => {
          const kohdistuvatRajoitteet = getRajoitteet(
            opetuskieli.value,
            rajoitteet
          );
          if (!isEmpty(kohdistuvatRajoitteet)) {
            return {
              anchor: opetuskieli.value,
              components: [
                {
                  anchor: "rajoite",
                  name: "Rajoite",
                  properties: {
                    areTitlesVisible: false,
                    isReadOnly: true,
                    rajoite: kohdistuvatRajoitteet
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
        }, path(["properties", "value"], kielet) || []).filter(Boolean)
      )
    : [];
};
