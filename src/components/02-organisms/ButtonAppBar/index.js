import React, { useEffect } from "react";
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
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import { MEDIA_QUERIES } from "../../../modules/styles";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  toolbarTitle: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

const ButtonAppBar = ({ classes, user = {}, oppilaitos, dispatch }) => {
  const breakpointTabletMin = useMediaQuery(MEDIA_QUERIES.TABLET_MIN);
  const ytunnus =
    oppilaitos && oppilaitos.organisaatio
      ? oppilaitos.organisaatio.ytunnus
      : false;

  useEffect(() => {
    if (user && user.oid) {
      getOrganization(user.oid)(dispatch);
    }
  }, [user]);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="default" className={classes.appBar}>
        <Toolbar>
          {!breakpointTabletMin && (
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            Oiva - Opetushallinnon ohjaus- ja säätelypalvelu
          </Typography>
          {!sessionStorage.getItem("role") ? (
            <LinkItemUpper to="/cas-auth" className="has-separator pull-right">
              Kirjaudu sisään
            </LinkItemUpper>
          ) : null}
          {user && user.username && (
            <LinkItemUpper
              to="/cas-logout"
              className="has-separator pull-right"
            >
              Kirjaudu ulos ({user.username})
            </LinkItemUpper>
          )}
          <LinkItemUpper to="/fi" className="has-separator pull-right">
            Suomeksi
          </LinkItemUpper>
          <LinkItemUpper to="/sv" className="pull-right">
            På svenska
          </LinkItemUpper>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
