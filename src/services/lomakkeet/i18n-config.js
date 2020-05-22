import i18n from "i18n-for-browser";
import fiMessages from "./locales/fi.json";
import svMessages from "./locales/sv.json";

i18n.configure({
  // store of translations
  locales: {
    fi: fiMessages,
    sv: svMessages
  },
  // sets a custom cookie name to read/write locale  - defaults to NULL
  cookieName: "lomakepalvelu"
});

export function setLocale(locale) {
  i18n.setLocale(locale);
}

export default i18n;
