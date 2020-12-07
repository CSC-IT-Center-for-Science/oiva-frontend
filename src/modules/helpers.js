/**
 * Helper functions
 */

import _ from "lodash";
import { find, path, includes, any } from "ramda";

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

/**
 * Resolve name of the organizer from lupa based on given locale. If it doesn't exist,
 * resolve into other locale. We assume that only 'fi' and 'sv' locales exist.
 * @param organization
 * @param primaryLocale
 * @return {any}
 */
export const resolveLocalizedOrganizationName = (
  organization,
  primaryLocale
) => {
  const altLocale = primaryLocale === "fi" ? "sv" : "fi";
  let retval = path(["nimi", primaryLocale])(organization);
  if (!retval) {
    retval = path(["nimi", altLocale])(organization);
  }
  return retval;
};

/**
 * Resolve name of the VST oppilaitos from an oppilaitosmääräys in lupa.
 * @param lupa
 * @param locale
 * @return {string|*}
 */
export const resolveVSTOppilaitosNameFromLupa = (lupa, locale) => {
  const maarays = lupa.maaraykset.find(item => (item.koodisto = "oppilaitos"));
  if (maarays) {
    const fakelupa = {
      jarjestaja: { nimi: path(["organisaatio", "nimi"])(maarays) }
    };
    return resolveLocalizedOrganizerName(fakelupa, locale);
  } else return "";
};

/**
 * Resolve name of the organizer from lupa based on given locale. If it doesn't exist,
 * resolve into other locale. We assume that only 'fi' and 'sv' locales exist.
 * @param lupa
 * @param primaryLocale
 * @return {any}
 */
export const resolveLocalizedOrganizerName = (lupa, primaryLocale) => {
  const altLocale = primaryLocale === "fi" ? "sv" : "fi";
  let retval = path(["jarjestaja", "nimi", primaryLocale])(lupa);
  if (!retval) {
    retval = path(["jarjestaja", "nimi", altLocale])(lupa);
  }
  return retval;
};

/**
 * Given a koodisto koodi metadata array, return the localized message contained in given primaryLocale, or
 * alternative locale when locales are assumed to be either 'fi' or 'sv'.
 * @param messageObjects
 * @param primaryLocale
 * @return {*}
 */
export const resolveKoodiLocalization = (messageObjects, locale = "FI") => {
  const primaryLocale = locale.toUpperCase();
  const altLocale = primaryLocale === "FI" ? "SV" : "FI";
  const primaryObject = find(
    item => item.kieli === primaryLocale,
    messageObjects
  );
  const altObject = find(item => item.kieli === altLocale, messageObjects);
  return primaryObject
    ? primaryObject.nimi
    : altObject
    ? altObject.nimi
    : undefined;
};

export const userHasAnyOfRoles = (user, roles) => {
  return user && any(role => includes(role, user.roles), roles);
}
