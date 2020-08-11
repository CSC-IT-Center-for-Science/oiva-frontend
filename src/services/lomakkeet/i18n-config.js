import i18n from "i18n-for-browser";

export const setLocalizations = locales => {
  const response = await fetch(`${API_BASE_URL}/lokalisaatio`).catch(err => {
  i18n.configure({
    // store of translations
    locales,
    // sets a custom cookie name to read/write locale  - defaults to NULL
    cookieName: "lomakepalvelu"
  });
};

export function setLocale(locale) {
  i18n.setLocale(locale);
}

export default i18n;
