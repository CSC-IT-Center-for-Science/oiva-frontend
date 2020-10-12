import { append, mapObjIndexed, groupBy, prop, head, omit, map, sort, find, compose, endsWith, propEq, path} from "ramda";
import localforage from "localforage";
import {__} from "i18n-for-browser";

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

export const defineBackendChangeObjects = async (changeObjects = [], maaraystyypit, locale, kohteet) => {
  const opetuksenJarjestamismuodot = await getOpetuksenJarjestamismuodotFromStorage();
  const lisatiedotChangeObj = find(compose(endsWith("lisatiedot.tekstikentta"), prop("anchor")), changeObjects);
  const opetuksenJarjestamismuotoChangeObjs = map(jarjestamismuoto => {
    const changeObj = find(compose(endsWith(`${jarjestamismuoto.koodiarvo}.valinta`), prop("anchor")), changeObjects);
    const nimiChangeObj = find(compose(endsWith(`${jarjestamismuoto.koodiarvo}.nimi.A`), prop("anchor")), changeObjects);
    return changeObj ? {
      generatedId: `opetuksenJarjestamismuoto-${Math.random()}`,
      kohde: find(propEq("tunniste", "tutkinnotjakoulutukset"), kohteet), // TODO: Onko oikea kohde?
      koodiarvo: jarjestamismuoto.koodiarvo,
      koodisto: jarjestamismuoto.koodisto.koodistoUri,
      kuvaus: path(["metadata", locale, "kuvaus"], jarjestamismuoto) || jarjestamismuoto.kuvaus,
      maaraystyyppi: find(propEq("tunniste", "OIKEUS"), maaraystyypit),
      meta: {
        changeObjects: [changeObj, nimiChangeObj, lisatiedotChangeObj].filter(Boolean)
      },
      tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
    } : null
  }, append({
    koodiarvo: 0,
    koodisto: { koodistoUri:"opetuksenjarjestamismuoto" },
    kuvaus: __("education.eiSisaOppilaitosTaiKotikoulumuotoinen")
  }, opetuksenJarjestamismuodot)).filter(Boolean);

  return opetuksenJarjestamismuotoChangeObjs;
}

export function getOpetuksenJarjestamismuodotFromStorage() {
  return localforage.getItem("opetuksenJarjestamismuodot");
}
