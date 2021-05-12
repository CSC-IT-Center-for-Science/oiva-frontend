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
      if (path === "*") {
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
  params?: Object
) {
  let localizedPath = "";
  switch (typeof path) {
    case "object":
      localizedPath = path.map(
        (key: string) => `/${locale}` + formatMessage({ id: key })
      );
      break;
    default:
      localizedPath =
        path === "*"
          ? path
          : `/${locale}` + formatMessage({ id: path }, params);
  }

  return localizedPath;
}
