import React from "react";
import { render } from "react-dom";
import { ThroughProvider } from "react-through";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { COLORS } from "./modules/styles";
import AppWrapper from "./AppWrapper";
import { AppProvider } from "./context/appContext";
// import * as serviceWorker from "./registerServiceWorker";

import "./css/tailwind.css";
import "./css/common.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: COLORS.OIVA_GREEN
      // dark: will be calculated from palette.primary.main,
    },
    secondary: {
      // light: will be calculated from palette.secondary.main,
      main: COLORS.DARK_GRAY
      // dark: will be calculated from palette.secondary.main,
      // contrastText: will be calculated to contrast with palette.secondary.main
    }
    // error: will use the default color
  },
  typography: {
    useNextVariants: true
  }
});

render(
  <ThroughProvider>
    <MuiThemeProvider theme={theme}>
      <AppProvider>
        <AppWrapper />
      </AppProvider>
    </MuiThemeProvider>
  </ThroughProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
