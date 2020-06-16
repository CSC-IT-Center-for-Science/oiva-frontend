import {
  mapObjIndexed,
  groupBy,
  prop,
  head,
  find,
  propEq,
  sortBy
} from "ramda";
import localforage from "localforage";

export const initializeKoulutusala = ({
  koodiArvo: koodiarvo,
  koodisto,
  metadata,
  versio,
  voimassaAlkuPvm
}) => {
  return {
    koodiarvo,
    koodisto,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), metadata)),
    versio,
    voimassaAlkuPvm
  };
};

export function getKoulutusalatFromStorage() {
  return localforage.getItem("koulutusalat");
}

export async function getKoulutusalaByKoodiarvo(koodiarvo) {
  const koulutusalat = await getKoulutusalatFromStorage();
  return find(propEq("koodiarvo", koodiarvo), koulutusalat);
}

export async function getKoulutusalatSortedByKey(key) {
  return sortBy(prop(key), await getKoulutusalatFromStorage());
}
