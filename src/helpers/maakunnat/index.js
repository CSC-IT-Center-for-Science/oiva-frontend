import { mapObjIndexed, map, head, groupBy, prop, omit } from "ramda";
import localforage from "localforage";

export function initializeMaakunta(maakuntadata) {
  return omit(["kunta", "koodiArvo"], {
    ...maakuntadata,
    koodiarvo: maakuntadata.koodiArvo,
    kunnat: map(kunta => {
      return kunta.tila === "HYVAKSYTTY"
        ? omit(["koodiArvo"], {
            ...kunta,
            koodiarvo: kunta.koodiArvo,
            metadata: mapObjIndexed(
              head,
              groupBy(prop("kieli"), kunta.metadata)
            )
          })
        : null;
    }, maakuntadata.kunta).filter(Boolean)
  });
}

export async function getMaakunnat() {
  return await localforage.getItem("maakunnat");
}
