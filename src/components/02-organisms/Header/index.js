import React, { useState } from "react";
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
import MenuIcon from "@material-ui/icons/Menu";

import logo_fi from "static/images/oiva-logo-fi-tekstilla.svg";
import logo_sv from "static/images/oiva-logo-sv-tekstilla.svg";
import oiva_logo from "static/images/oiva-logo.svg";
import MobileMenu from "./MobileMenu";
import SideNavigation from "../SideNavigation";
import AuthenticationLink from "./AuthenticationLink";
import OrganisationLink from "./OrganisationLink";

export const MEDIA_QUERIES = {
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

  const breakpointDesktopLarge = useMediaQuery(MEDIA_QUERIES.DESKTOP_LARGE);

  const mediumSizedScreen = breakpointTabletMin && !breakpointDesktopLarge;

  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);

  const is2ndNavVisible = includes(
    localizeRouteKey(
      locale,
      AppRoute.JarjestamisJaYllapitamisluvat,
      formatMessage
    ),
    pathname
  );

  const toggleMobileMenu = () => setIsMobileMenuVisible(!isMobileMenuVisible);

  return (
    <React.Fragment>
      {breakpointDesktopLarge && (
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
                <OrganisationLink
                  organisationLink={organisationLink}
                  formatMessage={formatMessage}
                  navLinkClasses="mr-5"
                />
              )}
              {!!authenticationLink && (
                <AuthenticationLink authenticationLink={authenticationLink} />
              )}
              <LanguageSwitcher
                localesByLang={localesByLang}
                ulClasses="border-l border-opacity-25"
              />
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

      {!breakpointDesktopLarge && (
        <React.Fragment>
          <SideNavigation isVisible={isMobileMenuVisible}>
            <MobileMenu
              localesByLang={localesByLang}
              onCloseMenu={toggleMobileMenu}
              organisationLink={organisationLink}
              authenticationLink={authenticationLink}
            />
          </SideNavigation>
          <AppBar className="bg-green-500" elevation={0} position="static">
            <Toolbar className="px-5 justify-start overflow-hidden">
              <MenuIcon
                className="mr-6 cursor-pointer"
                onClick={toggleMobileMenu}
              />
              <NavLink
                to={localizeRouteKey(locale, AppRoute.Home, formatMessage)}
                className="flex items-center no-underline text-white hover:text-gray-100 mr-16"
              >
                {mediumSizedScreen ? (
                  <img
                    alt={`${formatMessage(
                      common.opetusJaKulttuuriministerio
                    )} logo`}
                    src={locale === "sv" ? logo_sv : logo_fi}
                    className="lg:w-fit-content max-w-sm"
                  />
                ) : (
                  <img
                    alt={`${formatMessage(
                      common.opetusJaKulttuuriministerio
                    )} logo`}
                    src={oiva_logo}
                    className="max-w-sm"
                  />
                )}
              </NavLink>

              <div className="flex-1 flex justify-end items-center">
                {mediumSizedScreen && organisationLink.path && (
                  <OrganisationLink
                    organisationLink={organisationLink}
                    formatMessage={formatMessage}
                    navLinkClasses="mr-5"
                  />
                )}
                {!!authenticationLink && (
                  <AuthenticationLink
                    authenticationLink={authenticationLink}
                    navLinkClasses="leading-snug"
                  />
                )}
                {mediumSizedScreen ? (
                  <LanguageSwitcher
                    localesByLang={localesByLang}
                    ulClasses="border-l border-opacity-25"
                  />
                ) : (
                  ""
                )}
              </div>
            </Toolbar>
          </AppBar>
        </React.Fragment>
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
