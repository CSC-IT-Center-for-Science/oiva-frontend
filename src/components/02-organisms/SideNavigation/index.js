import React from "react";
import Drawer from "@material-ui/core/Drawer";
import PropTypes from "prop-types";

const SideNavigation = ({ children, handleDrawerToggle, isVisible }) => {
  const toggleDrawer = isOpen => event => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    handleDrawerToggle(isOpen);
  };

  return (
    <div data-testid="side-navigation">
      <Drawer open={isVisible} onClose={toggleDrawer(false)}>
        <div
          tabIndex={0}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}>
          {children}
        </div>
      </Drawer>
    </div>
  );
};

SideNavigation.propTypes = {
  handleDrawerToggle: PropTypes.func,
  isVisible: PropTypes.bool
};

export default SideNavigation;
