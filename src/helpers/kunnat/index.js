import { mapObjIndexed, head, groupBy, prop, omit } from "ramda";
import localforage from "localforage";

export function initializeKunta(kuntadata) {
  const currentDate = new Date();
  if (
    currentDate >= new Date(kuntadata.voimassaAlkuPvm) &&
    currentDate <= new Date(kuntadata.voimassaLoppuPvm || currentDate)
  ) {
    return omit(["koodiArvo"], {
      ...kuntadata,
      koodiarvo: kuntadata.koodiArvo,
      metadata: mapObjIndexed(head, groupBy(prop("kieli"), kuntadata.metadata))
    });
  }
  return null;
}

export async function getKunnatFromStorage() {
  return await localforage.getItem("kunnat");
}
