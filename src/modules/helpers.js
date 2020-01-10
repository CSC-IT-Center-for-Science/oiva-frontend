/**
 * Helper functions
 */

import _ from "lodash";

export const parseLocalizedField = (
  obj,
  locale = "FI",
  key = "nimi",
  localeKey = "kieli"
) => {
  const targetObj = _.find(obj, o => {
    if (o[localeKey] === locale) {
      return o[key];
    }
  });

  if (targetObj) {
    return _.find(obj, o => {
      if (o[localeKey] === locale) {
        return o[key];
      }
    })[key];
  } else {
    return undefined;
  }
};

export const slugify = str => {
  if (str) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    const to = "aaaaeeeeiiiioooouuuunc------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes
  }

  return str;
};

export const parsePostalCode = str => {
  if (str) {
    return str.slice(-5);
  } else {
    return "";
  }
};
