import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, NavLink } from 'react-router-dom'
import { BreadcrumbsProvider, Breadcrumbs } from 'react-breadcrumbs-dynamic'

import 'modules/polyfills'
import store from 'store'
import Header from 'modules/Header/containers/HeaderContainer'
import Footer from 'modules/Footer/containers/FooterContainer'
import Routes from 'routes'
import { COLORS, APP_WIDTH } from './modules/styles'
import { AppContainer, BreadcrumbsContainer, RoutesContainer } from './modules/elements'

ReactDOM.render(
  <Provider store={store}>
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
  </Provider>,
  document.getElementById("root")
)
