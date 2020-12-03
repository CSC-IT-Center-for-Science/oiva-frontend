import { mapObjIndexed, head, groupBy, prop, omit, find, propEq } from "ramda";
import localforage from "localforage";

export function initializeKunta(kuntadata, ahvenanmaanKunnat = []) {
  const currentDate = new Date();
  if (
    currentDate >= new Date(kuntadata.voimassaAlkuPvm) &&
    currentDate <= new Date(kuntadata.voimassaLoppuPvm || currentDate) &&
    // Ahvenanmaata kuntineen ei tarvita tässä sovelluksessa
    !find(propEq("koodiarvo", kuntadata.koodiArvo), ahvenanmaanKunnat)
  ) {
    const kunta = omit(["koodiArvo"], {
      ...kuntadata,
      koodiarvo: kuntadata.koodiArvo,
      metadata: mapObjIndexed(head, groupBy(prop("kieli"), kuntadata.metadata))
    });
    return kunta;
  }
  return null;
}

export async function getKunnatFromStorage() {
  return await localforage.getItem("kunnat");
}
