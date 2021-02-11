import React from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { includes } from "ramda";
import { localizeRouteKey } from "utils/common";
import { useIntl } from "react-intl";
import { AppRoute, AppRouteTitles } from "const/index";
import common from "i18n/definitions/common";
import { Navigation } from "modules/navigation/index";
import { LanguageSwitcher } from "modules/i18n/index";

const MEDIA_QUERIES = {
  MOBILE: "only screen and (min-width: 360px) and (max-width: 767px)",
  TABLET: "only screen and (min-width: 768px) and (max-width: 1023px)",
  TABLET_MIN: "only screen and (min-width: 768px)",
  DESKTOP_NORMAL: "only screen and (min-width: 1024px) and (max-width: 1279px)",
  DESKTOP_LARGE: "only screen and (min-width: 1280px)"
};

const useStylesForTypography = makeStyles(() => ({
  root: {
    fontFamily: "serif",
    lineHeight: 1,
    textTransform: "uppercase"
  }
}));

const Header = ({ localesByLang, authenticationLink, organisationLink }) => {
  const { formatMessage, locale } = useIntl();
  const { pathname } = useLocation();

  const typographyClasses = useStylesForTypography();

  const breakpointTabletMin = useMediaQuery(MEDIA_QUERIES.TABLET_MIN);

  const homeRouteKey = AppRouteTitles.home.get(AppRoute.Home) || "";

  const is2ndNavVisible = includes(
    localizeRouteKey(
      locale,
      AppRoute.JarjestamisJaYllapitamisluvat,
      formatMessage
    ),
    pathname
  );

  return (
    <React.Fragment>
      {breakpointTabletMin && (
        <AppBar elevation={0} position="static">
          <Toolbar className="bg-green-500 px-4 justify-between overflow-hidden">
            <NavLink
              to={localizeRouteKey(locale, AppRoute.Home, formatMessage)}
              className="flex items-center no-underline text-white hover:text-gray-100 pr-4"
            >
              <Typography variant="h1" classes={typographyClasses}>
                {homeRouteKey
                  ? formatMessage({
                      id: AppRouteTitles.home.get(AppRoute.Home) || ""
                    })
                  : "KÄÄNNÖS PUUTTUU"}
              </Typography>
              <span
                className="ml-4 text-sm leading-tight"
                style={{ width: "11rem" }}
              >
                {formatMessage(common.siteShortDescription)}
              </span>
            </NavLink>
            <div id="navigation-level-1">
              <Navigation level={1} />
            </div>
            <div className="flex-1 flex justify-end items-center">
              {organisationLink.path && (
                <NavLink
                  className="link-to-own-organisation text-white border p-2 rounded-lg mr-4"
                  to={organisationLink.path}
                  exact={false}
                >
                  <span className="text-white">
                    {formatMessage(common.omaSivu)}
                  </span>
                </NavLink>
              )}
              {!!authenticationLink && (
                <NavLink
                  to={authenticationLink.path}
                  exact={false}
                  className="inline-block no-underline text-white hover:underline hover:text-gray-100"
                >
                  <span>{authenticationLink.text[0]} </span>
                  {authenticationLink.text[1] && (
                    <span className="font-bold">
                      {authenticationLink.text[1]}
                    </span>
                  )}
                </NavLink>
              )}
              <LanguageSwitcher localesByLang={localesByLang} />
            </div>
          </Toolbar>
          {is2ndNavVisible && (
            <AppBar elevation={0} position="static">
              <Toolbar className="bg-green-600" style={{ minHeight: "3rem" }}>
                <Navigation level={2} />
              </Toolbar>
            </AppBar>
          )}
        </AppBar>
      )}
    </React.Fragment>
  );
};

Header.propTypes = {
  inFinnish: PropTypes.string,
  inSwedish: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  locale: PropTypes.string,
  logIn: PropTypes.string,
  logo: PropTypes.object,
  authenticationLink: PropTypes.object,
  onLoginButtonClick: PropTypes.func,
  onMenuClick: PropTypes.func,
  organisationLink: PropTypes.object,
  shortDescription: PropTypes.object,
  template: PropTypes.string,
  languageSelectionAriaLabel: PropTypes.string
};

export default Header;
