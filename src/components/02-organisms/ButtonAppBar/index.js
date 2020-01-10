import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import CssBaseline from "@material-ui/core/CssBaseline";
import LinkItemUpper from "./LinkItemUpper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { MEDIA_QUERIES } from "../../../modules/styles";
import SideNavigation from "../SideNavigation";
import { NavLink } from "react-router-dom";
import { COLORS } from "../../../modules/styles";
import { AppContext } from "../../../context/appContext";
import { setLocale } from "../../../services/app/actions";
import { injectIntl } from "react-intl";
import authMessages from "../../../i18n/definitions/auth";
import langMessages from "../../../i18n/definitions/languages";
import css from "./button-app-bar.module.css";
import * as R from "ramda";

const styles = () => ({
  appBar: {
    position: "relative",
    backgroundColor: COLORS.WHITE,
    opacity: 0.98,
    marginLeft: -8
  },
  menuButton: {
    marginLeft: -4,
    marginRight: 4
  }
});

const ButtonAppBar = ({
  classes,
  intl,
  ytunnus,
  user = null,
  organisaatio,
  pageLinks
}) => {
  const { state: appState, dispatch: appDispatch } = useContext(AppContext);
  const breakpointTabletMin = useMediaQuery(MEDIA_QUERIES.TABLET_MIN);
  const [state, setState] = useState({
    isSideNavigationVisible: false
  });

  const handleMenuButtonClick = () => {
    setState({
      isSideNavigationVisible: !state.isSideNavigationVisible
    });
  };

  const handleLocaleChange = (event, locale) => {
    setLocale(locale)(appDispatch);
    if (locale) {
      sessionStorage.setItem("locale", locale);
    } else {
      sessionStorage.removeItem("locale");
    }
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <SideNavigation
        user={user}
        ytunnus={ytunnus}
        position="left"
        shouldBeVisible={state.isSideNavigationVisible}
        onDrawerToggle={handleMenuButtonClick}
        pageLinks={pageLinks}
      />
      <AppBar elevation={0} position="static" className={classes.appBar}>
        <Toolbar className="flex">
          {!breakpointTabletMin && (
            <IconButton
              className={classes.menuButton}
              aria-label="Menu"
              onClick={handleMenuButtonClick}
            >
              <MenuIcon />
            </IconButton>
          )}
          <div className="flex-1 mt-1">
            <NavLink
              to="/"
              exact
              className="inline-block no-underline text-gray-800"
            >
              <Typography variant="h6" color="inherit" noWrap>
                Oiva
              </Typography>
              <Typography variant="subtitle2" color="inherit" noWrap>
                Opetushallinnon ohjaus- ja säätelypalvelu
              </Typography>
            </NavLink>
          </div>
          {breakpointTabletMin && !user ? (
            <LinkItemUpper
              to="/cas-auth"
              className="has-separator pull-right"
              activeStyle={{
                backgroundColor: "transparent"
              }}
            >
              {intl.formatMessage(authMessages.logIn)}
            </LinkItemUpper>
          ) : null}
          {breakpointTabletMin && user && user.username && (
            <LinkItemUpper
              to="/cas-logout"
              className="has-separator pull-right"
              activeStyle={{
                backgroundColor: "transparent"
              }}
            >
              {intl.formatMessage(authMessages.logOut)} ({user.username}) <br />{" "}
              <span className="text-gray-600">
                {R.path(["nimi", intl.locale], organisaatio)}
              </span>
            </LinkItemUpper>
          )}
          {breakpointTabletMin && (
            <React.Fragment>
              <ToggleButtonGroup
                size="small"
                onChange={handleLocaleChange}
                value={appState.locale}
                exclusive
              >
                <ToggleButton
                  key={1}
                  value="fi"
                  classes={{
                    label: css["locale-label"],
                    selected: css["locale-selected"],
                    sizeSmall: css["locale-button"]
                  }}
                >
                  {intl.formatMessage(langMessages.inFinnish)}
                </ToggleButton>
                <ToggleButton
                  key={2}
                  value="sv"
                  classes={{
                    label: css["locale-label"],
                    selected: css["locale-selected"],
                    sizeSmall: css["locale-button"]
                  }}
                >
                  {intl.formatMessage(langMessages.inSwedish)}
                </ToggleButton>
              </ToggleButtonGroup>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
  organisaatio: PropTypes.object,
  user: PropTypes.object
};

export default withStyles(styles)(injectIntl(ButtonAppBar));
