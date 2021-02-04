import React from "react";
import { AppLanguage } from "const";
import { NavLink, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";

export const LanguageSwitcher = ({ localesByLang }) => {
  const { pathname } = useLocation();
  const { locale, messages } = useIntl();
  const langMap = {
    Finnish: "fi",
    Swedish: "sv"
  };

  const selectedLangStyles = "border bg-white text-green-500";
  const commonLangStyles =
    "font-medium rounded-full text-sm hover:bg-white hover:text-green-500";

  return (
    <ul className="flex border-l ml-4 pl-4">
      {Object.keys(AppLanguage).map(lang => {
        return (
          <li key={lang} className="mr-2">
            <NavLink
              to={getMatchingRoute(AppLanguage[lang])}
              className={`${
                langMap[lang] === locale ? selectedLangStyles : "text-white"
              } ${commonLangStyles} uppercase flex justify-center items-center`}
              style={{
                width: "1.625rem",
                height: "1.625rem"
              }}
            >
              <span>{AppLanguage[lang]}</span>
            </NavLink>
          </li>
        );
      })}
    </ul>
  );

  function getMatchingRoute(language) {
    /**
     * Get the key of the route the user is currently on
     */
    const [, route] = pathname.split(locale);
    const routeKey = Object.keys(messages).find(key => messages[key] === route);
    // console.info(localesByLang[language], language, routeKey);
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
