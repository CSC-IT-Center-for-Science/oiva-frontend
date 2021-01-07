import {
  mapObjIndexed,
  groupBy,
  prop,
  head,
  omit,
  map,
  sort,
  find,
  compose,
  includes,
  path,
  flatten,
  propEq,
  endsWith,
  filter,
  append,
  isNil,
  pathEq,
  reject,
  concat,
  take,
  values,
  drop
} from "ramda";
import localforage from "localforage";
import { getAnchorPart } from "../../utils/common";
import { createAlimaarayksetBEObjects } from "helpers/rajoitteetHelper";

export const initializePOErityinenKoulutustehtava = erityinenKoulutustehtava => {
  return omit(["koodiArvo"], {
    ...erityinenKoulutustehtava,
    koodiarvo: erityinenKoulutustehtava.koodiArvo,
    metadata: mapObjIndexed(
      head,
      groupBy(prop("kieli"), erityinenKoulutustehtava.metadata)
    )
  });
};

export const initializePOErityisetKoulutustehtavat = erityisetKoulutustehtavat => {
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
    map(erityinenKoulutustehtava => {
      return initializePOErityinenKoulutustehtava(erityinenKoulutustehtava);
    }, erityisetKoulutustehtavat)
  );
};

export const defineBackendChangeObjects = async (
  changeObjects = {},
  maaraystyypit,
  locale,
  kohteet
) => {
  const { rajoitteetByRajoiteId } = changeObjects;
  console.info(changeObjects);
  const kohde = find(propEq("tunniste", "erityinenkoulutustehtava"), kohteet);

  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);
  const erityisetKoulutustehtavat = await getPOErityisetKoulutustehtavatFromStorage();

  const muutokset = map(koulutustehtava => {
    const rajoitteetByRajoiteIdAndKoodiarvo = reject(
      isNil,
      mapObjIndexed(rajoite => {
        return pathEq(
          [1, "properties", "value", "value"],
          koulutustehtava.koodiarvo,
          rajoite
        )
          ? rajoite
          : null;
      }, rajoitteetByRajoiteId)
    );

    // Checkbox-kentän muutos
    const checkboxChangeObj = find(
      compose(
        endsWith(`${koulutustehtava.koodiarvo}.valintaelementti`),
        prop("anchor")
      ),
      changeObjects.erityisetKoulutustehtavat
    );

    const isChecked = // (!!maarays && !checkboxChangeObj) ||
      checkboxChangeObj && checkboxChangeObj.properties.isChecked === true;

    let checkboxBEchangeObject = null;
    let kuvausBEchangeObjects = null;
    let alimaaraykset = null;

    /**
     * Jos kuvauskenttiin liittyvä checkbox on ruksattu päälle,
     * lähetetään backendille kuvauskenttiin tehdyt muutokset.
     */
    if (isChecked) {
      // Ensimmäisen kuvauskentän muutos
      const firstNameChangeObject = find(
        cObj =>
          cObj.anchor ===
          `erityisetKoulutustehtavat.${koulutustehtava.koodiarvo}.0.A`,
        changeObjects.erityisetKoulutustehtavat
      );

      // Dynaamisten kuvauskenttien muutokset
      const kuvausChangeObjects = filter(changeObj => {
        return (
          koulutustehtava.koodiarvo === getAnchorPart(changeObj.anchor, 1) &&
          endsWith(".kuvaus", changeObj.anchor)
        );
      }, changeObjects.erityisetKoulutustehtavat);

      checkboxBEchangeObject = checkboxChangeObj
        ? {
            generatedId: `erityinenKoulutustehtava-${Math.random()}`,
            kohde,
            koodiarvo: koulutustehtava.koodiarvo,
            koodisto: koulutustehtava.koodisto.koodistoUri,
            kuvaus: koulutustehtava.metadata[locale].kuvaus,
            maaraystyyppi,
            meta: {
              changeObjects: concat(
                [checkboxChangeObj],
                take(2, values(rajoitteetByRajoiteIdAndKoodiarvo))
              )
            },
            tila: checkboxChangeObj.properties.isChecked ? "LISAYS" : "POISTO"
          }
        : null;

      // Muodostetaan tehdyistä rajoittuksista objektit backendiä varten.
      // Linkitetään ensimmäinen rajoitteen osa yllä luotuun muutokseen ja
      // loput toisiinsa "alenevassa polvessa".
      alimaaraykset = values(
        mapObjIndexed(asetukset => {
          return createAlimaarayksetBEObjects(
            kohteet,
            maaraystyypit,
            checkboxBEchangeObject,
            drop(2, asetukset)
          );
        }, rajoitteetByRajoiteIdAndKoodiarvo)
      );

      kuvausBEchangeObjects = map(changeObj => {
        return changeObj
          ? {
              generatedId: changeObj.anchor,
              kohde,
              koodiarvo: koulutustehtava.koodiarvo,
              koodisto: koulutustehtava.koodisto.koodistoUri,
              kuvaus: changeObj.properties.value,
              maaraystyyppi,
              meta: {
                ankkuri: path(["properties", "metadata", "ankkuri"], changeObj),
                kuvaus: changeObj.properties.value,
                changeObjects: [changeObj]
              },
              tila: "LISAYS"
            }
          : null;
      }, append(firstNameChangeObject, kuvausChangeObjects));
    }

    return [
      checkboxBEchangeObject,
      kuvausBEchangeObjects,
      alimaaraykset
    ].filter(Boolean);
  }, erityisetKoulutustehtavat);

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

export function getPOErityisetKoulutustehtavatFromStorage() {
  return localforage.getItem("poErityisetKoulutustehtavat");
}
