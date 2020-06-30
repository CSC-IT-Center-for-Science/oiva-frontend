import { mapObjIndexed, groupBy, prop, head } from "ramda";
import localforage from "localforage";

export const initializeKieli = ({
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

export function getKieletFromStorage() {
  return localforage.getItem("kielet");
}
