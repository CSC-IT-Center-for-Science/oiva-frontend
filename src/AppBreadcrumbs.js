import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Breadcrumbs, Link, Typography } from "@material-ui/core";
import { useIntl } from "react-intl";
import common from "./i18n/definitions/common";
import { take, join } from "ramda";

export default function AppBreadcrumbs() {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  let currentRoutes = [];

  currentRoutes = location.pathname !== "/" ? location.pathname.split("/") : [];
  if (currentRoutes.length > 0) {
    currentRoutes.shift();
    return (
      <Breadcrumbs aria-label={intl.formatMessage(common.breadCrumbs)}>
        <Link onClick={() => navigate("/")} className="cursor-pointer">
          {intl.formatMessage(common.frontpage)}
        </Link>
        {currentRoutes.length === 1 ? (
          <Typography color="textPrimary">
            {common[currentRoutes[0]]
              ? intl.formatMessage(common[currentRoutes[0]])
              : currentRoutes[0]}
          </Typography>
        ) : (
          currentRoutes.map((route, index) => {
            const fullRoute = "/" + join("/", take(index + 1, currentRoutes));
            const routeText = common[route]
              ? intl.formatMessage(common[route])
              : route;
            console.info(routeText, common);
            return index !== currentRoutes.length - 1 ? (
              <Link
                key={index}
                color="inherit"
                className="cursor-pointer"
                onClick={() => {
                  navigate(fullRoute);
                }}>
                {routeText}
              </Link>
            ) : (
              <Typography key={index} color="textPrimary">
                {routeText}
              </Typography>
            );
          })
        )}
      </Breadcrumbs>
    );
  }
  return null;
}
