import localforage from "localforage";
import { filter, pathEq } from "ramda";

export async function storeLupa(lupadata) {
  return await localforage.setItem("lupa", lupadata);
}

export function getLupaFromStorage() {
  return localforage.getItem("lupa");
}

/**
 * Palauttaa määräykset kohteen tunnisteen perusteella. Tunniste voi olla
 * esimerkiksi "toimintaalue".
 * @param {string} tunniste
 */
export async function getMaarayksetByTunniste(tunniste) {
  const lupa = await getLupaFromStorage();
  let maaraykset = [];
  if (lupa) {
    maaraykset = filter(
      pathEq(["kohde", "tunniste"], tunniste),
      lupa.data.maaraykset
    );
  } else {
    console.warn(
      "Unable to find lupa from local storage (IndexedDB, WebSQL or localstorage)!"
    );
  }
  return maaraykset;
}
