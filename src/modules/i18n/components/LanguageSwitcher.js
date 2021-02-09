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

export const calculateRouteParts = (
  locale,
  language,
  key,
  pathnamePartsWithoutLocale,
  messages,
  localesByLang
) => {
  const routeParts = drop(1, split("/", messages[key]));

  const calculatedRouteParts = addIndex(map)((routePart, ii) => {
    let routePartInLocale = routePart;
    let keyOfRoutePartInLocale = undefined;
    let routePartInLocaleInGivenLanguage = undefined;
    const startsWithBracket = startsWith("{", routePart);
    if (startsWithBracket) {
      routePartInLocale = pathnamePartsWithoutLocale[ii];
      routePartInLocaleInGivenLanguage = routePartInLocale;
    }

    keyOfRoutePartInLocale = Object.keys(localesByLang[language]).find(
      key => localesByLang[locale][key] === routePartInLocale
    );

    if (keyOfRoutePartInLocale) {
      routePartInLocaleInGivenLanguage =
        localesByLang[language][keyOfRoutePartInLocale] ||
        routePartInLocaleInGivenLanguage;
    }

    return reject(isNil, {
      routePart,
      routePartInLocale,
      keyOfRoutePartInLocale,
      routePartInLocaleInGivenLanguage
    });
  }, routeParts);

  return calculatedRouteParts;
};

export function getMatchingRoute(
  locale,
  language,
  messages,
  pathname,
  localesByLang
) {
  /**
   * Get the key of the route the user is currently on
   */
  const pathnamePartsWithoutLocale = drop(2, split("/", pathname));

  const routeMessages = pickBy((val, key) => {
    return startsWith("routes", key);
  }, messages);

  const localizedRoute = head(
    map(key => {
      const calculatedRouteParts = calculateRouteParts(
        locale,
        language,
        key,
        pathnamePartsWithoutLocale,
        messages,
        localesByLang
      );

      if (
        equals(
          map(prop("routePartInLocale"), calculatedRouteParts),
          pathnamePartsWithoutLocale
        )
      ) {
        return `/${language}/${join(
          "/",
          map(prop("routePartInLocaleInGivenLanguage"), calculatedRouteParts)
        )}`;
      }
      return null;
    }, keys(routeMessages)).filter(Boolean)
  );

  return localizedRoute;
}

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
        return getMatchingRoute(
          locale,
          AppLanguage[lang],
          messages,
          pathname,
          localesByLang
        ) ? (
          <li key={lang} className="mr-2">
            <NavLink
              to={getMatchingRoute(
                locale,
                AppLanguage[lang],
                messages,
                pathname,
                localesByLang
              )}
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
};
