import {
  append,
  compose,
  concat,
  drop,
  endsWith,
  filter,
  find,
  flatten,
  groupBy,
  head,
  includes,
  isNil,
  map,
  mapObjIndexed,
  omit,
  path,
  prop,
  propEq,
  reject,
  sort,
  startsWith,
  take,
  values
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

    let kuvausBEchangeObjects = null;

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

      kuvausBEchangeObjects = map(changeObj => {
        if (changeObj) {
          const rajoitteetByRajoiteIdAndKoodiarvo = reject(
            isNil,
            mapObjIndexed(rajoite => {
              return startsWith(
                `${koulutustehtava.koodiarvo}-`,
                path([1, "properties", "value", "value"], rajoite)
              )
                ? rajoite
                : null;
            }, rajoitteetByRajoiteId)
          );

          const kuvausBEChangeObject = {
            generatedId: changeObj.anchor,
            kohde,
            koodiarvo: koulutustehtava.koodiarvo,
            koodisto: koulutustehtava.koodisto.koodistoUri,
            kuvaus: changeObj.properties.value,
            maaraystyyppi,
            meta: {
              ankkuri: path(["properties", "metadata", "ankkuri"], changeObj),
              kuvaus: changeObj.properties.value,
              changeObjects: concat(
                take(2, values(rajoitteetByRajoiteIdAndKoodiarvo)),
                [checkboxChangeObj, changeObj]
              ).filter(Boolean)
            },
            tila: checkboxChangeObj.properties.isChecked ? "LISAYS" : "POISTO"
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
        }
        return null;
      }, append(firstNameChangeObject, kuvausChangeObjects));
    }

    return [kuvausBEchangeObjects].filter(Boolean);
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
