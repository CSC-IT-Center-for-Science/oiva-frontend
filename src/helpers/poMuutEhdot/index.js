import { mapObjIndexed, groupBy, prop, head, omit, map, sort } from "ramda";
import localforage from "localforage";

export const initializePOMuuEhto = ehto => {
  return omit(["koodiArvo"], {
    ...ehto,
    koodiarvo: ehto.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), ehto.metadata))
  });
};

export const initializePOMuutEhdot = ehdot => {
  return sort(
    (a, b) => {
      const aInt = parseInt(a.koodiarvo, 10);
      const bInt = parseInt(b.koodiarvo, 10);
      if (aInt < bInt) {
        return -1;
      } else if (aInt > bInt) {
        return 1;
      }
      return 0;
    },
    map(ehto => {
      return initializePOMuuEhto(ehto);
    }, ehdot)
  );
};

export function getPOMuutEhdotFromStorage() {
  return localforage.getItem("poMuutEhdot");
}
