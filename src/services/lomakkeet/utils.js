import * as R from "ramda";
import "./i18n-config";
import { __ } from "i18n-for-browser";
import { findObjectWithKey, removeAnchorPart } from "../../utils/common";

export function getMessages(key) {
  const messages = {
    attachments: {
      attachmentAdd: __("attachments.attachmentAdd"),
      attachmentDownload: __("attachmentDownload"),
      attachmentError: __("attachments.attachmentError"),
      attachmentErrorName: __("attachments.attachmentErrorName"),
      attachmentName: __("attachments.attachmentName"),
      attachmentNone: __("attachments.attachmentNone"),
      attachmentRemove: __("attachments.attachmentRemove"),
      attachmentSecretSelect: __("attachments.attachmentSecretSelect"),
      attachmentSecretUnselect: __("attachments.attachmentSecretUnselect"),
      attachmentSecret: __("attachments.attachmentSecret"),
      cancel: __("common.cancel"),
      ok: __("common.ok")
    }
  };
  return key ? messages[key] : {};
}

export function createRules(requiredFields = []) {
  return R.map(rule => {
    return {
      isRequired: () => true,
      markRequiredFields: lomake => {
        const _path = getPathByAnchor(R.split(".", rule.anchor), lomake);
        return R.assocPath(
          R.concat(_path, ["properties", "isRequired"]),
          true,
          lomake
        );
      },
      isValid: (lomake, changeObjects) => {
        return () =>
          ifOneTerm(
            [
              {
                anchor: rule.anchor,
                properties: { value: R.compose(R.not, R.isEmpty) }
              }
            ],
            lomake,
            changeObjects
          );
      },
      showErrors: (lomake, isValid) => {
        const _path = getPathByAnchor(R.split(".", rule.anchor), lomake);
        return R.assocPath(
          R.concat(_path, ["properties", "isValid"]),
          isValid,
          lomake
        );
      }
    };
  }, requiredFields);
}
/**
 *
 * @param {array} categories - Categories structure.
 * @param {object} reqProps - Is used for filtering found components.
 * @param {object} decorateWith - Object that will be attached return value.
 * @param {array} _fullAnchor - "Component's full anchor. For recursion only."
 */
export function createTerms(
  categories,
  reqProps = {},
  decorateWith = {},
  _fullAnchor = []
) {
  return R.map(category => {
    const fullAnchor = R.append(category.anchor, _fullAnchor);
    if (category.categories) {
      return createTerms(
        category.categories,
        reqProps,
        decorateWith,
        fullAnchor
      ).filter(Boolean);
    }
    if (category.components) {
      return R.map(component => {
        let isToBeReturned = true;
        R.mapObjIndexed((value, key) => {
          if (!R.equals(R.prop(key, component), value)) {
            isToBeReturned = false;
          }
        }, reqProps);
        return isToBeReturned
          ? Object.assign(
              {},
              {
                anchor: `${R.join(".", fullAnchor)}.${component.anchor}`
              },
              decorateWith
            )
          : null;
      }, category.components).filter(Boolean);
    }
    return null;
  }, categories);
}

export function getCategoriesByProps(
  categories,
  reqProps = {},
  _fullAnchor = [],
  results = [],
  fullPath = []
) {
  return R.addIndex(R.map)((category, i) => {
    const fullAnchor = R.append(category.anchor, _fullAnchor);
    let isToBeReturned = true;
    R.forEachObjIndexed((value, key) => {
      if (value instanceof Function) {
        isToBeReturned = value(R.prop(key, category));
      } else if (!R.equals(R.prop(key, category), value)) {
        isToBeReturned = false;
      }
    }, reqProps);
    if (isToBeReturned) {
      results.push(
        Object.assign({}, category, {
          fullAnchor: R.join(".", fullAnchor),
          fullPath: R.append(i, fullPath)
        })
      );
    }
    if (category.categories) {
      return getCategoriesByProps(
        category.categories,
        reqProps,
        fullAnchor,
        results,
        R.concat(fullPath, [i, "categories"])
      ).filter(Boolean);
    }
    return results;
  }, categories);
}

export function sortArticlesByHuomioitavaKoodi(articles, locale) {
  const sortedArticles = R.sort((a, b) => {
    const metadataA = R.find(R.propEq("kieli", locale), a.metadata);
    const metadataB = R.find(R.propEq("kieli", locale), b.metadata);
    /**
     * List items will be arranged by huomioitava koodi. If it isn't
     * available we use value 0 instead of it. That's why undefined
     * ones go on top of the list.
     */
    const numberValueA = parseInt(metadataA.huomioitavaKoodi, 10) || 0;
    const numberValueB = parseInt(metadataB.huomioitavaKoodi, 10) || 0;
    if (numberValueA > numberValueB) {
      return 1;
    } else if (numberValueA < numberValueB) {
      return -1;
    } else {
      return 0;
    }
  }, articles);
  return sortedArticles;
}

/**
 * Function returns an array of path parts. User can access the
 * related component on the given form e.g. using Ramda's
 * (ramdajs.com) path related functions.
 * @param {*} anchorArr - Splitted anchor.
 * @param {*} lomake - A categories structure.
 * @param {*} anchorPartIndex - Initial value 0. Used for recursion.
 * @param {*} _path - Return value. Initial value is "".
 */
export function getPathByAnchor(
  anchorArr = [],
  lomake,
  anchorPartIndex = 0,
  _path = []
) {
  const anchorPart = anchorArr[anchorPartIndex];
  if (typeof anchorPart === "number") {
    console.error(
      `Anchor must be a string not a number.`,
      anchorPart,
      anchorArr
    );
  }
  let pathPart = [];
  if (anchorPartIndex === 0) {
    pathPart = [R.findIndex(R.propEq("anchor", anchorPart), lomake)];
  } else if (anchorPartIndex + 1 < anchorArr.length) {
    const updatedPath = R.append("categories", _path);
    const lomakePart = R.path(updatedPath, lomake);
    const index = R.findIndex(R.propEq("anchor", anchorPart), lomakePart);
    if (index !== -1 && lomakePart) {
      pathPart = ["categories", index];
    } else {
      console.error("Can't find the requested part of the form.");
      console.info(
        "Make sure that there aren't duplicate anchor values on the same level of form definition."
      );
    }
  } else {
    const updatedPath = R.append("components", _path);
    const lomakePart = R.path(updatedPath, lomake);
    if (lomakePart) {
      const componentPathPart = R.findIndex(
        R.propEq("anchor", anchorPart),
        lomakePart
      );
      if (componentPathPart !== -1) {
        pathPart = [
          "components",
          R.findIndex(R.propEq("anchor", anchorPart), lomakePart)
        ];
      }
    } else {
      console.error(`Can't find anchor ${anchorPart} of ${lomakePart}.`);
    }
  }

  if (R.head(pathPart) !== -1) {
    _path = R.concat(_path, pathPart);

    if (anchorArr[anchorPartIndex + 1]) {
      return getPathByAnchor(anchorArr, lomake, anchorPartIndex + 1, _path);
    }
  } else {
    console.error(
      `Can't calculate the path for ${anchorArr} of the form:`,
      lomake
    );
  }
  return _path;
}

const checkTerms = (terms, lomake, changeObjects) => {
  return R.map(term => {
    const _path = getPathByAnchor(R.split(".", term.anchor), lomake);
    const component = R.path(_path, lomake);
    let isValid = true;
    if (component) {
      const changeObject = R.find(changeObj => {
        const anchor = removeAnchorPart(changeObj.anchor, 0);
        return R.equals(anchor, term.anchor);
      }, changeObjects);
      /**
       * Let's loop through the properties of the component.
       **/
      R.mapObjIndexed((value, key) => {
        const source = changeObject || component;
        if (
          (value instanceof Function && !value(source.properties[key])) ||
          (!(value instanceof Function) &&
            !R.equals(value, component.properties[key]) &&
            (!changeObject || !R.equals(changeObject.properties[key], value)))
        ) {
          isValid = false;
        }
      }, term.properties);
    } else {
      isValid = false;
    }

    return isValid;
  }, terms);
};

const checkTerm = (term, lomake, changeObjects) => {
  return checkTerms([term], lomake, changeObjects);
};

export const ifOne = R.includes(true);
export const ifAll = R.all(R.equals(true));
export const ifAllTerms = R.compose(ifAll, checkTerms);
export const ifOneTerm = R.compose(R.includes(true), checkTerms);
export const ifTerm = R.compose(R.includes(true), checkTerm);
