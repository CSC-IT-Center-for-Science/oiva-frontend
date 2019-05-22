import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, NavLink } from 'react-router-dom'
import { BreadcrumbsProvider, Breadcrumbs } from 'react-breadcrumbs-dynamic'
import "./css/tailwind.css";
import 'modules/polyfills'
import store from 'store'
import Header from 'modules/Header/containers/HeaderContainer'
import Footer from 'modules/Footer/containers/FooterContainer'
import Routes from 'routes'
import { COLORS, APP_WIDTH } from './modules/styles'
import { AppContainer, BreadcrumbsContainer, RoutesContainer } from './modules/elements'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: COLORS.OIVA_MEDIUM_GREEN,
      // dark: will be calculated from palette.primary.main,
      contrastText: COLORS.WHITE,
    },
    secondary: {
      // light: will be calculated from palette.secondary.main,
      main: COLORS.DARK_GRAY,
      // dark: will be calculated from palette.secondary.main,
      // contrastText: will be calculated to contrast with palette.secondary.main
    },
    // error: will use the default color
  },
});

ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
          <BreadcrumbsProvider>
            <BrowserRouter>
              <AppContainer>
                <Header maxWidth={`${APP_WIDTH}`}/>
                <BreadcrumbsContainer>
                  <Breadcrumbs
                    separator={<b> / </b>}
                    item={NavLink}
                    finalItem={'b'}
                    finalProps={{
                      style: {
                        color: COLORS.BLACK
                      }
                    }}
                  />
                </BreadcrumbsContainer>
                <RoutesContainer>
                  <Routes />
                </RoutesContainer>
                <Footer maxWidth={`${APP_WIDTH}`}/>
              </AppContainer>
            </BrowserRouter>
          </BreadcrumbsProvider>
      </MuiThemeProvider>
    </Provider>,
    document.getElementById("root")
)
