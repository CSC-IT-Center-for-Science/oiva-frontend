import {
  assoc,
  compose,
  concat,
  flatten,
  groupBy,
  isEmpty,
  length,
  map,
  path,
  propOr,
  omit,
  filter
} from "ramda";

export const initializeRajoitteet = (maaraykset = []) => {
  /** Groupataan alimääräykset rajoiteId:n mukaan ja asetetaan grouppauksen tulos aliMaaraykset propertyyn */
  let rajoitemaaraykset = map(maarays => {
    const alimaarayksetGrouped = omit(
      [undefined],
      groupBy(
        path(["meta", "rajoiteId"]),
        flatten(compose(propOr([], "aliMaaraykset"))(maarays))
      )
    );
    return !isEmpty(alimaarayksetGrouped)
      ? assoc("aliMaaraykset", alimaarayksetGrouped, maarays)
      : null;
  }, maaraykset).filter(Boolean);

  /** Lisätään vielä opiskelijamäärämääräykset, joilla ei ole alimääräyksiä */
  const opiskelijamaaramaaraykset = filter(
    maarays =>
      !length(maarays.aliMaaraykset) &&
      maarays.koodisto === "kujalisamaareet" &&
      path(["maaraystyyppi", "tunniste"], maarays) === "RAJOITE",
    maaraykset || []
  );

  /** Opiskelijamäärämääräys, jolla ei alimääräyksiä samaan muotoon kuin muut rajoitemääräykset */
  const opiskelijamaaramaarayksetModified = map(maarays => {
    return {
      ...maarays,
      aliMaaraykset: { [path(["meta", "rajoiteId"], maarays)]: [maarays] }
    };
  }, opiskelijamaaramaaraykset);

  return length(opiskelijamaaramaaraykset)
    ? concat(rajoitemaaraykset, opiskelijamaaramaarayksetModified)
    : rajoitemaaraykset;
};
