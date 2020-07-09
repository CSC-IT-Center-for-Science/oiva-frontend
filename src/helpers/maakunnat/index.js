import { mapObjIndexed, map, head, groupBy, prop, omit, filter } from "ramda";
import localforage from "localforage";

export function initializeMaakunta(maakuntadata) {
  const currentDate = new Date();
  if (
    currentDate >= new Date(maakuntadata.voimassaAlkuPvm) &&
    currentDate <= new Date(maakuntadata.voimassaLoppuPvm || currentDate)
  ) {
    // Filter out ulkomaat
    const kunnat = filter(
      kunta => kunta.koodiArvo !== "200",
      maakuntadata.kunta
    );
    return omit(["kunta", "koodiArvo"], {
      ...maakuntadata,
      koodiarvo: maakuntadata.koodiArvo,
      kunnat: map(
        kunta =>
          omit(["koodiArvo"], {
            ...kunta,
            koodiarvo: kunta.koodiArvo,
            metadata: mapObjIndexed(
              head,
              groupBy(prop("kieli"), kunta.metadata)
            )
          }),
        kunnat
      ),
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
