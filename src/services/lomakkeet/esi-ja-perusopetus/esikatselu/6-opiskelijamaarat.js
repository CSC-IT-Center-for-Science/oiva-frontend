import { append, endsWith, find, propEq } from "ramda";

export const previewOfOpiskelijamaarat = ({ lomakedata }) => {
  let structure = [];

  const dropdownNode = find(
    node => endsWith(".kentat.dropdown", node.anchor),
    lomakedata
  );

  const inputNode = find(
    node => endsWith(".kentat.input", node.anchor),
    lomakedata
  );

  if (dropdownNode && inputNode) {
    const option = find(
      propEq("value", dropdownNode.properties.selectedOption),
      dropdownNode.properties.options
    );
    if (option) {
      structure = append(
        {
          anchor: "vahenint", // vähintään tai enintään
          components: [
            {
              anchor: "A",
              name: "StatusTextRow",
              properties: {
                title: `${option.label} ${inputNode.properties.value}`
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
};
