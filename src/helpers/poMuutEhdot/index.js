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
  propEq,
  concat,
  filter,
  path,
  flatten
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
  const kohde = find(propEq("tunniste", "muut"), kohteet); // TODO: Onko oikea kohde?
  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);
  const muutEhdot = await getPOMuutEhdotFromStorage();
  const lisatiedotChangeObj = find(
    compose(endsWith(".lisatiedot.tekstikentta"), prop("anchor")),
    changeObjects
  );

  const muutokset = flatten(
    map(ehto => {
      // Checkbox-kenttien muutokset
      const changeObj = find(
        compose(endsWith(`${ehto.koodiarvo}.valintaelementti`), prop("anchor")),
        changeObjects
      );

      // Nimikenttien muutokset kohdassa (muu ehto)
      const nimiChangeObjects = filter(changeObj => {
        return (
          ehto.koodiarvo ===
            path(["metadata", "koodiarvo"], changeObj.properties) &&
          endsWith(".nimi", changeObj.anchor)
        );
      }, changeObjects);

      const checkboxBEchangeObjects = changeObj
        ? {
            generatedId: `muuEhto-${Math.random()}`,
            kohde,
            koodiarvo: ehto.koodiarvo,
            koodisto: ehto.koodisto.koodistoUri,
            kuvaus: ehto.metadata[locale].kuvaus,
            maaraystyyppi,
            meta: {
              changeObjects: [changeObj]
            },
            tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
          }
        : null;

      const nimiBEchangeObjects = map(changeObj => {
        return {
          generatedId: changeObj.anchor,
          kohde,
          koodiarvo: ehto.koodiarvo,
          koodisto: ehto.koodisto.koodistoUri,
          kuvaus: changeObj.properties.value,
          maaraystyyppi,
          meta: {
            changeObjects: [changeObj]
          },
          tila: "LISAYS"
        };
      }, nimiChangeObjects);

      const lisatiedotBEchangeObject = lisatiedotBEchangeObject
        ? {
            generatedId: `muuEhto-lisatiedot-${Math.random()}`,
            kohde,
            koodiarvo: ehto.koodiarvo,
            koodisto: ehto.koodisto.koodistoUri,
            kuvaus: changeObj.properties.value,
            maaraystyyppi,
            meta: {
              changeObjects: [changeObj]
            },
            tila: "LISAYS"
          }
        : null;

      return [
        checkboxBEchangeObjects,
        lisatiedotBEchangeObject,
        nimiBEchangeObjects
      ];
    }, muutEhdot)
  ).filter(Boolean);

  return muutokset;
};
