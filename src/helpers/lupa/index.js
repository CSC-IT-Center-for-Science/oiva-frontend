import localforage from "localforage";
import { filter, pathEq, prop, propEq } from "ramda";

export function getLupaFromStorage() {
  return localforage.getItem("lupa");
}

/**
 * Palauttaa määräykset kohteen tunnisteen perusteella. Tunniste voi olla
 * esimerkiksi "toimintaalue".
 * @param {string} tunniste
 */
export async function getMaarayksetByTunniste(tunniste, maaraykset) {
  return filter(
    pathEq(["kohde", "tunniste"], tunniste),
    maaraykset || prop("maaraykset", await getLupaFromStorage()) || []
  );
}

/**
 * Palauttaa määräykset koodiston perusteella. Tunniste voi olla
 * esimerkiksi "oivamuutoikeudetvelvollisuudetehdotjatehtavat".
 * @param {string} tunniste
 */
export async function getMaarayksetByKoodisto(koodisto, maaraykset) {
  return filter(
    propEq("koodisto", koodisto),
    maaraykset || prop("maaraykset", await getLupaFromStorage()) || []
  );
}
