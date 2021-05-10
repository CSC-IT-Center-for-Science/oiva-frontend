import {
  append,
  drop,
  mapObjIndexed,
  groupBy,
  prop,
  head,
  omit,
  map,
  sort,
  find,
  compose,
  endsWith,
  propEq,
  path,
  includes,
  flatten,
  values,
  reject,
  isNil,
  pathEq,
  take
} from "ramda";
import localforage from "localforage";
import { __ } from "i18n-for-browser";
import { createAlimaarayksetBEObjects } from "helpers/rajoitteetHelper";
import { createMaarayksiaVastenLuodutRajoitteetBEObjects } from "utils/rajoitteetUtils";
import { getMaarayksetByTunniste } from "helpers/lupa/index";

export const initializeOikeus = oikeus => {
  return omit(["koodiArvo"], {
    ...oikeus,
    koodiarvo: oikeus.koodiArvo,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), oikeus.metadata))
  });
};

export const initializeOikeudet = oikeudet => {
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
    map(oikeus => {
      return initializeOikeus(oikeus);
    }, oikeudet)
  );
};

export const defineBackendChangeObjects = async (
  changeObjects = {},
  maaraystyypit,
  kohteet,
  lupaMaaraykset
) => {
  const { rajoitteetByRajoiteId } = changeObjects;

  const oikeusSisaoppilaitosmuotoiseenKoulutukseen =
    await getOikeusSisaoppilaitosmuotoiseenKoulutukseenFromStorage();

  const kohde = find(
    propEq("tunniste", "sisaoppilaitosmuotoinenkoulutus"),
    kohteet
  );
  const maaraystyyppi = find(propEq("tunniste", "OIKEUS"), maaraystyypit);

  const maaraykset = await getMaarayksetByTunniste(
    kohde.tunniste,
    lupaMaaraykset
  );

  const oikeusSisaoppilaitosmuotoiseenKoulutukseenChangeObjs = map(
    oikeus => {
      const rajoitteetByRajoiteIdAndKoodiarvo = reject(
        isNil,
        mapObjIndexed(rajoite => {
          return pathEq(
            [1, "properties", "value", "value"],
            oikeus.koodiarvo,
            rajoite
          )
            ? rajoite
            : null;
        }, rajoitteetByRajoiteId)
      );
      const changeObj = find(
        compose(endsWith(`${oikeus.koodiarvo}.valinta`), prop("anchor")),
        changeObjects.oikeusSisaoppilaitosmuotoiseenKoulutukseen
      );
      const kuvausChangeObj = find(
        compose(endsWith(`${oikeus.koodiarvo}.kuvaus.A`), prop("anchor")),
        changeObjects.oikeusSisaoppilaitosmuotoiseenKoulutukseen
      );

      const muutosobjekti = changeObj
        ? {
            generatedId: `oikeus-${Math.random()}`,
            kohde,
            koodiarvo: oikeus.koodiarvo,
            koodisto: oikeus.koodisto.koodistoUri,
            kuvaus: changeObj.properties.value,
            maaraystyyppi,
            meta: {
              changeObjects: [
                changeObj,
                kuvausChangeObj,
                take(2, values(rajoitteetByRajoiteIdAndKoodiarvo))
              ].filter(Boolean),
              kuvaus: changeObj.properties.value
            },
            tila: changeObj.properties.isChecked ? "LISAYS" : "POISTO"
          }
        : null;

      // Muodostetaan tehdyistä rajoittuksista objektit backendiä varten.
      // Linkitetään ensimmäinen rajoitteen osa yllä luotuun muutokseen ja
      // loput toisiinsa "alenevassa polvessa".
      const alimaaraykset = muutosobjekti
        ? values(
            mapObjIndexed(asetukset => {
              return createAlimaarayksetBEObjects(
                kohteet,
                maaraystyypit,
                muutosobjekti,
                drop(2, asetukset)
              );
            }, rajoitteetByRajoiteIdAndKoodiarvo)
          )
        : null;

      return [muutosobjekti, alimaaraykset];
    },
    append(
      {
        koodiarvo: 0,
        koodisto: { koodistoUri: "sisaoppilaitosmuotoinenkoulutus" },
        kuvaus: __("education.eiSisaOppilaitosTaiKotikoulumuotoinen")
      },
      oikeusSisaoppilaitosmuotoiseenKoulutukseen
    )
  ).filter(Boolean);

  const maarayksiaVastenLuodutRajoitteet =
    createMaarayksiaVastenLuodutRajoitteetBEObjects(
      maaraykset,
      rajoitteetByRajoiteId,
      kohteet,
      maaraystyypit,
      kohde
    );

  /**
   * Lisätiedot-kenttä tulee voida tallentaa ilman, että osioon on tehty muita
   * muutoksia. Siksi kentän tiedoista luodaan tässä kohtaa oma backend-
   * muotoinen muutosobjekti.
   */
  const lisatiedotChangeObj = find(
    compose(includes(".lisatiedot."), prop("anchor")),
    changeObjects.oikeusSisaoppilaitosmuotoiseenKoulutukseen
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

  return flatten([
    lisatiedotBEchangeObject,
    maarayksiaVastenLuodutRajoitteet,
    oikeusSisaoppilaitosmuotoiseenKoulutukseenChangeObjs
  ]).filter(Boolean);
};

export function getOikeusSisaoppilaitosmuotoiseenKoulutukseenFromStorage() {
  return localforage.getItem("oikeusSisaoppilaitosmuotoiseenKoulutukseen");
}
