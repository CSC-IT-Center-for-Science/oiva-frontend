import React from "react";
import { NavLink } from "react-router-dom";
import { AppRoute, AppRouteTitles } from "const/index";
import { useIntl } from "react-intl";
import { isEmpty } from "ramda";

export const Navigation = ({ level }) => {
  const { formatMessage, locale } = useIntl();

  const routes =
    level === 1
      ? {
          JarjestamisJaYllapitamisluvat: AppRoute.JarjestamisJaYllapitamisluvat,
          Tilastot: AppRoute.Tilastot
        }
      : {
          EsiJaPerusopetus: AppRoute.EsiJaPerusopetus,
          Lukiokoulutus: AppRoute.Lukiokoulutus,
          AmmatillinenKoulutus: AppRoute.AmmatillinenKoulutus,
          VapaaSivistystyo: AppRoute.VapaaSivistystyo
        };

  console.info(level, routes);

  return (
    !isEmpty(routes) && (
      <ul className={`block h-full ${level === 2 ? "bg-green-600" : ""}`}>
        {Object.keys(routes).map((elem, index) => {
          const routeTitleKey =
            AppRouteTitles.navigation[`level${level}`].get(AppRoute[elem]) ||
            "";
          return (
            <li
              key={elem}
              className={`inline-block h-full ${
                level === 1 ? "p-5" : index !== 0 ? "pl-4" : ""
              } pr-4`}
            >
              <NavLink
                exact
                to={localizeRouteKey(AppRoute[elem])}
                className={`text-white ${level === 1 ? "uppercase" : ""}`}
              >
                {routeTitleKey
                  ? formatMessage({ id: routeTitleKey })
                  : AppRoute[elem]}
              </NavLink>
            </li>
          );
        })}
      </ul>
    )
  );

  function localizeRouteKey(path) {
    return `/${locale}` + formatMessage({ id: path });
  }
};
