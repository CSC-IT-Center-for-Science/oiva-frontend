import React from "react";
import { storiesOf } from "@storybook/react";
import ActionList from "./index";
import { withInfo } from "@storybook/addon-info";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

storiesOf("Action list", module)
  .addDecorator(withInfo)
  .add("with removal action", () => {
    const items = [
      {
        title: "Item 1"
      },
      {
        title: "Item 2"
      },
      {
        title: "Item 3"
      }
    ];

    const removeItem = item => {
      console.info("Going to remove item: ", item);
    };
    return (
      <MuiThemeProvider theme={theme}>
        <ActionList items={items} removalCallback={removeItem}></ActionList>
      </MuiThemeProvider>
    );
  });
