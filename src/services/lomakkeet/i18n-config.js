import i18n from "i18n-for-browser";
import fiMessages from "./locales/fi.json";
import svMessages from "./locales/sv.json";
import { API_BASE_URL } from "modules/constants";
import { includes } from "ramda";

(async () => {
  const response = await fetch(`${API_BASE_URL}/lokalisaatio`).catch(err => {
    console.info(err);
  });

  if (response) {
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (includes("application/json", contentType)) {
        return await response.json();
      }
    }
  }
})().then(localizations => {
  i18n.configure({
    // store of translations
    locales: localizations || {
      fi: fiMessages,
      sv: svMessages
    },
    // sets a custom cookie name to read/write locale  - defaults to NULL
    cookieName: "lomakepalvelu"
  });
});

export function setLocale(locale) {
  i18n.setLocale(locale);
}

export default i18n;
