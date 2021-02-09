import React from "react";
import { NavLink } from "react-router-dom";
import { AppRoute, AppRouteTitles } from "const/index";
import { useIntl } from "react-intl";
import { isEmpty, map, values } from "ramda";
import { getKoulutusmuodot } from "utils/common";

export const Navigation = ({ level }) => {
  const { formatMessage, locale } = useIntl();
  const koulutusmuodot = getKoulutusmuodot(formatMessage);

  const mainRoutes = {
    JarjestamisJaYllapitamisluvat: AppRoute.JarjestamisJaYllapitamisluvat,
    Tilastot: AppRoute.Tilastot
  };

  return (
    !isEmpty(mainRoutes) && (
      <ul className={`block h-full ${level === 2 ? "bg-green-600" : ""}`}>
        {// Päätason navigaatio
        level === 1 &&
          Object.keys(mainRoutes).map((elem, index) => {
            const routeTitleKey =
              AppRouteTitles.navigation.level1.get(AppRoute[elem]) || "";
            return (
              <li key={elem} className="inline-block h-full">
                <NavLink
                  to={localizeRouteKey(AppRoute[elem])}
                  activeClassName="bg-green-700 hover:text-white border"
                  className="text-white px-4 p-6 uppercase"
                >
                  {routeTitleKey
                    ? formatMessage({ id: routeTitleKey })
                    : AppRoute[elem]}
                </NavLink>
              </li>
            );
          })}
        {// Tässä muodostetaan toisen tason navigaatio eli linkit eri
        // koulutusmuotojen etusivuille.
        level === 2 &&
          map(koulutusmuoto => {
            const route = AppRoute.getKoulutusmuodonEtusivu(
              koulutusmuoto.kebabCase
            );

            const routeToKoulutusmuodonEtusivu = localizeRouteKey(route.key, {
              koulutusmuoto: koulutusmuoto.kebabCase
            });
            return (
              <li key={koulutusmuoto.kebabCase} className="inline-block h-full">
                <NavLink
                  to={routeToKoulutusmuodonEtusivu}
                  activeClassName="bg-green-700 hover:text-white border"
                  className="text-white px-4 py-2"
                >
                  {koulutusmuoto.paasivunOtsikko}
                </NavLink>
              </li>
            );
          }, values(koulutusmuodot))}
      </ul>
    )
  );

  function localizeRouteKey(path, params) {
    return `/${locale}` + formatMessage({ id: path }, params);
  }
};
