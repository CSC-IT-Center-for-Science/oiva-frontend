import { API_BASE_URL } from "../../modules/constants";
import {
  FETCH_FROM_BACKEND_FAILED,
  FETCH_FROM_BACKEND_IS_ON,
  FETCH_FROM_BACKEND_SUCCESS
} from "./actionTypes";
import * as R from "ramda";

/**
 * The main purpose of this module is to run and cancel XHR calls and to
 * provide related information.
 * @module BackendService
 */

/**
 * Keys of statusMap are: erroneous, fetching, ready and unknown.
 */
export const statusMap = {
  erroneous: "erroneous",
  fetching: "fetching",
  ready: "ready",
  unknown: "unknown"
};

/**
 * Cancels XHR requests by calling the abort method of the given
 * AbortController instances.
 * @param {Object[]} abortControllers - Array of AbortController instances.
 */
export function abort(abortControllers = []) {
  try {
    R.forEach(abortController => {
      abortController.abort();
    }, abortControllers);
  } catch (err) {
    throw err;
  }
}

/**
 * Returns true if XHR call has failed for some reason.
 * @param {object} backendData - Format depends on the used reducer.
 */
export function isErroneous(backendData) {
  return backendData && R.equals(backendData.status, statusMap.erroneous);
}

/**
 * Returns true if XHR call is active.
 * @param {object} backendData - Format depends on the used reducer 222.
 * @return {boolean}
 */
export function isFetching(backendData) {
  return backendData && R.equals(backendData.status, statusMap.fetching);
}

/**
 * Return true if data is fetched and ready for use - otherwice false.
 * @param {object} backendData - Format depends on the used reducer.
 * @return {boolean}
 */
export function isReady(backendData) {
  return backendData && R.equals(backendData.status, statusMap.ready);
}

/**
 * The comprehensive list of the backend routes.
 * Format: { key: url, ... }
 * Example: { luvat: api/luvat/jarjestajilla, ... }
 */
const backendRoutes = {
  kayttaja: `${API_BASE_URL}/auth/me`,
  kielet: `${API_BASE_URL}/koodistot/kielet`,
  kohteet: `${API_BASE_URL}/kohteet`,
  tutkinnot: `${API_BASE_URL}/koodistot/ammatillinen/tutkinnot`,
  koulutuksetMuut: `${API_BASE_URL}/koodistot/koodit/`,
  koulutus: `${API_BASE_URL}/koodistot/koodi/koulutus/`,
  koulutusalat: `${API_BASE_URL}/koodistot/koulutusalat/`,
  koulutustyypit: `${API_BASE_URL}/koodistot/koulutustyypit/`,
  kunnat: `${API_BASE_URL}/koodistot/kunnat`,
  lupa: `${API_BASE_URL}/luvat/jarjestaja/`,
  lupahistoria: `${API_BASE_URL}/luvat/historia/`,
  luvat: `${API_BASE_URL}/luvat/jarjestajilla`,
  maakunnat: `${API_BASE_URL}/koodistot/maakunnat`,
  maakuntakunnat: `${API_BASE_URL}/koodistot/maakuntakunta`,
  maaraystyypit: `${API_BASE_URL}/maaraykset/maaraystyypit`,
  muut: `${API_BASE_URL}/koodistot/koodit/oivamuutoikeudetvelvollisuudetehdotjatehtavat`,
  muutospyynnot: `${API_BASE_URL}/muutospyynnot/`,
  muutospyynto: `${API_BASE_URL}/muutospyynnot/id/`,
  oivamuutoikeudetvelvollisuudetehdotjatehtavat: `${API_BASE_URL}/koodistot/koodit/oivamuutoikeudetvelvollisuudetehdotjatehtavat`,
  opetuskielet: `${API_BASE_URL}/koodistot/opetuskielet`,
  organisaatio: `${API_BASE_URL}/organisaatiot/`,
  vankilat: `${API_BASE_URL}/koodistot/koodit/vankilat`,
  liitteet: `${API_BASE_URL}/liitteet/`
};

/**
 * Runs XHR calls.
 *
 * @param {string} key - A key of backendRoutes object.
 * @param {string} url - XHR call is directed to this url.
 * @param {function} dispatchFn - A dispatch function.
 * @param {object} abortController - An instance of AbortController.
 */
async function run(
  key,
  url,
  options,
  dispatchFn,
  abortController,
  subKey,
  path
) {
  /**
   * It's time to fetch some data!
   */
  try {
    const response = await fetch(url, {
      ...options,
      signal: abortController.signal
    });

    if (response && response.ok) {
      const data = await response.json();

      /**
       * Data will be saved to the same context as what dispatchFn presents.
       */
      dispatchFn({
        data,
        key,
        subKey,
        path,
        type: FETCH_FROM_BACKEND_SUCCESS
      });
    } else {
      /**
       * Fetching failed. So, let's mark it up for later use.
       */
      dispatchFn({
        key,
        response,
        subKey,
        path,
        type: FETCH_FROM_BACKEND_FAILED
      });
    }
    return response;
  } catch (err) {
    /**
     * Fetching failed. So, let's mark it up for later use.
     */
    dispatchFn({
      key,
      err,
      subKey,
      path,
      type: FETCH_FROM_BACKEND_FAILED
    });
  }
}

/**
 *
 * @param {Object[]} keysAndDispatchFuncs - [{ key: string, dispatchFn: function}, ...]
 * @param {string} keysAndDispatchFuncs[].key - A key of the backendRoutes object.
 * @param {string} keysAndDispatchFuncs[].dispatchFn - A dispatch function.
 * @param {array} _abortControllers - Array of AbortController instances
 * @param {number} index
 */
function recursiveFetchHandler(
  keysAndDispatchFuncs,
  _abortControllers = [],
  _responses = [],
  index = 0
) {
  const {
    key,
    dispatchFn,
    options = {},
    urlEnding = "",
    subKey,
    path
  } = R.view(R.lensIndex(index), keysAndDispatchFuncs);

  const url = R.join("", [R.prop(key, backendRoutes), urlEnding]);

  /**
   * When a user is leaving a page and the following backend call is active we can
   * use an abort controller to gracefully abort the call. So, let's create one.
   */
  const abortController = new AbortController();

  /**
   * This is practically a push operation written with Ramda.
   */
  const abortControllers = R.append(abortController, _abortControllers);

  /**
   * Fetching is about to start. So, let's mark it up for later use.
   */
  dispatchFn({
    key,
    subKey,
    path,
    type: FETCH_FROM_BACKEND_IS_ON
  });

  /**
   * XHR call is made by the run function.
   */
  const responses = R.append(
    run(key, url, options, dispatchFn, abortController, subKey, path),
    _responses
  );

  /**
   * Let's handle the next fetch setup. Current function is called
   * again with updated parameters here.
   */
  if (index < keysAndDispatchFuncs.length - 1) {
    return recursiveFetchHandler(
      keysAndDispatchFuncs,
      abortControllers,
      responses,
      index + 1
    );
  }
  return { abortControllers, promises: responses };
}

/**
 * Uses recursiveFetchHandler function to loop through the given array of objects.
 * @param {Object[]} keysAndDispatchFuncs - [{ key: string, dispatchFn: function}, ...]
 */
export function fetchFromBackend(keysAndDispatchFuncs = []) {
  return keysAndDispatchFuncs.length > 0
    ? recursiveFetchHandler(keysAndDispatchFuncs)
    : { abortControllers: [], promises: [] };
}
