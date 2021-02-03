import React from "react";
import { AppLanguage } from "const";
import { NavLink, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";

export const LanguageSwitcher = ({ localesByLang }) => {
  const { pathname } = useLocation();
  const { locale, messages } = useIntl();

  return (
    <ul>
      {Object.keys(AppLanguage).map(lang => (
        <li key={lang}>
          <NavLink to={getMatchingRoute(AppLanguage[lang])}>
            {AppLanguage[lang]}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  function getMatchingRoute(language) {
    console.info(language, "locale:", locale);
    /**
     * Get the key of the route the user is currently on
     */
    const [, route] = pathname.split(locale);
    const routeKey = Object.keys(messages).find(key => messages[key] === route);
    console.info(localesByLang[language], language, routeKey);
    /**
     * Find the matching route for the new language
     */
    const matchingRoute = localesByLang[language][routeKey];

    /**
     * Return localized route
     */
    return `/${language}` + matchingRoute;
  }
};
