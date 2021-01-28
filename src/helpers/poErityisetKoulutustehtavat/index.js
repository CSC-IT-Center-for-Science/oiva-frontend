import {
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
  isEmpty,
  isNil,
  length,
  map,
  mapObjIndexed,
  nth,
  omit,
  path,
  prop,
  propEq,
  reject,
  sort,
  split,
  startsWith,
  take,
  values
} from "ramda";
import localforage from "localforage";
import { createAlimaarayksetBEObjects } from "helpers/rajoitteetHelper";
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
  changeObjects = {},
  maaraystyypit,
  locale,
  kohteet
) => {
  const { rajoitteetByRajoiteId } = changeObjects;

  const kohde = find(propEq("tunniste", "erityinenkoulutustehtava"), kohteet);

  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);
  const erityisetKoulutustehtavat = await getPOErityisetKoulutustehtavatFromStorage();

  const muutokset = map(koulutustehtava => {
    // Checkbox-kenttien muutokset
    const checkboxChangeObj = find(
      compose(
        endsWith(`.${koulutustehtava.koodiarvo}.valintaelementti`),
        prop("anchor")
      ),
      changeObjects.erityisetKoulutustehtavat
    );

    // Kuvauskenttien muutokset kohdassa (muu koulutustehtava)
    const kuvausChangeObjects = filter(changeObj => {
      return (
        koulutustehtava.koodiarvo ===
          path(["metadata", "koodiarvo"], changeObj.properties) &&
        endsWith(".kuvaus", changeObj.anchor)
      );
    }, changeObjects.erityisetKoulutustehtavat);

    let checkboxBEchangeObject = null;
    let kuvausBEchangeObjects = [];

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

    // console.info(
    //   "rajoitteetByRajoiteIdAndKoodiarvo",
    //   rajoitteetByRajoiteIdAndKoodiarvo,
    //   head(values(rajoitteetByRajoiteIdAndKoodiarvo)),
    //   koulutustehtava.koodiarvo,
    //   koulutustehtava
    // );

    if (length(kuvausChangeObjects)) {
      kuvausBEchangeObjects = map(changeObj => {
        const ankkuri = path(["properties", "metadata", "ankkuri"], changeObj);
        const kuvausBEChangeObject = {
          generatedId: changeObj.anchor,
          kohde,
          koodiarvo: koulutustehtava.koodiarvo,
          koodisto: koulutustehtava.koodisto.koodistoUri,
          kuvaus: changeObj.properties.value,
          maaraystyyppi,
          meta: {
            ankkuri,
            kuvaus: changeObj.properties.value,
            changeObjects: concat(
              take(2, values(rajoitteetByRajoiteIdAndKoodiarvo)),
              [checkboxChangeObj, changeObj]
            ).filter(Boolean)
          },
          tila: checkboxChangeObj.properties.isChecked ? "LISAYS" : "POISTO"
        };

        let alimaaraykset = [];
        const kuvausnro = getAnchorPart(changeObj.anchor, 2);
        const rajoitteetForKuvaus = filter(rajoiteCobjs => {
         return nth(1, split("-", path([1, "properties", "value", "value"], rajoiteCobjs) || "")) === kuvausnro },
          values(rajoitteetByRajoiteIdAndKoodiarvo));

        // TODO: Tässä pitäisi käydä kaikki rajoitteet läpi, jos halutaan useampia
        // TODO: rajoitteita samalle asialle. (nyt haetaan vain ensimmäisen rajoitteen arvo)
        const kohteenTarkentimenArvo = path([1, "properties", "value", "value"], head(rajoitteetForKuvaus));

        const rajoitevalinnanAnkkuriosa = kohteenTarkentimenArvo
          ? nth(1, split("-", kohteenTarkentimenArvo))
          : null;

        if (
          kohteenTarkentimenArvo &&
          (rajoitevalinnanAnkkuriosa === ankkuri || !rajoitevalinnanAnkkuriosa)
        ) {
          console.info(
            "ankkuri",
            ankkuri,
            kohteenTarkentimenArvo,
            koulutustehtava
          );

          // Muodostetaan tehdyistä rajoittuksista objektit backendiä varten.
          // Linkitetään ensimmäinen rajoitteen osa yllä luotuun muutokseen ja
          // loput toisiinsa "alenevassa polvessa".
          alimaaraykset = values(
            mapObjIndexed(asetukset => {
              console.info(asetukset);
              return createAlimaarayksetBEObjects(
                kohteet,
                maaraystyypit,
                kuvausBEChangeObject,
                drop(2, asetukset)
              );
            }, rajoitteetForKuvaus)
          );
        }

        return [kuvausBEChangeObject, alimaaraykset];
      }, kuvausChangeObjects);
    } else {
      // Jos muokattuja kuvauksia ei kyseiselle koodiarvolle löydy, tarkistetaan
      // löytyykö checkbox-muutos. Jos löytyy, niin luodaan sille backend-muotoinen
      // muutosobjekti.
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
                take(2, values(rajoitteetByRajoiteIdAndKoodiarvo)),
                [checkboxChangeObj]
              ).filter(Boolean)
            },
            tila: checkboxChangeObj.properties.isChecked ? "LISAYS" : "POISTO"
          }
        : null;

      // Muodostetaan tehdyistä rajoittuksista objektit backendiä varten.
      // Linkitetään ensimmäinen rajoitteen osa yllä luotuun muutokseen ja
      // loput toisiinsa "alenevassa polvessa".
      const alimaaraykset =
        checkboxBEchangeObject && !isEmpty(rajoitteetByRajoiteIdAndKoodiarvo)
          ? values(
              mapObjIndexed(asetukset => {
                console.info(asetukset);
                return createAlimaarayksetBEObjects(
                  kohteet,
                  maaraystyypit,
                  checkboxBEchangeObject,
                  drop(2, asetukset)
                );
              }, rajoitteetByRajoiteIdAndKoodiarvo)
            )
          : null;

      return [checkboxBEchangeObject, alimaaraykset];
    }

    return [checkboxBEchangeObject, kuvausBEchangeObjects];
  }, erityisetKoulutustehtavat);

  const lisatiedotChangeObj = find(
    compose(includes(".lisatiedot."), prop("anchor")),
    changeObjects.erityisetKoulutustehtavat
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
