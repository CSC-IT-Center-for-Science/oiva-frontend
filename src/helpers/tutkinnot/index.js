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
  path,
  dissocPath
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

export async function getTutkinnotGroupedBy(key, tutkinnot) {
  return tutkinnot
    ? Promise.resolve(groupBy(prop(key), tutkinnot))
    : groupBy(prop(key), await getTutkinnotFromStorage());
}

/**
 * Palauttaa kaikki tutkinnot, jotka ovat muutokset huomioiden aktiivisia.
 * @param {array} tutkinnot
 * @param {array} changeObjects
 */
export function getActiveOnes(tutkinnot = [], changeObjects = []) {
  const activeOnes = filter(tutkinto => {
    const anchor = `tutkinnot_${tutkinto.koulutusalakoodiarvo}.${tutkinto.koulutustyyppikoodiarvo}.${tutkinto.koodiarvo}.tutkinto`;
    const changeObj = find(propEq("anchor", anchor), changeObjects);
    return (
      (tutkinto.maarays && !changeObj) ||
      (changeObj && changeObj.properties.isChecked)
    );
  }, tutkinnot);
  return activeOnes;
}

export const initializeTutkinto = ({
  koodiArvo: koodiarvo,
  koodisto,
  metadata,
  versio,
  voimassaAlkuPvm,
  koulutustyyppiKoodiArvo: koulutustyyppikoodiarvo,
  koulutusalaKoodiArvo: koulutusalakoodiarvo
}) => {
  return {
    koodiarvo,
    koodisto,
    metadata: mapObjIndexed(head, groupBy(prop("kieli"), metadata)),
    versio,
    voimassaAlkuPvm,
    koulutustyyppikoodiarvo,
    koulutusalakoodiarvo
  };
};

export const initializeMaarays = (tutkinto, maarays) => {
  return { ...tutkinto, maarays: head(dissoc("aliMaaraykset", maarays)) };
};

export const initializeTutkintokielet = (tutkinto, maaraykset = []) => {
  const tutkintokielet = flatten(
    map(maarays => {
      return map(_alimaarays => {
        let alimaarays = null;
        if (_alimaarays.koodisto === "kieli") {
          alimaarays = {
            ..._alimaarays,
            koodi: {
              ..._alimaarays.koodi,
              koodiarvo: _alimaarays.koodi.koodiArvo,
              metadata: mapObjIndexed(
                head,
                groupBy(prop("kieli"), _alimaarays.koodi.metadata)
              )
            }
          };
          alimaarays = dissocPath(["koodi", "koodiArvo"], alimaarays);
        }
        return alimaarays;
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
 * Käsittelee backendiltä saadut tutkinnot muodostaen objekteja, jotka
 * sisältävät tutkintoihin liittyvät osaamisalat, tutkintokielet ja
 * määräykset.
 * @param {object} tutkinnotData - Raw data from backend.
 */
export const initializeTutkinnot = (tutkinnotData, maaraykset = []) => {
  const maarayksetByTutkinto = groupBy(prop("koodiarvo"), maaraykset);

  return tutkinnotData
    ? map(tutkintodata => {
        // Luodaan tutkinto
        let tutkinto = initializeTutkinto(tutkintodata);

        // Asetetaan tutkinnolle määräys
        tutkinto = initializeMaarays(
          tutkinto,
          maarayksetByTutkinto[tutkinto.koodiarvo]
        );

        // Asetetaan tutkinnolle tutkintokieliä koskevat määräykset
        tutkinto = initializeTutkintokielet(
          tutkinto,
          maarayksetByTutkinto[tutkinto.koodiarvo]
        );

        // Asetetaan tutkinnon osaamisalat ja niiden määräykset
        tutkinto = initializeOsaamisalat(tutkinto, tutkintodata.osaamisalat);

        return tutkinto;
      }, tutkinnotData)
    : [];
};

/**
 * Muodostaa backendin tarvitsemat muutosobjektit tutkintojen, osaamisalojen ja
 * tutkintokielien osalta.
 * @param {array} changeObjects
 * @param {object} tutkinnotKohde
 * @param {object} kieletKohde
 * @param {array} maaraystyypit
 * @param {string} locale
 */
export const defineBackendChangeObjects = async (
  changeObjects = {},
  tutkinnotKohde,
  kieletKohde,
  maaraystyypit,
  locale = "FI"
) => {
  if (!tutkinnotKohde || !kieletKohde) {
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
      tutkinnotKohde,
      maaraystyypit,
      locale
    );

    /**
     * TUTKINTOKIELET
     */
    const beoOfTutkintokielet = createBEOofTutkintakielet(
      tutkinto,
      changeObjects,
      kieletKohde,
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
