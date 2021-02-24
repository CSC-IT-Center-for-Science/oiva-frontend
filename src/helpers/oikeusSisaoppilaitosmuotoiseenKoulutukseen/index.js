import { groupBy, head, map, mapObjIndexed, omit, prop, sort } from "ramda";
import localforage from "localforage";

export const initializeOikeus = oikeus => {
  return omit(["koodiArvo"], {
    ...oikeus,
    koodiarvo: oikeus.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), oikeus.metadata))
  });
};

export const initializeOikeudet = oikeudet => {
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
    map(oikeus => {
      return initializeOikeus(oikeus);
    }, oikeudet)
  );
};

export function getOikeusSisaoppilaitosmuotoiseenKoulutukseenFromStorage() {
  return localforage.getItem("oikeusSisaoppilaitosmuotoiseenKoulutukseen");
}
