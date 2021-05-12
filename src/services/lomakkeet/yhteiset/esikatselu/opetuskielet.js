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
  sortBy,
  toLower
} from "ramda";
import Lisatiedot from "../../lisatiedot";
import { createEsikatseluHTML } from "../../../../helpers/esikatselu";

export async function previewOfOpetuskielet(
  { lomakedata, rajoitteet, maaraykset },
  booleans,
  locale
) {
  let structure = [];

  const ensisijaiset = find(
    compose(endsWith(".ensisijaiset"), prop("anchor")),
    lomakedata
  );

  const ensisijaisetListItems = getKieletPreview(
    ensisijaiset,
    rajoitteet,
    maaraykset,
    locale
  );

  const toissijaiset = find(
    compose(endsWith(".toissijaiset"), prop("anchor")),
    lomakedata
  );

  const toissijaisetListItems = getKieletPreview(
    toissijaiset,
    rajoitteet,
    maaraykset,
    locale
  );

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
    structure = append(Lisatiedot(lisatiedotNode.properties.value), structure);
  }

  return structure;
}

const getKieletPreview = (kielet, rajoitteet, maaraykset, locale) => {
  return kielet
    ? sortBy(
        prop("content"),
        map(opetuskieli => {
          const koodiarvo = opetuskieli.value;
          const maarays = find(
            maarays =>
              toLower(maarays.koodiarvo) === toLower(koodiarvo) &&
              maarays.koodisto === "kielikoodistoopetushallinto",
            maaraykset
          );

          const html = createEsikatseluHTML(
            maarays,
            koodiarvo,
            rajoitteet,
            locale,
            "nimi",
            opetuskieli.label
          );

          return {
            anchor: "opetuskieli",
            components: [
              {
                anchor: opetuskieli.value,
                name: "HtmlContent",
                properties: {
                  content: html
                }
              }
            ]
          };
        }, path(["properties", "value"], kielet).filter(Boolean) || []).filter(
          Boolean
        )
      )
    : [];
};
