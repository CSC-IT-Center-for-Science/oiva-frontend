import { omit, prop, groupBy, head, mapObjIndexed } from "ramda";
import localforage from "localforage";

export const initializeMuu = muuData => {
  return omit(["koodiArvo"], {
    ...muuData,
    koodiarvo: muuData.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), muuData.metadata))
  });
};

export function getMuutFromStorage() {
  return localforage.getItem("muut");
}
