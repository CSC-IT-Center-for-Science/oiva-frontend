import React from "react";
import PropTypes from "prop-types";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import css from "./header.module.css";
import { NavLink, useLocation } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import HorizontalLayout from "./HorizontalLayout";
import VerticalLayout from "./VerticalLayout";
import { equals } from "ramda";
import { getMatchingRoute, localizeRouteKey } from "utils/common";
import { useIntl } from "react-intl";
import { AppLanguage } from "const";
import { AppRoute, AppRouteTitles } from "const/index";
import common from "i18n/definitions/common";
import { Navigation } from "modules/navigation/index";

const MEDIA_QUERIES = {
  MOBILE: "only screen and (min-width: 360px) and (max-width: 767px)",
  TABLET: "only screen and (min-width: 768px) and (max-width: 1023px)",
  TABLET_MIN: "only screen and (min-width: 768px)",
  DESKTOP_NORMAL: "only screen and (min-width: 1024px) and (max-width: 1279px)",
  DESKTOP_LARGE: "only screen and (min-width: 1280px)"
};

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

const useStylesForTypography = makeStyles(() => ({
  root: {
    lineHeight: 1
  }
}));

const Header = ({
  inFinnish,
  inSwedish,
  isAuthenticated,
  localesByLang,
  logIn,
  logo,
  authenticationLink,
  onLoginButtonClick,
  onMenuClick,
  organisationLink,
  shortDescription,
  template = "A",
  languageSelectionAriaLabel = "Kielivalinta"
}) => {
  const { formatMessage, locale, messages } = useIntl();
  const { pathname } = useLocation();
  const selectedLangStyles = "border bg-white text-green-500 mr-1";
  const commonLangStyles =
    "leading-none font-medium rounded-full text-sm hover:bg-white hover:text-green-500";
  const classes = useStyles();
  const typographyClasses = useStylesForTypography();
  // const items = [
  //   <NavLink
  //     to={localizeRouteKey(locale, logo.path, formatMessage)}
  //     className="inline-block no-underline text-white hover:text-gray-100"
  //   >
  //     <Typography variant="h6" classes={typographyClasses}>
  //       {logo.text}
  //     </Typography>
  //     {shortDescription.text}
  //   </NavLink>,
  //   !!authenticationLink ? (
  //     <NavLink
  //       to={authenticationLink.path}
  //       exact={false}
  //       className="inline-block no-underline text-white hover:underline hover:text-gray-100"
  //     >
  //       <span>{authenticationLink.text[0]} </span>
  //       {authenticationLink.text[1] && (
  //         <span className="font-bold">{authenticationLink.text[1]}</span>
  //       )}
  //     </NavLink>
  //   ) : (
  //     <React.Fragment />
  //   ),
  //   organisationLink.path ? (
  //     <NavLink
  //       className="link-to-own-organisation text-white"
  //       to={organisationLink.path}
  //       exact={false}
  //     >
  //       <span className="text-white">{organisationLink.text}</span>
  //     </NavLink>
  //   ) : (
  //     <span className="text-white">{organisationLink.text}</span>
  //   )
  // ];

  const breakpointTabletMin = useMediaQuery(MEDIA_QUERIES.TABLET_MIN);

  const homeRouteKey = AppRouteTitles.home.get(AppRoute.Home) || "";

  console.info(AppRoute.Home);

  return (
    <React.Fragment>
      {breakpointTabletMin && (
        <AppBar elevation={0} position="static">
          <Toolbar className="bg-green-500 px-4">
            <NavLink
              to={localizeRouteKey(locale, AppRoute.Home, formatMessage)}
              className="inline-block no-underline text-white hover:text-gray-100 pr-4"
            >
              <Typography variant="h6" classes={typographyClasses}>
                {homeRouteKey
                  ? formatMessage({
                      id: AppRouteTitles.home.get(AppRoute.Home) || ""
                    })
                  : "KÄÄNNÖS PUUTTUU"}
              </Typography>
              {formatMessage(common.siteShortDescription)}
            </NavLink>
            <div id="navigation-level-1">
              <Navigation level={1} />
            </div>
          </Toolbar>
          <Toolbar className="bg-green-600" style={{ minHeight: "3rem" }}>
            <Navigation level={2} />
          </Toolbar>
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
