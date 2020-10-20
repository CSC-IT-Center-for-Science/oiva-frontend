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
  append
} from "ramda";
import localforage from "localforage";
import { getAnchorPart } from "../../utils/common";

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
  changeObjects = [],
  maaraystyypit,
  locale,
  kohteet
) => {
  const kohde =
    find(propEq("tunniste", "erityinenkoulutustehtava"), kohteet) ||
    find(propEq("tunniste", "muut"), kohteet); // TODO: POISTA || JÄLKEINEN KOODI KUN KUJAN KOHTEET SAATU OIVAAN

  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);
  const erityisetKoulutustehtavat = await getPOErityisetKoulutustehtavatFromStorage();

  const muutokset = map(koulutustehtava => {
    // Checkbox-kentän muutos
    const changeObj = find(
      compose(
        endsWith(`${koulutustehtava.koodiarvo}.valintaelementti`),
        prop("anchor")
      ),
      changeObjects
    );

    // Ensimmäisen kuvauskentän muutos
    const firstNameChangeObject = find(
      cObj =>
        cObj.anchor ===
        `erityisetKoulutustehtavat.${koulutustehtava.koodiarvo}.0.A`,
      changeObjects
    );

    // Dynaamisten kuvauskenttien muutokset
    const kuvausChangeObjects = filter(changeObj => {
      return (
        koulutustehtava.koodiarvo === getAnchorPart(changeObj.anchor, 1) &&
        endsWith(".kuvaus", changeObj.anchor)
      );
    }, changeObjects);

    const checkboxBEchangeObjects = changeObj
      ? {
          generatedId: `erityinenKoulutustehtava-${Math.random()}`,
          kohde,
          koodiarvo: koulutustehtava.koodiarvo,
          koodisto: koulutustehtava.koodisto.koodistoUri,
          kuvaus: koulutustehtava.metadata[locale].kuvaus,
          maaraystyyppi,
          meta: {
            changeObjects: [changeObj]
          },
          tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
        }
      : null;

    const kuvausBEchangeObjects = map(changeObj => {
      return changeObj
        ? {
            generatedId: changeObj.anchor,
            kohde,
            koodiarvo: koulutustehtava.koodiarvo,
            koodisto: koulutustehtava.koodisto.koodistoUri,
            kuvaus: changeObj.properties.value,
            maaraystyyppi,
            meta: {
              kuvaus: changeObj.properties.value,
              changeObjects: [changeObj]
            },
            tila: "LISAYS"
          }
        : null;
    }, append(firstNameChangeObject, kuvausChangeObjects));

    return [checkboxBEchangeObjects, kuvausBEchangeObjects].filter(Boolean);
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
