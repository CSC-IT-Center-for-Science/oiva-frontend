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
