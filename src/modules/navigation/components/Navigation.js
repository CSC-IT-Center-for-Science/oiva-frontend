import React from "react";
import { NavLink } from "react-router-dom";
import { AppRoute, AppRouteTitles } from "const/index";
import { useIntl } from "react-intl";
import { isEmpty, map, values } from "ramda";
import { getKoulutusmuodot } from "utils/common";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export const Navigation = ({ level }) => {
  const { formatMessage, locale } = useIntl();
  const koulutusmuodot = getKoulutusmuodot(formatMessage);

  const mainRoutes = {
    JarjestamisJaYllapitamisluvat: {
      route: AppRoute.JarjestamisJaYllapitamisluvat,
      isExpandable: true
    },
    Tilastot: {
      route: AppRoute.Tilastot
    }
  };

  return (
    !isEmpty(mainRoutes) && (
      <ul className={`block h-full ${level === 2 ? "bg-green-600" : ""}`}>
        {// Päätason navigaatio
        level === 1 &&
          Object.keys(mainRoutes).map((key, index) => {
            const routeTitleKey =
              AppRouteTitles.navigation.level1.get(AppRoute[key]) || "";

            // const Icon = mainRoutes[key].isExpandable ? <ExpandMoreIcon />

            return (
              <li key={key} className="inline-block h-full">
                <NavLink
                  to={localizeRouteKey(AppRoute[key])}
                  activeClassName="bg-green-600"
                  className="text-white px-5 p-6 uppercase font-medium hover:text-white hover:bg-green-600"
                  style={{ fontSize: "0.9375rem" }}
                >
                  <span>
                    {routeTitleKey
                      ? formatMessage({ id: routeTitleKey })
                      : AppRoute[key]}
                  </span>
                  {mainRoutes[key].isExpandable && (
                    <ExpandMoreIcon className="ml-2 align-bottom" />
                  )}
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
                  activeClassName="bg-green-700 hover:text-white"
                  className="text-white px-4 py-3 font-medium"
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
