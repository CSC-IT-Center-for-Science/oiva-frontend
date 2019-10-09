import * as R from "ramda";

export const getAnchorPart = (anchor, index) => {
  return R.compose(
    R.view(R.lensIndex(index)),
    R.split(".")
  )(anchor);
};

export const removeAnchorPart = (anchor, index) => {
  return R.compose(
    R.join("."),
    R.remove(index, 1),
    R.split(".")
  )(anchor);
};

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
  })(objects);
});

export const getAnchorsStartingWith = (prefix, objects) => {
  return R.filter(
    R.compose(
      R.startsWith(prefix),
      R.head,
      R.split("."),
      R.prop("anchor")
    )
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
