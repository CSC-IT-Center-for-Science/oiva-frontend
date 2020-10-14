import {
  mapObjIndexed,
  groupBy,
  prop,
  head,
  omit,
  map,
  sort,
  endsWith,
  find,
  compose,
  propEq
} from "ramda";
import localforage from "localforage";

export const initializePOMuuEhto = ehto => {
  return omit(["koodiArvo"], {
    ...ehto,
    koodiarvo: ehto.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), ehto.metadata))
  });
};

export const initializePOMuutEhdot = ehdot => {
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
    map(ehto => {
      return initializePOMuuEhto(ehto);
    }, ehdot)
  );
};

export function getPOMuutEhdotFromStorage() {
  return localforage.getItem("poMuutEhdot");
}

export const defineBackendChangeObjects = async (
  changeObjects = [],
  maaraystyypit,
  locale,
  kohteet
) => {
  const muutEhdot = await getPOMuutEhdotFromStorage();
  const lisatiedotChangeObj = find(
    compose(endsWith(".lisatiedot.tekstikentta"), prop("anchor")),
    changeObjects
  );
  const muutokset = map(ehto => {
    const changeObj = find(
      compose(endsWith(`${ehto.koodiarvo}.valintaelementti`), prop("anchor")),
      changeObjects
    );

    return changeObj
      ? {
          generatedId: `muuEhto-${Math.random()}`,
          kohde: find(propEq("tunniste", "muut"), kohteet), // TODO: Onko oikea kohde?
          koodiarvo: ehto.koodiarvo,
          koodisto: ehto.koodisto.koodistoUri,
          kuvaus: ehto.metadata[locale].kuvaus,
          maaraystyyppi: find(propEq("tunniste", "OIKEUS"), maaraystyypit),
          meta: {
            changeObjects: [changeObj, lisatiedotChangeObj],
            lisatiedot: lisatiedotChangeObj
              ? lisatiedotChangeObj.properties.value
              : ""
          },
          tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
        }
      : null;
  }, muutEhdot).filter(Boolean);

  return muutokset;
};
