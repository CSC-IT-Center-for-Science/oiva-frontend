import {
  append,
  endsWith,
  find,
  keys,
  map,
  pipe
} from "ramda";
import Lisatiedot from "../../lisatiedot";

export const previewOfOpiskelijamaarat = ({ lomakedata, rajoitteet }) => {
  let structure = [];

  const opiskelijaMaaraRajoitteet = pipe(keys,
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

  if (opiskelijaMaaraRajoitteet) {
    structure = append({
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
      }
      ,
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
      Lisatiedot(lisatiedotNode.properties.value),
      structure
    );
  }

  return structure;
};
