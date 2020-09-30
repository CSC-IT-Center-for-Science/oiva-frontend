import { mapObjIndexed, groupBy, prop, head, omit, map, sort } from "ramda";
import localforage from "localforage";

export const initializeOpetuksenJarjestamismuoto = muoto => {
  return omit(["koodiArvo"], {
    ...muoto,
    koodiarvo: muoto.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), muoto.metadata))
  });
};

export const initializeOpetuksenJarjestamismuodot = muodot => {
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
    map(muoto => {
      return initializeOpetuksenJarjestamismuoto(muoto);
    }, muodot)
  );
};

export function getOpetuksenJarjestamismuodotFromStorage() {
  return localforage.getItem("opetuksenJarjestamismuodot");
}
