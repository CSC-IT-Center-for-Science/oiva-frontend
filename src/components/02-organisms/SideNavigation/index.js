import React from "react";
import Drawer from "@material-ui/core/Drawer";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

const SideNavigation = ({
  children,
  handleDrawerToggle,
  isVisible,
  setIsMobileMenuVisible
}) => {
  const toggleDrawer = isOpen => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    if (handleDrawerToggle) {
      handleDrawerToggle(isOpen);
    }
  };

  const useStyles = makeStyles(theme => ({
    paper: {
      backgroundColor: "#4c7a61",
      color: "white",
      maxWidth: "20.625rem"
    }
  }));
  const classes = useStyles();

  return (
    <div data-testid="side-navigation">
      <Drawer
        classes={{
          paper: classes.paper
        }}
        open={isVisible}
        onClose={toggleDrawer(false)}
        variant="temporary"
        onEscapeKeyDown={() => setIsMobileMenuVisible(false)}
        onBackdropClick={() => setIsMobileMenuVisible(false)}
      >
        <div
          tabIndex={0}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          {children}
        </div>
      </Drawer>
    </div>
  );
};

SideNavigation.propTypes = {
  handleDrawerToggle: PropTypes.func,
  isVisible: PropTypes.bool,
  setIsMobileMenuVisible: PropTypes.func.isRequired
};

export default SideNavigation;
