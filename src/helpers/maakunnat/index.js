import { mapObjIndexed, map, head, groupBy, prop, omit } from "ramda";
import localforage from "localforage";

export function initializeMaakunta(maakuntadata) {
  const currentDate = new Date();
  if (
    currentDate >= new Date(maakuntadata.voimassaAlkuPvm) &&
    currentDate <= new Date(maakuntadata.voimassaLoppuPvm || currentDate)
  ) {
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
      }, maakuntadata.kunta).filter(Boolean),
      metadata: mapObjIndexed(
        head,
        groupBy(prop("kieli"), maakuntadata.metadata)
      )
    });
  }
  return null;
}

export async function getMaakuntakunnat() {
  return await localforage.getItem("maakuntakunnat");
}
