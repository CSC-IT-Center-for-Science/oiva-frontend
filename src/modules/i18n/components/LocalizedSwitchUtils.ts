import { replace } from "ramda";

export function getLocalizedPath(
  path: any,
  locale: string,
  formatMessage: Function
) {
  let localizedPath = "";
  switch (typeof path) {
    case "object":
      localizedPath = path.map(
        (key: string) => `/${locale}` + formatMessage({ id: key })
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
export function localizeRoutePath(
  path: any,
  locale: string,
  formatMessage: Function,
  params?: object
) {
  let localizedPath = "";
  switch (typeof path) {
    case "object":
      localizedPath = path.map(
        (key: string) => `/${locale}` + formatMessage({ id: key })
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
