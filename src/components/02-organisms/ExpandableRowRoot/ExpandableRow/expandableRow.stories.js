import React from "react";
import { storiesOf } from "@storybook/react";
import ExpandableRow from "./index";
import { withInfo } from "@storybook/addon-info";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

storiesOf("ExpandableRow", module)
  .addDecorator(withInfo)
  .add("is shrinked", () => (
    <MuiThemeProvider theme={theme}>
      <ExpandableRow>
        <div data-slot="title">Title of an expandable row</div>
        <div data-slot="info">Info section</div>
        <div data-slot="content">There is some content here...</div>
      </ExpandableRow>
    </MuiThemeProvider>
  ))
  .add("is expanded", () => (
    <MuiThemeProvider theme={theme}>
      <ExpandableRow shouldBeExpanded={true}>
        <div data-slot="title">Title</div>
        <div data-slot="info">Info section</div>
        <div data-slot="content">There is some content here...</div>
      </ExpandableRow>
    </MuiThemeProvider>
  ));
