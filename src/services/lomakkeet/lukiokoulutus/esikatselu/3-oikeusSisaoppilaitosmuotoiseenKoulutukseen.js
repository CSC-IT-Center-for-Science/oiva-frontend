import { append, endsWith, find, path, pathEq, propEq } from "ramda";
import { replaceAnchorPartWith } from "utils/common";
import Lisatiedot from "../../lisatiedot";
import { createEsikatseluHTML } from "../../../../helpers/esikatselu";

export const previewOfOikeusSisaoppilaitosmuotoiseenKoulutukseen = (
  { lomakedata, rajoitteet, maaraykset },
  booleans,
  locale
) => {
  let structure = [];
  const checkedNode = find(
    pathEq(["properties", "isChecked"], true),
    lomakedata
  );

  if (checkedNode) {
    const kuvausNode = find(
      propEq(
        "anchor",
        `${replaceAnchorPartWith(checkedNode.anchor, 2, "kuvaus")}.A`
      ),
      lomakedata
    );

    if (kuvausNode) {
      const koodiarvo = path(
        ["properties", "forChangeObject", "koodiarvo"],
        kuvausNode
      );

      const maarays = find(
        maarays =>
          maarays.koodiarvo === koodiarvo &&
          maarays.koodisto ===
            "lukiooikeussisaooppilaitosmuotoiseenkoulutukseen",
        maaraykset
      );

      const html = createEsikatseluHTML(
        maarays,
        koodiarvo,
        rajoitteet,
        locale,
        "nimi",
        kuvausNode.properties.value
      );

      structure = append(
        {
          anchor: "valittu",
          components: [
            {
              anchor: "A",
              name: "List",
              properties: {
                items: [
                  {
                    anchor: "muoto",
                    components: [
                      {
                        anchor: "kuvaus",
                        name: "HtmlContent",
                        properties: { content: html }
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        structure
      );
    }
  }

  const lisatiedotNode = find(
    node => endsWith(".lisatiedot.1", node.anchor),
    lomakedata
  );

  if (lisatiedotNode && lisatiedotNode.properties.value) {
    structure = append(Lisatiedot(lisatiedotNode.properties.value), structure);
  }

  return structure;
};
