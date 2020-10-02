import { mapObjIndexed, groupBy, prop, head, omit, map, sort } from "ramda";
import localforage from "localforage";

export const initializeOpetustehtava = opetustehtava => {
  return omit(["koodiArvo"], {
    ...opetustehtava,
    koodiarvo: opetustehtava.koodiArvo,
    metadata: mapObjIndexed(
      head,
      groupBy(prop("kieli"), opetustehtava.metadata)
    )
  });
};

export const initializeOpetustehtavat = opetustehtavat => {
  return sort(
    (a, b) => {
      const aInt = parseInt(a.metadata.FI.huomioitavaKoodi, 10);
      const bInt = parseInt(b.metadata.FI.huomioitavaKoodi, 10);
      if (aInt < bInt) {
        return -1;
      } else if (aInt > bInt) {
        return 1;
      }
      return 0;
    },
    map(opetustehtava => {
      return initializeOpetustehtava(opetustehtava);
    }, opetustehtavat)
  );
};

export function getOpetustehtavatFromStorage() {
  return localforage.getItem("opetustehtavat");
}
