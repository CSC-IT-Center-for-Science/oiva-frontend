import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { AppRoute } from "const/index";
import { useIntl } from "react-intl";
import { isEmpty, length } from "ramda";
import { PropTypes } from "prop-types";
import { localizeRouteKey } from "utils/common";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

export const Navigation = ({ level, routes }) => {
  const { formatMessage, locale } = useIntl();
  const [visibleSubMenuRoute, setVisibleSubMenuRoute] = useState();

  return (
    !isEmpty(routes) && (
      <ul
        className={`flex ${
          level === 2 ? "left-0 w-full fixed bg-green-600" : ""
        }`}
        style={
          level === 2
            ? {
                top: "4.5rem"
              }
            : {}
        }
      >
        {routes.map(routeObj => {
          return (
            <li
              key={routeObj.key}
              className="flex flex-col h-full"
              onMouseEnter={() => setVisibleSubMenuRoute(routeObj.key)}
              onMouseLeave={() => setVisibleSubMenuRoute(null)}
            >
              <NavLink
                to={localizeRouteKey(
                  locale,
                  AppRoute[routeObj.key],
                  formatMessage
                )}
                activeClassName="bg-green-700 bg-opacity-75"
                className="text-white px-5 p-6 uppercase font-medium hover:text-white hover:bg-green-600"
                style={{ fontSize: "0.9375rem" }}
              >
                <span>
                  {routeObj.titleKey
                    ? formatMessage({ id: routeObj.titleKey })
                    : routeObj.title}
                </span>
                {length(routeObj.routes) ? (
                  visibleSubMenuRoute === routeObj.key ? (
                    <ExpandMoreIcon className="ml-2 align-bottom" />
                  ) : (
                    <ExpandLessIcon className="ml-2 align-bottom" />
                  )
                ) : null}
              </NavLink>

              {routeObj.routes && visibleSubMenuRoute === routeObj.key && (
                <Navigation level={2} routes={routeObj.routes} />
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
