import React from "react";
import PropTypes from "prop-types";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import css from "./header.module.css";
import TemplateA from "../../03-templates/TemplateA";
import { NavLink } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import {
  AppBar,
  Toolbar,
  useMediaQuery,
  Typography,
  IconButton,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TemplateC from "../../03-templates/TemplateC";

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

const Header = React.memo(
  ({
    inFinnish,
    inSwedish,
    isAuthenticated,
    locale,
    logIn,
    logo,
    authenticationLink,
    onLocaleChange,
    onLoginButtonClick,
    onMenuClick,
    organisation,
    shortDescription,
    template = "A"
  }) => {
    const classes = useStyles();
    const typographyClasses = useStylesForTypography();
    const items = [
      <NavLink
        to={logo.path}
        exact={true}
        className="inline-block no-underline text-gray-800">
        <Typography variant="h6" classes={typographyClasses}>
          {logo.text}
        </Typography>
      </NavLink>,
      <NavLink
        to={shortDescription.path}
        exact={true}
        className="inline-block no-underline text-gray-800">
        {shortDescription.text}
      </NavLink>,
      <NavLink
        to={authenticationLink.path}
        exact={false}
        className="inline-block no-underline text-gray-800 hover:underline">
        <span>{authenticationLink.text[0]} </span>
        {authenticationLink.text[1] && (
          <span className="font-bold">{authenticationLink.text[1]}</span>
        )}
      </NavLink>,
      <NavLink className="link-to-own-organisation" to={organisation.path} exact={false}>
        <span className="text-gray-600">{organisation.text}</span>
      </NavLink>
    ];

    const breakpointTabletMin = useMediaQuery(MEDIA_QUERIES.TABLET_MIN);

    return (
      <React.Fragment>
        {/* Layout for mobile and other small screens */}
        {!breakpointTabletMin && (
          <React.Fragment>
            {template === "C" && (
              <TemplateC items={items}>
                <ToggleButtonGroup
                  size="small"
                  onChange={onLocaleChange}
                  value={locale}
                  exclusive>
                  <ToggleButton
                    key={1}
                    value="fi"
                    className="whitespace-no-wrap"
                    classes={{
                      label: css["locale-label"],
                      selected: css["locale-selected"],
                      sizeSmall: css["locale-button"]
                    }}>
                    {inFinnish}
                  </ToggleButton>
                  <ToggleButton
                    key={2}
                    value="sv"
                    className="whitespace-no-wrap"
                    classes={{
                      label: css["locale-label"],
                      selected: css["locale-selected"],
                      sizeSmall: css["locale-button"]
                    }}>
                    {inSwedish}
                  </ToggleButton>
                </ToggleButtonGroup>
              </TemplateC>
            )}
            {template !== "C" && (
              <div className={`fixed w-full z-50 ${classes.root} `}>
                <AppBar elevation={0} position="static">
                  <Toolbar className="bg-green-500">
                    <IconButton
                      edge="start"
                      className={classes.menuButton}
                      color="inherit"
                      aria-label="menu"
                      onClick={onMenuClick}>
                      <MenuIcon />
                    </IconButton>
                    <NavLink
                      to={logo.path}
                      exact={true}
                      className="inline-block no-underline text-white flex-grow">
                      <Typography variant="h6" className={classes.title}>
                        {logo.text}
                      </Typography>
                    </NavLink>
                    {!isAuthenticated && (
                      <Button color="inherit" onClick={onLoginButtonClick}>
                        {logIn}
                      </Button>
                    )}
                  </Toolbar>
                </AppBar>
              </div>
            )}
          </React.Fragment>
        )}
        {/* Layout for bigger screens */}
        {breakpointTabletMin && (
          <AppBar elevation={0} position="static">
            <Toolbar className="bg-white px-4 border border-gray-300">
              {(template === "A" || !template) && (
                <TemplateA items={items}>
                  <ToggleButtonGroup
                    size="small"
                    onChange={onLocaleChange}
                    value={locale}
                    exclusive>
                    <ToggleButton
                      key={1}
                      value="fi"
                      className="whitespace-no-wrap"
                      classes={{
                        label: css["locale-label"],
                        selected: css["locale-selected"],
                        sizeSmall: css["locale-button"]
                      }}>
                      {inFinnish}
                    </ToggleButton>
                    <ToggleButton
                      key={2}
                      value="sv"
                      className="whitespace-no-wrap"
                      classes={{
                        label: css["locale-label"],
                        selected: css["locale-selected"],
                        sizeSmall: css["locale-button"]
                      }}>
                      {inSwedish}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </TemplateA>
              )}
            </Toolbar>
          </AppBar>
        )}
      </React.Fragment>
    );
  }
);

Header.propTypes = {
  inFinnish: PropTypes.string,
  inSwedish: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  locale: PropTypes.string,
  logIn: PropTypes.string,
  logo: PropTypes.object,
  authenticationLink: PropTypes.object,
  onLocaleChange: PropTypes.func.isRequired,
  onLoginButtonClick: PropTypes.func.isRequired,
  onMenuClick: PropTypes.func.isRequired,
  organisation: PropTypes.object,
  shortDescription: PropTypes.object,
  template: PropTypes.string
};

export default Header;
