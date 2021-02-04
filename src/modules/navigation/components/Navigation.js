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

  return (
    !isEmpty(routes) && (
      <ul className={`block h-full ${level === 2 ? "bg-green-600" : ""}`}>
        {Object.keys(routes).map((elem, index) => {
          const routeTitleKey =
            AppRouteTitles.navigation[`level${level}`].get(AppRoute[elem]) ||
            "";
          return (
            <li key={elem} className={`inline-block h-full`}>
              <NavLink
                to={localizeRouteKey(AppRoute[elem])}
                activeClassName="bg-green-700 hover:text-white border"
                className={`text-white px-4 ${level === 1 ? "p-6" : ""} ${
                  level === 1 ? "uppercase" : "py-2"
                }`}
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
