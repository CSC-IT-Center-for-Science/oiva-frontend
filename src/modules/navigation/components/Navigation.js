import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AppRoute } from "const/index";
import { useIntl } from "react-intl";
import { isEmpty, length, map } from "ramda";
import { PropTypes } from "prop-types";
import { localizeRouteKey } from "utils/common";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import common from "i18n/definitions/common";

export const Navigation = ({ routes }) => {
  const { formatMessage, locale } = useIntl();
  const [visibleSubMenuRoute, setVisibleSubMenuRoute] = useState();
  const location = useLocation();

  return (
    !isEmpty(routes) && (
      // 1. tason navigaatio
      <nav aria-label={formatMessage(common.mainNavigation)}>
        <ul className={"flex"}>
          {routes.map(routeObj => {
            const routeKey = localizeRouteKey(
              locale,
              AppRoute[routeObj.key],
              formatMessage
            );

            return (
              <li
                key={routeObj.key}
                className="flex flex-col items-center hover:bg-green-600 hover:text-white hover:bg-opacity-50"
                onMouseEnter={() => setVisibleSubMenuRoute(routeObj.key)}
                onMouseLeave={() => setVisibleSubMenuRoute(null)}
              >
                <div
                  className={`flex flex-col justify-center text-white px-2 h-20 uppercase font-medium hover:text-white ${location.pathname.indexOf(
                    routeKey
                  ) !== -1 && "bg-green-700"}`}
                  style={{
                    fontSize: "0.9375rem"
                  }}
                >
                  <div className="flex flex-row justify-center hover:text-white h-full">
                    <NavLink
                      to={routeKey}
                      activeClassName={"bg-green-700 bg-opacity-75"}
                      className="flex flex-col justify-center text-white hover:text-white px-3"
                    >
                      <span>
                        {routeObj.titleKey
                          ? formatMessage({ id: routeObj.titleKey })
                          : routeObj.title}
                      </span>
                    </NavLink>
                    {length(routeObj.routes) ? (
                      <button
                        onClick={() => {
                          setVisibleSubMenuRoute(
                            visibleSubMenuRoute === null ? routeObj.key : null
                          );
                        }}
                        className="flex flex-col justify-center text-white"
                      >
                        {visibleSubMenuRoute === routeObj.key ? (
                          <ExpandLessIcon className="align-bottom" />
                        ) : (
                          <ExpandMoreIcon className="align-bottom" />
                        )}
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* 2. tason navigaatio */}
                {!isEmpty(routeObj.routes) &&
                  visibleSubMenuRoute === routeObj.key && (
                    <ul
                      className={"flex left-0 w-full fixed bg-green-600 h12"}
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
                              aria-current="page"
                              className="flex flex-col justify-center text-white px-5 h-20 font-medium hover:text-white hover:bg-green-600 hover:bg-opacity-50"
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
      </nav>
    )
  );
};

Navigation.propTypes = {
  routes: PropTypes.array
};
