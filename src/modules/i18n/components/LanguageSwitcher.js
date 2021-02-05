import React from "react";
import { AppLanguage } from "const";
import { NavLink, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import {
  addIndex,
  drop,
  equals,
  head,
  isNil,
  join,
  keys,
  map,
  pickBy,
  prop,
  reject,
  split,
  startsWith
} from "ramda";

export const LanguageSwitcher = ({ localesByLang }) => {
  const { pathname } = useLocation();
  const { locale, messages } = useIntl();
  const langMap = {
    Finnish: "fi",
    Swedish: "sv"
  };

  const pathnamePartsWithoutLocale = drop(2, split("/", pathname));

  const routeMessages = pickBy((val, key) => {
    return startsWith("routes", key);
  }, messages);

  const selectedLangStyles = "border bg-white text-green-500";
  const commonLangStyles =
    "font-medium rounded-full text-sm hover:bg-white hover:text-green-500";

  return (
    <ul className="flex border-l ml-4 pl-4">
      {Object.keys(AppLanguage).map(lang => {
        return getMatchingRoute(AppLanguage[lang]) ? (
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
        ) : null;
      })}
    </ul>
  );

  function getMatchingRoute(language) {
    /**
     * Get the key of the route the user is currently on
     */
    const localizedRoute = head(
      map(key => {
        const routeParts = drop(1, split("/", routeMessages[key]));

        const calculatedRouteParts = addIndex(map)((routePart, ii) => {
          let routePartInLocale = routePart;
          let keyOfRoutePartInLocale = undefined;
          let routePartInLocaleInGivenLanguage = undefined;
          if (startsWith("{", routePart)) {
            routePartInLocale = pathnamePartsWithoutLocale[ii];
          }

          keyOfRoutePartInLocale = Object.keys(localesByLang[language]).find(
            key => localesByLang[locale][key] === routePartInLocale
          );
          if (keyOfRoutePartInLocale) {
            routePartInLocaleInGivenLanguage =
              localesByLang[language][keyOfRoutePartInLocale];
          }

          return reject(isNil, {
            routePart,
            routePartInLocale,
            keyOfRoutePartInLocale,
            routePartInLocaleInGivenLanguage
          });
        }, routeParts);

        if (
          equals(
            map(prop("routePartInLocale"), calculatedRouteParts),
            pathnamePartsWithoutLocale
          )
        ) {
          // console.info(key, language, localesByLang[language][key]);
          // console.info(
          //   pathnamePartsWithoutLocale,
          //   routeParts,
          //   calculatedRouteParts
          // );
          return `/${language}/${join(
            "/",
            map(prop("routePartInLocaleInGivenLanguage"), calculatedRouteParts)
          )}`;
        }
      }, keys(routeMessages)).filter(Boolean)
    );

    return localizedRoute;
  }
};
