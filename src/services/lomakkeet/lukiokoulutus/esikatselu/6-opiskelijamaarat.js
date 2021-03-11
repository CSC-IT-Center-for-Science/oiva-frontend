import { append, endsWith, find, keys, length, map, pipe } from "ramda";

export const previewOfOpiskelijamaarat = ({ lomakedata, rajoitteet }) => {
  let structure = [];

  const opiskelijaMaaraRajoitteet = pipe(
    keys,
    map(rajoiteId => {
      const rajoite = rajoitteet[rajoiteId];
      return {
        anchor: rajoiteId,
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
    })
  )(rajoitteet);

  if (length(opiskelijaMaaraRajoitteet)) {
    structure = append(
      {
        anchor: "opiskelijamaarat",
        components: [
          {
            anchor: "listaus",
            name: "List",
            properties: {
              isDense: true,
              items: opiskelijaMaaraRajoitteet
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
};
