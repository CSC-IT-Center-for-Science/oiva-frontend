import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import SideNavigation from ".";
import { Button } from "@material-ui/core";

storiesOf("SideNavigation", module).add("Basic layout", () => {
  const [isSideMenuVisible, setSideMenuVisibility] = useState(false);

  function toggleDrawer() {
    return setSideMenuVisibility(isVisible => !isVisible);
  }

  return (
    <React.Fragment>
      <div className="flex justify-center pt-24">
        <Button
          variant="contained"
          color="primary"
          className="float-right"
          onClick={() => {
            toggleDrawer();
          }}>
          Toggle menu
        </Button>
      </div>
      <SideNavigation
        handleDrawerToggle={toggleDrawer}
        isVisible={isSideMenuVisible}>
        Content of the menu.
      </SideNavigation>
    </React.Fragment>
  );
});
