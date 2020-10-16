import { mapObjIndexed, groupBy, prop, head, map } from "ramda";
import localforage from "localforage";

export const initializeLisatieto = ({
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

export const initializeLisatiedot = (lisatiedotData, maaraykset = []) => {
  return lisatiedotData
    ? map(lisatietodata => {
        let lisatieto = initializeLisatieto(lisatietodata);

        return lisatieto;
      }, lisatiedotData)
    : [];
};

export function getLisatiedotFromStorage() {
  return localforage.getItem("lisatiedot");
}
