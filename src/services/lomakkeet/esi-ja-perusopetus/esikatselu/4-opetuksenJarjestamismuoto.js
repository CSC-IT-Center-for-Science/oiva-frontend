import { append, endsWith, find, isEmpty, path, pathEq, propEq } from "ramda";
import { replaceAnchorPartWith } from "utils/common";
import { getRajoitteet } from "../../../../utils/rajoitteetUtils";
import Lisatiedot from "../../lisatiedot";

export const previewOfOpetuksenJarjestamismuoto = ({
  lomakedata,
  rajoitteet
}) => {
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
      const kohdistuvatRajoitteet = getRajoitteet(
        path(["properties", "forChangeObject", "koodiarvo"], kuvausNode),
        rajoitteet
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
                      !isEmpty(kohdistuvatRajoitteet)
                        ? {
                            anchor: "rajoite",
                            name: "Rajoite",
                            properties: {
                              areTitlesVisible: false,
                              isReadOnly: true,
                              rajoite: kohdistuvatRajoitteet
                            }
                          }
                        : {
                            anchor: "kuvaus",
                            name: "HtmlContent",
                            properties: { content: kuvausNode.properties.value }
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
    structure = append(
      Lisatiedot(lisatiedotNode.properties.value),
      structure
    );
  }

  return structure;
};
