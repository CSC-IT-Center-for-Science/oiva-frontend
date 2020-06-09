/**
 * Tiedostossa sijaitsevien funktioiden tarkoitus on muodostaa tutkinto
 * backendiltä tulevan datan pohjalta, liittää sille määräys - jos
 * sellainen tutkinnolla on - ja lisätä tutkinnolle mm. tieto
 * sille asetetuista tutkintokielistä. Muodostettua objektia käytetään
 * apuna backendille lähetettävien muutosobjektien rakentamisessa.
 */

import {
  head,
  dissoc,
  flatten,
  map,
  mapObjIndexed,
  groupBy,
  prop,
  filter,
  find,
  propEq,
  path
} from "ramda";
import localforage from "localforage";
import { createBEOofTutkintakielet } from "./tallentaminen/tutkintokielet";
import { createBEOofTutkinnotJaOsaamisalat } from "./tallentaminen/tutkinnotJaOsaamisalat";

export function getTutkinnotFromStorage() {
  return localforage.getItem("tutkinnot");
}

export function getTutkintoByKoodiarvo(koodiarvo, tutkinnot = []) {
  return find(propEq("koodiarvo", koodiarvo), tutkinnot);
}

export async function getTutkinnotGroupedByKey(key) {
  const tutkinnot = await getTutkinnotFromStorage();
  return groupBy(prop(key), tutkinnot);
}

/**
 * Palauttaa kaikki tutkinnot, jotka ovat muutokset huomioiden aktiivisia.
 * @param {array} tutkinnot
 * @param {array} changeObjects
 */
export function isAnyOfTutkinnotActive(tutkinnot = [], changeObjects = []) {
  const activeOnes = filter(tutkinto => {
    const anchor = `tutkinnot_${tutkinto.koulutusalaKoodiarvo}.${tutkinto.koulutustyyppiKoodiarvo}.${tutkinto.koodiarvo}.tutkinto`;
    const changeObj = find(propEq("anchor", anchor), changeObjects);
    return (
      (!!tutkinto.maarays && !changeObj) ||
      (changeObj && changeObj.properties.isChecked)
    );
  }, tutkinnot);
  return activeOnes.length > 0;
}

export const initializeTutkinto = ({
  koodiArvo: koodiarvo,
  koodisto,
  metadata,
  versio,
  voimassaAlkuPvm,
  koulutustyyppiKoodiArvo: koulutustyyppiKoodiarvo,
  koulutusalaKoodiArvo: koulutusalaKoodiarvo
}) => {
  return {
    koodiarvo,
    koodisto,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), metadata)),
    versio,
    voimassaAlkuPvm,
    koulutustyyppiKoodiarvo,
    koulutusalaKoodiarvo
  };
};

export const initializeMaarays = (tutkinto, maarays) => {
  return { ...tutkinto, maarays: head(dissoc("aliMaaraykset", maarays)) };
};

export const initializeTutkintokielet = (tutkinto, maaraykset = []) => {
  const tutkintokielet = flatten(
    map(maarays => {
      return map(alimaarays => {
        if (alimaarays.koodisto === "kieli") {
          return {
            ...alimaarays,
            koodi: {
              ...alimaarays.koodi,
              metadata: mapObjIndexed(
                head,
                groupBy(prop("kieli"), alimaarays.koodi.metadata)
              )
            }
          };
        }
        return null;
      }, maarays.aliMaaraykset || []).filter(Boolean);
    }, maaraykset).filter(Boolean)
  );
  return { ...tutkinto, tutkintokielet };
};

/**
 * Liittää tutkintoon sen osaamisalat.
 * @param {object} tutkinto
 * @param {array} osaamisalat
 */
export const initializeOsaamisalat = (tutkinto, osaamisalat = []) => {
  const alimaaraykset = path(["maarays", "aliMaaraykset"], tutkinto) || [];
  return {
    ...dissoc("aliMaaraykset", tutkinto),
    osaamisalat: map(osaamisala => {
      return {
        ...dissoc("koodiArvo", osaamisala),
        maarays: find(propEq(osaamisala.koodiArvo), alimaaraykset),
        koodiarvo: osaamisala.koodiArvo,
        metadata: mapObjIndexed(
          head,
          groupBy(prop("kieli"), osaamisala.metadata)
        )
      };
    }, osaamisalat)
  };
};

/**
 * Muodostaa backendin tarvitsemat muutosobjektit tutkintojen, osaamisalojen ja
 * tutkintokielien osalta.
 * @param {array} changeObjects
 * @param {object} kohde
 * @param {array} maaraystyypit
 * @param {string} locale
 */
export const defineBackendChangeObjects = async (
  changeObjects = {},
  kohde,
  maaraystyypit,
  locale = "FI"
) => {
  if (!kohde) {
    console.warn("Kohde is missing!");
    return null;
  } else if (!maaraystyypit) {
    console.warn("Array of määräystyypit is missing!");
    return null;
  }

  /**
   * Haetaan ensin lokaalista säilöstä eli IndexedDB:stä, WebSQL:stä tai
   * localStorage:sta objekti, joka sisältää tiedot kaikista tutkinnoista.
   */
  const tutkinnot = await getTutkinnotFromStorage();

  /**
   * Käydään tutkinnot läpi ja etsitään niihin kohdistuneet muutokset.
   * Huomioitavia muutoksia ovat:
   *
   * 1. Muutos tutkintoon.
   * 2. Muutos yhteen tai useampaan tutkinnon osaamisalaan.
   * 3. Muutos tutkintokieliin.
   */
  const backendChangeObjects = map(tutkinto => {
    /**
     * TUTKINNOT JA OSAAMISALAT
     */
    const beoOfTutkinnotJaOsaamisalat = createBEOofTutkinnotJaOsaamisalat(
      tutkinto,
      changeObjects,
      kohde,
      maaraystyypit,
      locale
    );

    /**
     * TUTKINTOKIELET
     */
    const beoOfTutkintokielet = createBEOofTutkintakielet(
      tutkinto,
      changeObjects,
      kohde,
      maaraystyypit,
      beoOfTutkinnotJaOsaamisalat
    );

    /**
     * Palautettava arvo on yksiulotteinen taulukko, joka sisältää tutkintoa,
     * tutkinnon osaamisaloja ja tutkintoon liittyviä kielimuutosia koskevat
     * muutokset backendin haluamassa formaatissa.
     */
    return flatten([beoOfTutkinnotJaOsaamisalat, beoOfTutkintokielet]);
  }, tutkinnot);

  /**
   * Lopullinen palautettava arvo sisältää edellisessä kommentissa mainitut
   * muutokset jokaisen muuttuneen tutkinnon, osaamisalan ja tutkintokielen
   * osalta.
   */
  return flatten(backendChangeObjects).filter(Boolean);
};
