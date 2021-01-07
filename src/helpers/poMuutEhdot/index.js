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
  filter,
  path,
  flatten,
  includes,
  reject,
  isNil,
  pathEq,
  drop,
  take,
  values,
  concat
} from "ramda";
import localforage from "localforage";
import { createAlimaarayksetBEObjects } from "helpers/rajoitteetHelper";

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
  const { rajoitteetByRajoiteId } = changeObjects;

  const kohde = find(
    propEq("tunniste", "muutkoulutuksenjarjestamiseenliittyvatehdot"),
    kohteet
  );
  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);
  const muutEhdot = await getPOMuutEhdotFromStorage();

  const muutokset = map(ehto => {
    const rajoitteetByRajoiteIdAndKoodiarvo = reject(
      isNil,
      mapObjIndexed(rajoite => {
        return pathEq(
          [1, "properties", "value", "value"],
          ehto.koodiarvo,
          rajoite
        )
          ? rajoite
          : null;
      }, rajoitteetByRajoiteId)
    );

    // Checkbox-kenttien muutokset
    const changeObj = find(
      compose(endsWith(`.${ehto.koodiarvo}.valintaelementti`), prop("anchor")),
      changeObjects.muutEhdot
    );

    // Kuvauskenttien muutokset kohdassa (muu ehto)
    const kuvausChangeObjects = filter(changeObj => {
      return (
        ehto.koodiarvo ===
          path(["metadata", "koodiarvo"], changeObj.properties) &&
        endsWith(".kuvaus", changeObj.anchor)
      );
    }, changeObjects.muutEhdot);

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

    const kuvausBEchangeObjects = map(changeObj => {
      const kuvausBEChangeObject = {
        generatedId: changeObj.anchor,
        kohde,
        koodiarvo: ehto.koodiarvo,
        koodisto: ehto.koodisto.koodistoUri,
        kuvaus: changeObj.properties.value,
        maaraystyyppi,
        meta: {
          ankkuri: path(["properties", "metadata", "ankkuri"], changeObj),
          kuvaus: changeObj.properties.value,
          changeObjects: concat(
            changeObj,
            take(2, values(rajoitteetByRajoiteIdAndKoodiarvo))
          )
        },
        tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
      };

      // Muodostetaan tehdyistä rajoittuksista objektit backendiä varten.
      // Linkitetään ensimmäinen rajoitteen osa yllä luotuun muutokseen ja
      // loput toisiinsa "alenevassa polvessa".
      const alimaaraykset = values(
        mapObjIndexed(asetukset => {
          return createAlimaarayksetBEObjects(
            kohteet,
            maaraystyypit,
            kuvausBEChangeObject,
            drop(2, asetukset)
          );
        }, rajoitteetByRajoiteIdAndKoodiarvo)
      );

      return [kuvausBEChangeObject, alimaaraykset];
    }, kuvausChangeObjects);

    return [checkboxBEchangeObjects, kuvausBEchangeObjects];
  }, muutEhdot);

  /**
   * Lisätiedot-kenttä tulee voida tallentaa ilman, että osioon on tehty muita
   * muutoksia. Siksi kentän tiedoista luodaan tässä kohtaa oma backend-
   * muotoinen muutosobjekti.
   */
  const lisatiedotChangeObj = find(
    compose(includes(".lisatiedot."), prop("anchor")),
    changeObjects
  );

  const lisatiedotBEchangeObject = lisatiedotChangeObj
    ? {
        kohde,
        koodiarvo: path(
          ["properties", "metadata", "koodiarvo"],
          lisatiedotChangeObj
        ),
        koodisto: path(
          ["properties", "metadata", "koodisto", "koodistoUri"],
          lisatiedotChangeObj
        ),
        maaraystyyppi,
        meta: {
          arvo: path(["properties", "value"], lisatiedotChangeObj),
          changeObjects: [lisatiedotChangeObj]
        },
        tila: "LISAYS"
      }
    : null;

  return flatten([muutokset, lisatiedotBEchangeObject]).filter(Boolean);
};
