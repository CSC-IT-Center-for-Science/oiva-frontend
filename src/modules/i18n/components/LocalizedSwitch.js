import React from "react";
import { Switch } from "react-router";
import { useIntl } from "react-intl";

/**
 *
 * @param path can be string, undefined or string array
 * @returns Localized string path or path array
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
            formatMessage,
            child.props.params
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
