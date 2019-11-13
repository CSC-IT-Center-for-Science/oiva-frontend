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
export function isErroneous(backendData = {}) {
  return backendData && R.equals(backendData.status, statusMap.erroneous);
}

/**
 * Returns true if XHR call is active.
 * @param {object} backendData - Format depends on the used reducer 222.
 * @return {boolean}
 */
export function isFetching(backendData = {}) {
  return backendData && R.equals(backendData.status, statusMap.fetching);
}

/**
 * Return true if data is fetched and ready for use - otherwice false.
 * @param {object} backendData - Format depends on the used reducer.
 * @return {boolean}
 */
export function isReady(backendData = {}) {
  return backendData && R.equals(backendData.status, statusMap.ready);
}

/**
 * The comprehensive list of the backend routes.
 * Format: { key: url, ... }
 * Example: { luvat: api/luvat/jarjestajilla, ... }
 */
const backendRoutes = {
  elykeskukset: { path: `koodistot/koodit/elykeskukset` },
  kayttaja: { path: `auth/me` },
  kielet: { path: `koodistot/kielet` },
  kohteet: { path: `kohteet` },
  tutkinnot: { path: `koodistot/ammatillinen/tutkinnot` },
  koulutuksetMuut: { path: `koodistot/koodit/` },
  koulutus: { path: `koodistot/koodi/koulutus/` },
  koulutusalat: { path: `koodistot/koulutusalat/` },
  koulutustyypit: { path: `koodistot/koulutustyypit/` },
  kunnat: { path: `koodistot/kunnat` },
  lupa: { path: `luvat/jarjestaja/` },
  lupahistoria: { path: `luvat/historia/` },
  luvat: { path: `luvat/jarjestajilla` },
  maakunnat: { path: `koodistot/maakunnat` },
  maakuntakunnat: { path: `koodistot/maakuntakunta` },
  maaraystyypit: { path: `maaraykset/maaraystyypit` },
  muut: {
    path: `koodistot/koodit/oivamuutoikeudetvelvollisuudetehdotjatehtavat`
  },
  muutospyynnot: { path: `muutospyynnot/` },
  muutospyynto: { path: `muutospyynnot/id/` },
  muutospyynnonLiitteet: { path: 'muutospyynnot/', postfix: '/liitteet/' },
  oivamuutoikeudetvelvollisuudetehdotjatehtavat: {
    path: `koodistot/koodit/oivamuutoikeudetvelvollisuudetehdotjatehtavat`
  },
  oivaperustelut: { path: `koodistot/koodit/oivaperustelut` },
  opetuskielet: { path: `koodistot/opetuskielet` },
  organisaatio: { path: `organisaatiot/` },
  paatoskierrokset: { path: `paatoskierrokset/open` },
  vankilat: { path: `koodistot/koodit/vankilat` },
  liitteet: { path: `liitteet/`, abortController: false }
};

/**
 * Runs XHR calls.
 *
 * @param {string} key - A key of backendRoutes object.
 * @param {string} routeObj - A member of the backendRoutes object.
 * @param {function} dispatchFn - A dispatch function.
 * @param {object} abortController - An instance of AbortController.
 */
async function run(
  key,
  routeObj,
  options,
  dispatchFn,
  abortController,
  subKey,
  path,
  urlEnding = ""
) {
  /**
   * It's time to fetch some data!
   */
  try {
    if (abortController) {
      options.signal = abortController.signal;
    }
    const response = await fetch(
      `${API_BASE_URL}/${R.join("", [routeObj.path, urlEnding, routeObj.postfix])}`,
      // add 'accept' header if it does not exist
      R.mergeDeepLeft(options, {headers: {"Accept": "application/json"}}),
    );

    if (response && response.ok) {
      const contentType = response.headers.get("content-type");
      let data = "";
      if (R.includes("application/json", contentType)) {
        data = await response.json();
      } else if (contentType === "application/octet-stream") {
        const data = await response.blob();
      }

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
    console.info(err);
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

  const routeObj = R.prop(key, backendRoutes);

  /**
   * When a user is leaving a page and the following backend call is active we can
   * use an abort controller to gracefully abort the call. So, let's create one.
   */
  const abortController =
    routeObj.abortController !== false ? new AbortController() : false;

  /**
   * This is practically a push operation written with Ramda.
   */
  const abortControllers = abortController
    ? R.append(abortController, _abortControllers)
    : _abortControllers;

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
    run(
      key,
      routeObj,
      options,
      dispatchFn,
      abortController,
      subKey,
      path,
      urlEnding
    ),
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
