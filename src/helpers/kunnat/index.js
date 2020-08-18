import { mapObjIndexed, head, groupBy, prop, omit } from "ramda";
import localforage from "localforage";

export function initializeKunta(kuntadata, localeUpper) {
  const currentDate = new Date();
  if (
    currentDate >= new Date(kuntadata.voimassaAlkuPvm) &&
    currentDate <= new Date(kuntadata.voimassaLoppuPvm || currentDate)
  ) {
    return omit(["kunta", "koodiArvo"], {
      ...kuntadata,
      koodiarvo: kuntadata.koodiArvo,
      metadata: mapObjIndexed(head, groupBy(prop("kieli"), kuntadata.metadata))
    });
  }
  return null;
}

export async function getKunnat() {
  return await localforage.getItem("kunnat");
}
