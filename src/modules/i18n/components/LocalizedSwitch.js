import React from "react";
import { Switch } from "react-router";
import { useIntl } from "react-intl";
import { replace } from "ramda";

function getLocalizedPath(path, locale, formatMessage) {
  let localizedPath = "";
  switch (typeof path) {
    case "undefined":
      localizedPath = undefined;
      break;
    case "object":
      localizedPath = path.map(
        key => `/${locale}` + formatMessage({ id: key })
      );
      break;
    default:
      const isFallbackRoute = path === "*";
      if (isFallbackRoute) {
        localizedPath = path;
      } else {
        localizedPath = `/${locale}${replace(
          /}/g,
          "",
          replace(/{/g, ":", path)
        )}`;
      }
  }

  return localizedPath;
}

/**
 *
 * @param path
 * @returns Lokalisoitu merkkijono tai taulukko
 */
export function localizeRoutePath(path, locale, formatMessage, params) {
  let localizedPath = "";
  switch (typeof path) {
    case "undefined":
      localizedPath = undefined;
      break;
    case "object":
      localizedPath = path.map(
        key => `/${locale}` + formatMessage({ id: key })
      );
      break;
    default:
      const isFallbackRoute = path === "*";
      localizedPath = isFallbackRoute
        ? path
        : `/${locale}` + formatMessage({ id: path }, params);
  }

  return localizedPath;
}

export const LocalizedSwitch = ({ children }) => {
  const { formatMessage, locale, messages } = useIntl();

  /**
   * Lokalisoidaan kaikki reitit tarkastaen samalla, ovatko kaikki
   * lapsielementit <Route /> -komponentteja, koska vain niiden
   * osalta lokalisointi on olennaista.
   */
  return (
    <Switch>
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && messages[child.props.path]) {
          const _path = getLocalizedPath(
            messages[child.props.path],
            locale,
            formatMessage
          );
          return React.cloneElement(child, {
            ...child.props,
            path: _path
          });
        } else {
          return child;
        }
      })}
    </Switch>
  );
};
