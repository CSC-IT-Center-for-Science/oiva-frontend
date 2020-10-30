import localforage from "localforage";
import { filter, pathEq } from "ramda";

export function getLupaFromStorage() {
  return localforage.getItem("lupa");
}

/**
 * Palauttaa määräykset kohteen tunnisteen perusteella. Tunniste voi olla
 * esimerkiksi "toimintaalue".
 * @param {string} tunniste
 */
export function getMaarayksetByTunniste(tunniste, maaraykset = []) {
  return filter(pathEq(["kohde", "tunniste"], tunniste), maaraykset);
}
