import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AppRoute } from "const/index";
import { useIntl } from "react-intl";
import { includes, isEmpty, length, map } from "ramda";
import { PropTypes } from "prop-types";
import { localizeRouteKey } from "utils/common";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { __ } from "i18n-for-browser";

export const Navigation = ({ routes }) => {
  const { formatMessage, locale } = useIntl();
  const [visibleSubMenuRoute, setVisibleSubMenuRoute] = useState();
  const location = useLocation();

  return (
    !isEmpty(routes) && (
      // 1. tason navigaatio
      <ul className={"flex"}>
        {routes.map(routeObj => {
          return (
            <li
              key={routeObj.key}
              className="flex flex-col items-center hover:bg-green-600"
              onClick={() => setVisibleSubMenuRoute(routeObj.key)}
              onMouseEnter={() => setVisibleSubMenuRoute(routeObj.key)}
              onMouseLeave={() => setVisibleSubMenuRoute(null)}
            >
              <NavLink
                to={localizeRouteKey(
                  locale,
                  AppRoute[routeObj.key],
                  formatMessage
                )}
                activeClassName={"bg-green-700 bg-opacity-75"}
                className="flex flex-col justify-center text-white px-5 h-20 uppercase font-medium hover:text-white hover:bg-green-600 hover:bg-opacity-50"
                style={{ fontSize: "0.9375rem" }}
              >
                <div>
                  <span>
                    {routeObj.titleKey
                      ? formatMessage({ id: routeObj.titleKey })
                      : routeObj.title}
                  </span>
                  {length(routeObj.routes) ? (
                    includes(__(routeObj.route), location.pathname) &&
                    visibleSubMenuRoute === routeObj.key ? (
                      <ExpandMoreIcon className="ml-2 align-bottom" />
                    ) : (
                      <ExpandLessIcon className="ml-2 align-bottom" />
                    )
                  ) : null}
                </div>
              </NavLink>

              {/* 2. tason navigaatio */}
              {!isEmpty(routeObj.routes) &&
                visibleSubMenuRoute === routeObj.key &&
                includes(__(routeObj.route), location.pathname) && (
                  <ul
                    className={"flex left-0 w-full fixed bg-green-600"}
                    style={{ top: "4.5rem" }}
                  >
                    {map(routeObj => {
                      return (
                        <li
                          key={routeObj.key}
                          className="flex flex-col items-center hover:bg-green-700 hover:bg-opacity-75"
                          onClick={e => {
                            e.stopPropagation();
                            setVisibleSubMenuRoute(null);
                          }}
                        >
                          <NavLink
                            to={localizeRouteKey(
                              locale,
                              AppRoute[routeObj.key],
                              formatMessage
                            )}
                            activeClassName={"bg-green-700"}
                            className="flex flex-col justify-center text-white px-5 h-20 uppercase font-medium hover:text-white hover:bg-green-600 hover:bg-opacity-50"
                            style={{ fontSize: "0.9375rem" }}
                          >
                            <span>
                              {routeObj.titleKey
                                ? formatMessage({ id: routeObj.titleKey })
                                : routeObj.title}
                            </span>
                          </NavLink>
                        </li>
                      );
                    }, routeObj.routes || [])}
                  </ul>
                )}
            </li>
          );
        })}
      </ul>
    )
  );
};

Navigation.propTypes = {
  routes: PropTypes.array
};
