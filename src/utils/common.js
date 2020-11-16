import { API_BASE_URL } from "../modules/constants";
import moment from "moment";
import * as R from "ramda";

/**
 * Utility functions are listed here.
 * @namespace utils
 * */

/**
 * @module Utils/common
 */

/**
 * Returns a part of the given anchor by index.
 * @param {string} anchor
 * @param {number} index
 * @param {string} separator - Default value: .
 */
export function getAnchorPart(anchor, index, separator = ".") {
  return R.compose(R.view(R.lensIndex(index)), R.split(separator))(anchor);
}

/**
 * Returns the element with the given anchor from the array of elements
 * @param anchor
 * @param scanArray
 */
export const findAnchoredElement = (anchor, scanArray) => {
  return R.find(R.propEq("anchor", anchor), scanArray || []);
};

export const findAnchoredCategoryFromElement = (anchor, elementObject) => {
  return findAnchoredElement(anchor, elementObject.categories);
};

export const findAnchoredComponentFromElement = (anchor, elementObject) => {
  return findAnchoredElement(anchor, elementObject.components);
};

const findAnchoredCategoryOrComponentFromElement = (anchor, elementObject) => {
  let retval = findAnchoredCategoryFromElement(anchor, elementObject);
  if (!retval) retval = findAnchoredComponentFromElement(anchor, elementObject);
  return retval;
};

/**
 * Find first element that matches anchor prefix.
 * @param anchorStart Anchor prefix to match
 * @param changeObjects List of change objects
 * @returns Found element or undefined
 */
export const findChange = (anchorStart, changeObjects) =>
  R.find(R.compose(R.startsWith(anchorStart), R.prop("anchor")), changeObjects);

/**
 * Returns the element found from given anchor in a category hierarchy. We expect that the anchor is
 * a . delimited path with elements being categories and optionally the last element being a component
 *
 * @param anchor The path for scanning the component from stateObject (e.g. vahimmaisopiskelijavuodet.A)
 * @param stateObject
 */
export const findAnchoredElementFromCategoryHierarchy = (
  anchor,
  rootObject
) => {
  if (!rootObject || !anchor || R.isEmpty(rootObject)) return undefined;
  const anchorParts = anchor.split(".");
  let currentElement = rootObject;

  for (const anchorPart of anchorParts) {
    currentElement = findAnchoredCategoryOrComponentFromElement(
      anchorPart,
      currentElement
    );

    if (!currentElement) {
      return undefined;
    }
  }

  return currentElement;
};

export const removeAnchorPart = (anchor, index, separator = ".") => {
  return R.compose(
    R.join(separator),
    R.remove(index, 1),
    R.split(separator)
  )(anchor);
};

export const getAnchorInit = anchor => removeAnchorPart(anchor, -1);

export const replaceAnchorPartWith = (anchor, index, replaceWith) => {
  return R.compose(
    R.join("."),
    R.update(index, replaceWith),
    R.split(".")
  )(anchor);
};

export const curriedGetAnchorPartsByIndex = R.curry((objects, index) => {
  return R.map(obj => {
    return getAnchorPart(R.prop("anchor", obj), index);
  }, objects);
});

export const getAnchorsStartingWith = (prefix, objects) => {
  return R.filter(
    R.compose(R.startsWith(prefix), R.head, R.split("."), R.prop("anchor"))
  )(objects);
};

export const flattenObj = obj => {
  const go = obj_ =>
    R.chain(([k, v]) => {
      if (R.type(v) === "Object" || R.type(v) === "Array") {
        return R.map(([k_, v_]) => [`${k}.${k_}`, v_], go(v));
      } else {
        return [[k, v]];
      }
    }, R.toPairs(obj_));

  return R.fromPairs(go(obj));
};

/**
 * Function finds all objects with given key from the given object.
 * @param {object} object - JavaScript object, can be deeply nested
 * @param {string} targetKey - Key to search for
 */
export function findObjectWithKey(object, targetKey) {
  function find(object, targetKey) {
    const keys = R.keys(object);
    if (keys.length > 0) {
      return R.map(key => {
        if (R.equals(key, targetKey)) {
          return object[key];
        } else if (R.is(Object, object[key])) {
          return findObjectWithKey(object[key], targetKey);
        }
        return false;
      }, keys);
    }
    return false;
  }
  return R.filter(
    R.compose(R.not, R.isEmpty),
    R.flatten(find(object, targetKey)).filter(Boolean)
  );
}

/**
 * Open file using generated and hidden <a> element
 * @param obj containing properties filename and tiedosto or property url. Has optional parameter openInNewWindow
 */
export const downloadFileFn = ({
  filename,
  tiedosto,
  url,
  openInNewWindow
}) => {
  return () => {
    let a = document.createElement("a");
    a.setAttribute("type", "hidden");
    if (openInNewWindow) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferer");
    }

    document.body.appendChild(a); // Needed for Firefox
    if (tiedosto && tiedosto instanceof Blob) {
      const reader = new FileReader();
      reader.readAsDataURL(tiedosto);
      reader.onload = function() {
        a.href = reader.result;
        a.download = filename;
        a.click();
        a.remove();
      };
    } else if (url) {
      a.href = R.startsWith("/api", url) ? url : API_BASE_URL + url;
      a.click();
      a.remove();
    } else {
      console.warn("Cannot open file: No octet stream nor file url");
      return false;
    }
    return true;
  };
};

export const downloadFile = url => {
  if (url) {
    let a = document.createElement("a");
    a.setAttribute("type", "hidden");
    a.href = R.startsWith("/api", url) ? url : API_BASE_URL + url;
    a.download = true;
    a.click();
    a.remove();
    return true;
  }
  return false;
};

/**
 *
 * @param {object} a - Object to compare.
 * @param {object} b - Object to compare.
 * @param {array} path - Path to the property.
 */
export function sortObjectsByProperty(a, b, path) {
  if (!path) {
    throw new Error("No property path given.");
  }
  const aRaw = R.path(path, a);
  const bRaw = R.path(path, b);
  const aDate = moment(aRaw, "DD.MM.YYYY", true);
  const bDate = moment(bRaw, "DD.MM.YYYY", true);
  const aCompare = aDate.isValid() ? aDate : aRaw;
  const bCompare = aDate.isValid() ? bDate : bRaw;

  if (aCompare < bCompare) {
    return -1;
  } else if (aCompare > bCompare) {
    return 1;
  }
  return 0;
}

export const getLatestChangesByAnchor = (anchor, latestChanges = []) => {
  return R.filter(
    R.pipe(R.prop("anchor"), a =>
      R.or(R.startsWith(`${anchor}_`, a), R.startsWith(`${anchor}.`, a))
    ),
    latestChanges
  );
};

const isObject = variable => {
  return Object.prototype.toString.call(variable) === "[object Object]";
};

/**
 * Tarkistaa, onko annettu objekti tyhjä.
 * @param {*} obj
 */
const isBranchEmpty = obj => {
  return Array.isArray(obj) || isObject(obj)
    ? R.flatten(R.values(R.mapObjIndexed(isBranchEmpty, obj)))
    : obj;
};

const isWholeBranchEmpty = obj => R.isEmpty(isBranchEmpty(obj));

const removeOldLeaves = (p = [], tree) => {
  return R.assocPath(
    p,
    R.without(
      R.filter(leaf => {
        return R.pathEq(["properties", "deleteElement"], true, leaf);
      }, R.path(p, tree)),
      R.path(p, tree)
    ),
    tree
  );
};

const protectedTreeProps = ["unsaved", "underRemoval"];

/**
 * Funktiossa ravistellaan moniulotteisesta objektista (tree) pois
 * tyhjät taulukot ja objektit sekä suoritetaan mahdolliset poistamista
 * edeltävät operaatiot.
 * @param {*} p Polku, joka käydään läpi aloittaen polun perältä
 * @param {*} branch Objekti (oksa), joka käydään läpi. Voi olla koko puu.
 */
export const recursiveTreeShake = (p = [], branch, dispatch) => {
  /**
   * Poistetaan käsiteltävänä olevasta oksasta poistettavaksi merkityt lehdet.
   * Toimenpiteen ohessa lehdestä voi löytyä merkintöjä operaatoista, jotka
   * on suoritettava ennen lehden poistamista. Esimerkkinä tällaisesta
   * operaatiosta on fokuksen siirtäminen poistettavasta lehdestä muutospuun
   * toiseen lehteen. removeOldLeaves hoitaa tällaiset operaatiot ennen kuin
   * se poistaa poistettavaksi merkityn lehden. Lopuksi se palauttaa
   * uuden version muutosten puusta.
   **/
  let updatedBranch = removeOldLeaves(p, branch);

  /**
   * Tyhjän oksan voi poistaa, kunhan huomioidaan se, ettei poisteta
   * puusta pääoksien kiinnityskohtia, jotka on määritelty
   * protectedTreeProps-muuttujassa.
   */
  if (!R.includes(R.last(p), protectedTreeProps)) {
    if (isWholeBranchEmpty(R.path(p, branch))) {
      updatedBranch = R.dissocPath(p, branch);
      if (R.length(p)) {
        return recursiveTreeShake(R.init(p), updatedBranch);
      }
    }
  }
  return updatedBranch;
};
