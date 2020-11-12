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

const isSubTreeEmpty = obj => {
  if (Array.isArray(obj) || isObject(obj)) {
    return R.flatten(R.values(R.mapObjIndexed(isSubTreeEmpty, obj)));
  } else {
    return obj;
  }
};

export const isTreeEmpty = obj => R.isEmpty(isSubTreeEmpty(obj));

/**
 * Poistaa lehden (muutosobjekti). Mikäli muutosobjektiin on merkitty
 * mihin kohtaan muutosten puuta huomio (fokus) tulee seuraavaksi siirtää,
 * hoidetaan huomion siirtäminen.
 * @param {*} leaf
 * @param {*} branch
 * @param {*} tree
 */
// const removeLeaf = (leaf, branch, tree) => {
//   const shouldHaveFocusPath = ["properties", "shouldHaveFocus"];
// const focusWhenDeleted = R.path(
//   ["properties", "metadata", "focusWhenDeleted"],
//   leaf
// );
//   /* Jos lehti sisältää tiedon siitä, mihin mihin huomio on
//    * seuraavaksi kohdistettava, pidetään huoli, että näin käy. Luodaan
//    * vaikka tarvittaessa uusi muutosobjekti.
//    **/
//   console.info("Poistetaan lehti: ", leaf, branch, tree);
//   if (!!focusWhenDeleted) {
//     let updatedTree =
//     const changeObj = R.find(
//       R.propEq("anchor", focusWhenDeleted),
//       R.path(R.split("_", getAnchorPart(focusWhenDeleted, 0)), tree.unsaved)
//     );
//     if (changeObj && !R.pathEq(shouldHaveFocusPath, true, changeObj)) {
//       const p = R.split("_", getAnchorPart(changeObj.anchor, 0));
//       const leavesToWalkThrough = R.path(p, tree.unsaved);
//       console.info("Leaves to walk trough: ", leavesToWalkThrough);
//       const updatedTree = R.assocPath(
//         R.prepend("unsaved", p),
//         map(leaves => {
//           console.info("Lehdet: ", leaves);
//           return leaves;
//         }, leavesToWalkThrough),
//         tree
//       );

//       console.info("Asetetaan fokus", leaf, changeObj);
//     }
//   }
//   return null;
// };

const updateLeaf = (p, leafWithNewData, tree) => {
  const anchor = R.prop("anchor", leafWithNewData);
  const branch = R.map(leaf => {
    return leaf.anchor === anchor ? leafWithNewData : leaf;
  }, R.path(p, tree));
  return R.assocPath(p, branch, tree);
};

const setFocusOnLeaf = (anchors, tree, index = 0) => {
  const anchor = R.nth(index, anchors);
  if (anchor) {
    console.info(anchor, anchors, index);
    const p = R.prepend("unsaved", R.split("_", getAnchorPart(anchor, 0)));
    const leafToUpdate = R.find(
      R.propEq("anchor", anchor),
      R.path(R.split("_", getAnchorPart(anchor, 0)), tree.unsaved)
    );
    const updatedLeaf = R.assocPath(
      ["properties", "shouldHaveFocus"],
      +new Date(), // Current timestamp in milliseconds
      leafToUpdate
    );
    const updatedTree = updateLeaf(p, updatedLeaf, tree);
    if (!!R.nth(index + 1, anchors)) {
      return setFocusOnLeaf(anchors, updatedTree, index + 1);
    } else {
      return updatedTree;
    }
  }
  return tree;
};

const removeOldLeaves = (p = [], tree) => {
  const branch = R.path(p, tree);
  const leavesToRemove = R.filter(
    R.pathEq(["properties", "deleteElement"], true),
    branch
  );
  const updatedTree = setFocusOnLeaf(
    R.map(
      R.path(["properties", "metadata", "focusWhenDeleted"]),
      leavesToRemove
    ),
    tree
  );
  return updatedTree;

  /**
   * Jos poistettavissa lehdissä on merkintä seuraavasta fokusoitavasta
   * elementistä, tehdään puuhun merkintöjen mukaiset operaatiot.
   */

  // const updatedTree = R.assocPath(p, , tree)

  // R.map(leaf => {
  //   // Poistetaan lehti, jos se on asetettu poistettavaksi.
  //   if (R.pathEq(["properties", property], true, leaf)) {
  //     return removeLeaf(leaf, branchOfTree, tree);
  //   } else {
  //     // Jos lehteä ei ole asetettu poistettavaksi, palautetaan nykyinen lehti.
  //     return leaf;
  //   }
  // }, branchOfTree);
};

// const setShouldBeFocused = (branchOfTree = [], tree) => {
//   const shouldHaveFocusPath = ["properties", "shouldHaveFocus"];
//   const changeObjects = R.map(leaf => {
//     const { focusWhenDeleted } = leaf.properties.metadata || {};
//     /**
//      * Jos lehti sisältää tiedon siitä, mihin mihin huomio on
//      * seuraavaksi kohdistettava, pidetään huoli, että näin käy. Luodaan
//      * vaikka tarvittaessa uusi muutosobjekti.
//      **/
//     if (!!focusWhenDeleted) {
//       const changeObj = R.find(
//         R.propEq("anchor", focusWhenDeleted),
//         R.path(R.split("_", getAnchorPart(focusWhenDeleted, 0)), tree.unsaved)
//       );
//       /**
//        * Jos kyseistä lomakkeen kohtaa on jo muokattu eli on olemassa
//        * muutosobjekti, päivitetään muutosobjektia siten, että tietoja käyttävä
//        * komponentti saa tiedon siitä, että komponentin sisältämän elementin
//        * tulisi olla kohdennettu.
//        */
//       if (changeObj && !R.pathEq(shouldHaveFocusPath, true, changeObj)) {
//         console.info("Asetetaan fokus", leaf, changeObj);
//         return [leaf, R.assocPath(shouldHaveFocusPath, true, changeObj)];
//       }
//     }
//     return leaf;
//   }, branchOfTree).filter(Boolean);
//   return R.uniq(R.flatten(changeObjects));
// };

const protectedTreeProps = ["unsaved", "underRemoval"];

/**
 * Funktiossa ravistellaan moniulotteisesta objektista (tree) pois
 * tyhjät taulukot ja objektit.
 * @param {*} p Polku, joka käydään läpi aloittaen polun perältä
 * @param {*} tree Objekti, josta polku etsitään läpi käytäväksi
 */
export const recursiveTreeShake = (p = [], tree) => {
  // Poistetaan käsiteltävänä olevasta oksasta vanhat lehdet.
  const updatedTree = removeOldLeaves(p, tree);

  // let subTreeWithFocusProps = Array.isArray(subTree)
  //   ? setShouldBeFocused(subTree, tree)
  //   : subTree;
  // const subTreeWithoutFlaggedAsDeleted = Array.isArray(subTree)
  //   ? removeLeaves(subTree, tree)
  //   : subTree;
  // const isSubTreeEmpty = isTreeEmpty(subTreeWithoutFlaggedAsDeleted);

  // /**
  //  * Tyhjän alipuun voi poistaa, kunhan huomioidaan se, ettei poisteta
  //  * puusta "suojeltuja" propertyjä, jotka on määritelty
  //  * protectedTreeProps-muuttujassa.
  //  */
  // if (!R.includes(R.last(p), protectedTreeProps)) {
  //   if (isSubTreeEmpty) {
  //     let updatedTree = R.dissocPath(p, tree);
  //     if (isTreeEmpty(R.init(p), updatedTree)) {
  //       updatedTree = R.dissocPath(R.init(p), tree);
  //     }
  //     if (R.length(p)) {
  //       return recursiveTreeShake(R.init(p), updatedTree);
  //     }
  //   } else {
  //     tree = R.assocPath(p, subTreeWithoutFlaggedAsDeleted, tree);
  //   }
  // }
  return updatedTree;
};

/**
 * Käy annetun oksan (branch) lehdet (muutosobjektit) läpi ja
 * palauttaa niistä uudet versiot hyödyntäen parametrinä annettua funktiota.
 * Mikäli oksa sisältää alioksia, kutsuu modifyLeavesOfBranch itseään
 * parametreinä fn ja alioksa.
 * @param {*} fn Funktio, joka palauttaa oksan lehdistä uudet versiot.
 * @param {*} branch Objekti (puu), joka käydään läpi.
 */
export const modifyLeavesOfBranch = (fn, branch) => {
  return R.mapObjIndexed(subBranch => {
    if (Array.isArray(subBranch)) {
      return fn(subBranch);
    } else {
      return modifyLeavesOfBranch(fn, subBranch);
    }
  }, branch);
};
