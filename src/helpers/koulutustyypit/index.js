import {
  mapObjIndexed,
  groupBy,
  prop,
  head,
  find,
  propEq,
  sortBy,
  map
} from "ramda";
import localforage from "localforage";

export const initializeKoulutustyyppi = ({
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

export function getKoulutustyypitFromStorage() {
  return localforage.getItem("koulutustyypit");
}

export async function getKoulutustyyppiByKoodiarvo(koodiarvo) {
  return find(
    propEq("koodiarvo", koodiarvo),
    await getKoulutustyypitFromStorage()
  );
}

export async function getKoulutustyypitGroupedBy(key) {
  return mapObjIndexed(
    head,
    groupBy(prop(key), await getKoulutustyypitFromStorage())
  );
}

export async function getKoulutustyypitSortedByKey(key) {
  return sortBy(prop(key), await getKoulutustyypitFromStorage());
}
