import { mapObjIndexed, groupBy, prop, head } from "ramda";
import localforage from "localforage";

export const initializeElykeskus = ({
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

export function getElykeskuksetFromStorage() {
  return localforage.getItem("elykeskukset");
}
