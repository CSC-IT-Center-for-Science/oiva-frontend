import {
  mapObjIndexed,
  groupBy,
  prop,
  dissoc,
  head,
  map,
  find,
  propEq,
  path,
  startsWith,
  filter,
  compose
} from "ramda";
import localforage from "localforage";

export const initializeMaarays = (tutkinto, maarays) => {
  return { ...tutkinto, maarays: head(dissoc("aliMaaraykset", maarays)) };
};

export const initializeOpetuskieli = ({
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

export const initializeOpetuskielet = (opetuskieletData, maaraykset = []) => {
  const maarayksetByOpetuskieli = groupBy(prop("koodiarvo"), maaraykset);
  return opetuskieletData
    ? map(opetuskielidata => {
        // Luodaan opetuskieli
        let opetuskieli = initializeOpetuskieli(opetuskielidata);

        // Asetetaan opetuskielelle määräys
        opetuskieli = initializeMaarays(
          opetuskieli,
          maarayksetByOpetuskieli[opetuskieli.koodiarvo]
        );

        return opetuskieli;
      }, opetuskieletData)
    : [];
};

export const defineBackendChangeObjects = async (changeObjects = [], maaraystyypit, locale, kohteet) => {
  const opetuskielet = await getkieletOPHFromStorage();
  const changeObjs = filter(compose(startsWith("opetuskielet.opetuskieli"), prop("anchor")), changeObjects);

  return map(opetuskieli => {
    const changeObj = find(cObj => find(kieli => kieli.value === opetuskieli.koodiarvo, cObj.properties.value), changeObjs);

    return changeObj ? {
      generatedId: `opetuskielet-${Math.random()}`,
      kohde: find(propEq("tunniste", "opetusjatutkintokieli"), kohteet),
      koodiarvo: opetuskieli.koodiarvo,
      koodisto: opetuskieli.koodisto.koodistoUri,
      kuvaus: path(["metadata", locale, "kuvaus"], changeObj),
      maaraystyyppi: find(propEq("tunniste", "OIKEUS"), maaraystyypit),
      meta: {
        changeObjects: [changeObj]
      },
      tila: "LISAYS"
    } : null
  }, opetuskielet).filter(Boolean)
}

export function getkieletOPHFromStorage() {
  return localforage.getItem("kieletOPH");
}
