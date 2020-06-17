import _ from "lodash";

export function parseMuut(muu) {
  if (!muu) {
    return null;
  }

  return _.sortBy(muu, ["koodiArvo"]);
}

export function parseKoulutusalat(koulutusalat) {
  if (!koulutusalat) {
    return null;
  }

  return _.filter(koulutusalat, ala => {
    return ala.koodiArvo !== "00" && ala.koodiArvo !== "99";
  });
}
