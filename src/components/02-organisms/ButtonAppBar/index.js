import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import LinkItemUpper from "../../../scenes/Header/components/LinkItemUpper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { getOrganization } from "services/kayttajat/actions";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { MEDIA_QUERIES } from "../../../modules/styles";
import SideNavigation from "../SideNavigation";
import { NavLink } from "react-router-dom";

const styles = () => ({
  appBar: {
    position: "relative"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

const ButtonAppBar = ({
  classes,
  ytunnus,
  user = {},
  oppilaitos,
  pageLinks,
  dispatch
}) => {
  const breakpointTabletMin = useMediaQuery(MEDIA_QUERIES.TABLET_MIN);
  const [state, setState] = useState({
    isSideNavigationVisible: false
  });

  useEffect(() => {
    if (user && user.oid) {
      getOrganization(user.oid)(dispatch);
    }
  }, [user]);

  const handleMenuButtonClick = () => {
    setState({
      isSideNavigationVisible: !state.isSideNavigationVisible
    });
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <SideNavigation
        user={user}
        oppilaitos={oppilaitos}
        ytunnus={ytunnus}
        position="left"
        shouldBeVisible={state.isSideNavigationVisible}
        onDrawerToggle={handleMenuButtonClick}
        pageLinks={pageLinks}
      />
      <AppBar position="static" color="default" className={classes.appBar}>
        <Toolbar className="flex">
          {!breakpointTabletMin && (
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
              onClick={handleMenuButtonClick}
            >
              <MenuIcon />
            </IconButton>
          )}
          <NavLink to="/" exact className="flex-1 no-underline">
            <Typography variant="h6" color="inherit" noWrap>
              Oiva
            </Typography>
            <Typography variant="subtitle2" color="inherit" noWrap>
              Opetushallinnon ohjaus- ja säätelypalvelu
            </Typography>
          </NavLink>
          {breakpointTabletMin && !sessionStorage.getItem("role") ? (
            <LinkItemUpper to="/cas-auth" className="has-separator pull-right">
              Kirjaudu sisään
            </LinkItemUpper>
          ) : null}
          {breakpointTabletMin && user && user.username && (
            <LinkItemUpper
              to="/cas-logout"
              className="has-separator pull-right"
            >
              Kirjaudu ulos ({user.username})
            </LinkItemUpper>
          )}
          {breakpointTabletMin && (
            <LinkItemUpper to="/fi" className="has-separator pull-right">
              Suomeksi
            </LinkItemUpper>
          )}
          {breakpointTabletMin && (
            <LinkItemUpper to="/sv" className="pull-right">
              På svenska
            </LinkItemUpper>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
