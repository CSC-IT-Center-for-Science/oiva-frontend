/**
 * Helper functions
 */

import * as R from "ramda";

/**
 * Resolve name of the organizer from lupa based on given locale. If it doesn't exist,
 * resolve into other locale. We assume that only 'fi' and 'sv' locales exist.
 * @param lupa
 * @param primaryLocale
 * @return {any}
 */
export const resolveLocalizedOrganizerName = (lupa, primaryLocale) => {
  const altLocale = primaryLocale === 'fi' ? 'sv' : 'fi';
  let retval = R.path(["jarjestaja", "nimi", primaryLocale])(lupa);
  if(!retval) {
    retval = R.path(["jarjestaja", "nimi", altLocale])(lupa);
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
  const maarays = lupa.maaraykset.find(item => item.koodisto = "oppilaitos");
  if(maarays) {
    const fakelupa = { jarjestaja: { nimi: R.path(["organisaatio", "nimi"])(maarays)}};
    return resolveLocalizedOrganizerName(fakelupa, locale);
  }
  else return "";
}

/**
 * Given a koodisto koodi metadata array, return the localized message contained in given primaryLocale, or
 * alternative locale when locales are assumed to be either 'fi' or 'sv'.
 * @param messageObjects
 * @param primaryLocale
 * @return {*}
 */
export const resolveKoodiLocalization = (
  messageObjects,
  locale = "FI",

) => {
  const primaryLocale = locale.toUpperCase();
  const altLocale = primaryLocale === "FI" ? "SV" : "FI";
  const primaryObject = R.find(item => item.kieli === primaryLocale, messageObjects);
  const altObject = R.find(item => item.kieli === altLocale, messageObjects);
  return primaryObject ? primaryObject.nimi : altObject ? altObject.nimi : undefined;
};
