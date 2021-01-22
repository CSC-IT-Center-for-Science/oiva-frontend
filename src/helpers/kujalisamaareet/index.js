import { groupBy, head, mapObjIndexed, omit, prop } from "ramda";
import localforage from "localforage";

export function initializeLisamaare(lisamaaredata) {
  return omit(["koodiArvo"], {
    ...lisamaaredata,
    koodiarvo: lisamaaredata.koodiArvo,
    metadata: mapObjIndexed(
      head,
      groupBy(prop("kieli"), lisamaaredata.metadata)
    )
  });
}

export function getKujalisamaareetFromStorage(key) {
  return localforage.getItem(key || "kujalisamaareet");
}
