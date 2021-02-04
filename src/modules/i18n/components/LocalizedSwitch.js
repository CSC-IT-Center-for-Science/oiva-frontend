import React from "react";
import { Switch } from "react-router";
import { useIntl } from "react-intl";

const routeParams = {
  "routes.asianhallinta": "ammatillinen-koulutus"
};

/**
 *
 * @param path can be string, undefined or string array
 * @returns Localized string path or path array
 */
export function localizeRoutePath(path, locale, formatMessage) {
  let localizedPath = "";
  console.info(path);
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
        : `/${locale}` +
          formatMessage(
            { id: path },
            { koulutusmuoto: "ammatillinen-koulutus" }
          );
  }

  return localizedPath;
}

export const LocalizedSwitch = ({ children }) => {
  /**
   * inject params and formatMessage through hooks, so we can localize the route
   */
  const { formatMessage, locale } = useIntl();

  /**
   * Apply localization to all routes
   * Also checks if all children elements are <Route /> components
   */
  return (
    <Switch>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          const _path = localizeRoutePath(
            child.props.path,
            locale,
            formatMessage
          );
          // console.info(child, _path);
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
