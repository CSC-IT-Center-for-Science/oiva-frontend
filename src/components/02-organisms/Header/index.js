import React from "react";
import PropTypes from "prop-types";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import css from "./header.module.css";
import {NavLink} from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import {AppBar, Button, IconButton, Toolbar, Typography, useMediaQuery} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import HorizontalLayout from "./HorizontalLayout";
import VerticalLayout from "./VerticalLayout";
import {equals} from "ramda";

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
     template = "A",
     languageSelectionAriaLabel = "Kielivalinta"
   }) => {
    const classes = useStyles();
    const typographyClasses = useStylesForTypography();
    const items = [
      <a href={logo.path} className="inline-block no-underline text-gray-800">
        <Typography variant="h6" classes={typographyClasses}>
          {logo.text}
        </Typography>
        {shortDescription.text}
      </a>,
      !!authenticationLink ? (
        <NavLink
          to={authenticationLink.path}
          exact={false}
          className="inline-block no-underline text-gray-800 hover:underline">
          <span>{authenticationLink.text[0]} </span>
          {authenticationLink.text[1] && (
            <span className="font-bold">{authenticationLink.text[1]}</span>
          )}
        </NavLink>
      ) : (
        <React.Fragment />
      ),
      organisation.path ? (
        <NavLink
          className="link-to-own-organisation"
          to={organisation.path}
          exact={false}>
          <span className="text-gray-600">{organisation.text}</span>
        </NavLink>
      ) : (
        <span className="text-gray-800">{organisation.text}</span>
      )
    ];

    const breakpointTabletMin = useMediaQuery(MEDIA_QUERIES.TABLET_MIN);

    return (
      <React.Fragment>
        {/* Layout for mobile and other small screens */}
        {!breakpointTabletMin && (
          <React.Fragment>
            {template === "C" && (
              <VerticalLayout items={items}>
                <ToggleButtonGroup
                  size="small"
                  onChange={onLocaleChange}
                  value={locale}
                  exclusive>
                  <ToggleButton
                    aria-label={languageSelectionAriaLabel + inFinnish}
                    key={1}
                    value="fi"
                    className="whitespace-no-wrap"
                    classes={{
                      label: css["locale-label"],
                      selected: css["locale-selected"],
                      sizeSmall: css["locale-button"]
                    }}
                    disabled={locale === "fi"}>
                    {inFinnish}
                  </ToggleButton>
                  <ToggleButton
                    aria-label={languageSelectionAriaLabel + inSwedish}
                    key={2}
                    value="sv"
                    className="whitespace-no-wrap"
                    classes={{
                      label: css["locale-label"],
                      selected: css["locale-selected"],
                      sizeSmall: css["locale-button"]
                    }}
                    disabled={locale === "sv"}>
                    {inSwedish}
                  </ToggleButton>
                </ToggleButtonGroup>
              </VerticalLayout>
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
                    {!isAuthenticated && !!authenticationLink ? (
                      <Button color="inherit" onClick={onLoginButtonClick}>
                        {logIn}
                      </Button>
                    ) : (
                      <React.Fragment />
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
                <HorizontalLayout items={items}>
                  <ToggleButtonGroup
                    size="small"
                    onChange={onLocaleChange}
                    value={locale}
                    exclusive>
                    <ToggleButton
                      aria-label={languageSelectionAriaLabel + inFinnish}
                      key={1}
                      value="fi"
                      className="whitespace-no-wrap"
                      classes={{
                        label: css["locale-label"],
                        selected: css["locale-selected"],
                        sizeSmall: css["locale-button"]
                      }}
                      disabled={locale === "fi"}>
                      {inFinnish}
                    </ToggleButton>
                    <ToggleButton
                      aria-label={languageSelectionAriaLabel + inSwedish}
                      key={2}
                      value="sv"
                      className="whitespace-no-wrap"
                      classes={{
                        label: css["locale-label"],
                        selected: css["locale-selected"],
                        sizeSmall: css["locale-button"]
                      }}
                      disabled={locale === "sv"}>
                      {inSwedish}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </HorizontalLayout>
              )}
            </Toolbar>
          </AppBar>
        )}
      </React.Fragment>
    );
  },
  (currentProps, nextProps) => {
    const isSameOld =
      equals("" + currentProps.onLocaleChange, "" + nextProps.onLocaleChange) &&
      equals(currentProps.organisation, nextProps.organisation) &&
      equals(currentProps.locale, nextProps.locale);
    return isSameOld;
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
  template: PropTypes.string,
  languageSelectionAriaLabel: PropTypes.string
};

export default Header;
