import "./wdyr";
import React from "react";
import { render } from "react-dom";
import { ThroughProvider } from "react-through";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import AppWrapper from "./AppWrapper";
import localforage from "localforage";
import { COLORS } from "modules/styles";

// import * as serviceWorker from "./registerServiceWorker";

import "./css/tailwind.css";
import "./css/common.css";

/**
 * By default, localForage selects backend drivers for the datastore in this
 * order:
 *
 * 1. IndexedDB
 * 2. WebSQL
 * 3. localStorage
 *
 * The storage created below will be used to store data from backend so that
 * it can be easily accessed later. One example is saving the degrees
 * (tutkinnot) with related languages (tutkintokielet).
 */
localforage.config({
  name: "Oiva App"
});

const theme = createMuiTheme();

theme.typography.useNextVariants = true;

theme.typography.h1 = {
  fontSize: "2rem",
  fontWeight: 500,
  lineHeight: "1.2",
  paddingBottom: "1rem",
  paddingTop: "1rem",
  [theme.breakpoints.down("xs")]: {
    fontSize: "1.875rem"
  }
};

theme.typography.h2 = {
  fontSize: "1.5rem",
  fontWeight: 500,
  lineHeight: "1.275",
  paddingBottom: "1rem",
  paddingTop: "1rem",
  [theme.breakpoints.down("xs")]: {
    fontSize: "1.375rem"
  }
};

theme.typography.h3 = {
  fontSize: "1.2rem",
  fontWeight: 500,
  lineHeight: "1.3",
  paddingBottom: "1rem",
  paddingTop: "1rem"
};

theme.typography.h4 = {
  fontSize: "1rem",
  fontWeight: 500,
  lineHeight: "1.5",
  paddingBottom: "1rem",
  paddingTop: "1rem"
};

theme.typography.h5 = {
  fontSize: ".875rem",
  fontWeight: 500,
  lineHeight: "1.5",
  paddingBottom: "0.875rem",
  paddingTop: "0.875rem"
};

theme.typography.p = {
  marginBottom: "1.5rem"
};

theme.palette.primary.main = COLORS.OIVA_GREEN;
theme.palette.primary.light = "#65A884";
theme.palette.secondary.main = COLORS.DARK_GRAY;

render(
  <ThroughProvider>
    <MuiThemeProvider theme={theme}>
      <AppWrapper />
    </MuiThemeProvider>
  </ThroughProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
