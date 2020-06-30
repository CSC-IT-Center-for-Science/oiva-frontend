import * as R from "ramda";

export function findBackendMuutos(anchor, backendMuutokset) {
  const backendMuutos = R.find(muutos => {
    return !!R.find(R.propEq("anchor", anchor), muutos.meta.changeObjects);
  }, backendMuutokset);
  if (!backendMuutos && R.includes(".", anchor)) {
    return findBackendMuutos(
        R.compose(R.join("."), R.init, R.split("."), R.always(anchor)),
        backendMuutokset
    );
  }
  return { anchor, backendMuutos };
}

/**
 * Function returns change objects related to reasoning (perustelut)
 * and to current anchor. There are different methods to find the
 * correct change objects.
 * @param {string} anchor - Dot separated string, id of a change object.
 * @param {array} changeObjects - Array of change objects.
 */
export function findPerustelut(anchor, changeObjects) {
  function getPerustelut(anchor, perustelut, method = R.includes) {
    return R.filter(R.compose(method(anchor), R.prop("anchor")), perustelut);
  }
  // Method 1: Add perustelut_ string in front of the anchor.
  let perustelutAnchor = `perustelut_${anchor}`;
  let perustelut = getPerustelut(perustelutAnchor, changeObjects);
  if (R.isEmpty(perustelut)) {
    // Method 2: Remove the last part of the anchor and try method 1 again.
    let anchorInit = R.slice(0, R.lastIndexOf(".", anchor), anchor);
    perustelutAnchor = `perustelut_${anchorInit}`;
    perustelut = getPerustelut(perustelutAnchor, changeObjects);
    if (R.isEmpty(perustelut)) {
      // Method 3: Take the anchor of method to and replace the dots with
      // underscores.
      perustelutAnchor = `perustelut_${R.replace(".", "_", anchorInit)}`;
      perustelut = getPerustelut(perustelutAnchor, changeObjects, R.startsWith);
    }
  }
  return perustelut;
}

/**
 * @module Muutoshakemus
 */

/**
 * Function calculates the current state of changes by using the changes from
 * backend and changes which are not saved yet.
 * @param {Object} muutoshakemus - Contains all the section related configuration.
 */
export function getChangeObjects(muutoshakemus) {
  /**
   * Function finds out all the anchors with a numeric value as their first
   * part. It's curried because of a need to call it with negation.
   */
  const curriedSplitter = R.curry(
    R.compose(
      isNaN,
      R.head,
      R.split("."),
      R.prop("anchor")
    )
  );

  let changeObjects = {
    tutkinnot: [],
    koulutukset: [],
    kielet: {
      opetuskielet: [],
      tutkintokielet: {}
    },
    opiskelijavuodet: [],
    toimintaalue: [],
    muut: {}
  };
  const {
    backendChanges,
    opetuskielet,
    tutkinnot,
    koulutukset,
    opiskelijavuodet,
    tutkintokielet,
    toimintaalue,
    muut
  } = muutoshakemus;

  if (backendChanges.kielet) {
    if (backendChanges.kielet.opetuskielet) {
      changeObjects.kielet.opetuskielet = R.compose(
        R.uniq,
        R.concat(backendChanges.kielet.opetuskielet || [])
      )(opetuskielet.state.changes || []);
    }
    if (backendChanges.kielet.tutkintokielet) {
      changeObjects.kielet.tutkintokielet = R.mergeWith(
        R.compose(
          R.uniq,
          R.concat
        ),
        backendChanges.kielet.tutkintokielet || {},
        ((tutkintokielet || {}).state || {}).changes || []
      );
    }
  }

  if (backendChanges.tutkinnotjakoulutukset) {
    const backendChangesTutkinnot = R.filter(
      R.compose(
        R.not,
        curriedSplitter
      )
    )(backendChanges.tutkinnotjakoulutukset);

    const backendChangesKoulutukset = R.filter(curriedSplitter)(
      backendChanges.tutkinnotjakoulutukset
    );

    const freshChanges = R.flatten(
      R.map(R.prop("changes"))(((tutkinnot || {}).state || {}).items || [])
    );

    changeObjects.tutkinnot = R.compose(
      R.uniq,
      R.concat(backendChangesTutkinnot || [])
    )(freshChanges);

    changeObjects.koulutukset = R.compose(
      R.uniq,
      R.concat(backendChangesKoulutukset || [])
    )(((koulutukset || {}).state || {}).changes || []);
  }

  if (backendChanges.opiskelijavuodet) {
    changeObjects.opiskelijavuodet = R.compose(
      R.uniq,
      R.concat(backendChanges.opiskelijavuodet || [])
    )(((opiskelijavuodet || {}).state || {}).changes || []);
  }

  if (backendChanges.muut) {
    changeObjects.muut = R.mergeWith(
      R.compose(
        R.uniq,
        R.concat
      ),
      backendChanges.muut || {},
      ((muut || {}).state || {}).changes || []
    );
  }

  if (backendChanges.toimintaalue) {
    const valtakunnallinenChange = [
      ((toimintaalue || {}).state || {}).changesOfValtakunnallinen
    ].filter(Boolean);
    const newChanges = [];
    changeObjects.toimintaalue = R.compose(
      R.concat(backendChanges.toimintaalue || []),
      R.concat(valtakunnallinenChange)
    )(newChanges);
  }
  return changeObjects;
}

export const createMuutospyyntoOutput = (muutospyynto, attachments) => {
  let data = new FormData();
  const muutos = new Blob([JSON.stringify(muutospyynto)], {
    type: "application/json"
  });
  data.append("muutospyynto", muutos, "muutospyynnön json-data");

  if (attachments) {
    attachments.map(item => {
      if (!item.removed && item.new && item.tiedosto instanceof Blob) {
        data.append(item.tiedostoId, item.tiedosto, item.filename);
        item.tiedosto = null;
      }
      return null;
    });
  }
  return data;
};
