import React from "react";
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import { AppBar, Toolbar, useMediaQuery } from "@material-ui/core";
import { includes } from "ramda";
import { localizeRouteKey } from "utils/common";
import { useIntl } from "react-intl";
import { AppRoute } from "const/index";
import common from "i18n/definitions/common";
import { Navigation } from "modules/navigation/index";
import { LanguageSwitcher } from "modules/i18n/index";

import logo_fi from "static/images/oiva-logo-fi-tekstilla.svg";
import logo_sv from "static/images/oiva-logo-sv-tekstilla.svg";

const MEDIA_QUERIES = {
  MOBILE: "only screen and (min-width: 360px) and (max-width: 767px)",
  TABLET: "only screen and (min-width: 768px) and (max-width: 1023px)",
  TABLET_MIN: "only screen and (min-width: 768px)",
  DESKTOP_NORMAL: "only screen and (min-width: 1024px) and (max-width: 1279px)",
  DESKTOP_LARGE: "only screen and (min-width: 1280px)"
};

const Header = ({ localesByLang, authenticationLink, organisationLink }) => {
  const { formatMessage, locale } = useIntl();
  const { pathname } = useLocation();

  const breakpointTabletMin = useMediaQuery(MEDIA_QUERIES.TABLET_MIN);

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
          <Toolbar className="bg-green-500 px-5 justify-between overflow-hidden">
            <NavLink
              to={localizeRouteKey(locale, AppRoute.Home, formatMessage)}
              className="flex items-center no-underline text-white hover:text-gray-100 pr-10"
            >
              <img
                alt={`${formatMessage(
                  common.opetusJaKulttuuriministerio
                )} logo`}
                src={locale === "sv" ? logo_sv : logo_fi}
                className="lg:w-fit-content max-w-sm"
              />
            </NavLink>
            <div id="navigation-level-1">
              <Navigation level={1} />
            </div>
            <div className="flex-1 flex justify-end items-center">
              {organisationLink.path && (
                <NavLink
                  className="link-to-own-organisation text-white border p-2 rounded-lg mr-5 hover:bg-white hover:text-green-500"
                  to={organisationLink.path}
                  exact={false}
                >
                  {formatMessage(common.omaSivu)}
                </NavLink>
              )}
              {!!authenticationLink && (
                <NavLink
                  to={authenticationLink.path}
                  exact={false}
                  className="inline-block no-underline text-white hover:underline hover:text-gray-100"
                >
                  <span className="font-normal">
                    {authenticationLink.text[0]}{" "}
                  </span>
                  {authenticationLink.text[1] && (
                    <span className="font-medium">
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
