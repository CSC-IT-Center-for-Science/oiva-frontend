import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Route, Router, Switch } from "react-router-dom";
import { PropTypes } from "prop-types";
import Login from "scenes/Login/Login";
import Logout from "scenes/Logout/Logout";
import Footer from "scenes/Footer/Footer";
import Jarjestajat from "./scenes/Jarjestajat/Jarjestajat";
import { COLORS } from "./modules/styles";
import Home from "scenes/Home";
import CasAuthenticated from "scenes/CasAuthenticated/CasAuthenticated";
import Tilastot from "./scenes/Tilastot/components/Tilastot";
import RequireCasAuth from "./scenes/Login/services/RequireCasAuth";
import DestroyCasAuth from "./scenes/Logout/services/DestroyCasAuth";
import { Breadcrumbs } from "react-breadcrumbs-dynamic";
import JarjestajaSwitch from "./scenes/Jarjestajat/Jarjestaja/components/JarjestajaSwitch";
import { NavLink } from "react-dom";
import { createBrowserHistory } from "history";
import authMessages from "./i18n/definitions/auth";
import { useIntl } from "react-intl";
import commonMessages from "./i18n/definitions/common";
import educationMessages from "./i18n/definitions/education";
import langMessages from "./i18n/definitions/languages";
import { ToastContainer } from "react-toastify";
import {
  ROLE_ESITTELIJA,
  ROLE_KATSELIJA,
  ROLE_MUOKKAAJA,
  ROLE_NIMENKIRJOITTAJA,
  ROLE_YLLAPITAJA
} from "./modules/constants";
import Esittelijat from "./scenes/Esittelijat/Esittelijat";
import Header from "okm-frontend-components/dist/components/02-organisms/Header";
import Navigation from "okm-frontend-components/dist/components/02-organisms/Navigation";
import SideNavigation from "okm-frontend-components/dist/components/02-organisms/SideNavigation";
import { useOrganisation } from "./stores/organisation";
import { useGlobalSettings } from "./stores/appStore";
import { useUser } from "./stores/user";
import * as R from "ramda";
import Yhteydenotto from "./scenes/Yhteydenotto";
import Saavutettavuusseloste from "./scenes/Saavutettavuusseloste";
import Tietosuojailmoitus from "./scenes/Tietosuojailmoitus";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";
import "@reach/skip-nav/styles.css";
import BaseData from "scenes/BaseData";
import SessionDialog from "SessionDialog";

const history = createBrowserHistory();

const logo = { text: "Oiva", path: "/" };

const keys = ["lupa", "kielet"];

/**
 * App component forms the basic structure of the application and its routing.
 *
 * @param {props} - Properties object.
 */
const App = ({ isSessionDialogVisible, onLogout, onSessionDialogOK }) => {
  const intl = useIntl();
  const [userState] = useUser();

  const { data: user } = userState;

  const [organisation, organisationActions] = useOrganisation();

  const [isSideMenuVisible, setSideMenuVisibility] = useState(false);

  const [appState, appActions] = useGlobalSettings();

  const kujaURL = process.env.REACT_APP_KUJA_URL || "https://localhost:4433";

  const pageLinks = [
    {
      url: kujaURL + "/esi-ja-perusopetus",
      text: intl.formatMessage(educationMessages.preAndBasicEducation)
    },
    {
      url: kujaURL + "/lukiokoulutus",
      text: intl.formatMessage(educationMessages.highSchoolEducation)
    },
    {
      path: "/jarjestajat",
      text: intl.formatMessage(educationMessages.vocationalEducation)
    },
    {
      url: kujaURL + "/vapaa-sivistystyo",
      text: intl.formatMessage(educationMessages.vstEducation)
    },
    { path: "/tilastot", text: intl.formatMessage(commonMessages.statistics) }
  ];

  if (sessionStorage.getItem("role") === ROLE_ESITTELIJA) {
    pageLinks.push({
      path: "/asiat",
      text: "Asiat"
    });
  }

  const authenticationLink = useMemo(() => {
    return {
      text: !user
        ? [intl.formatMessage(authMessages.logIn)]
        : [intl.formatMessage(authMessages.logOut), user.username],
      path: !user ? "/cas-auth" : "/cas-logout"
    };
  }, [intl, user]);

  const onLocaleChange = useCallback(
    (...props) => {
      appActions.setLocale(props[1]);
      if (props[1]) {
        sessionStorage.setItem("locale", props[1]);
      } else {
        sessionStorage.removeItem("locale");
      }
    },
    [appActions]
  );

  const onLoginButtonClick = useCallback(() => history.push("/cas-auth"), []);

  const onMenuClick = useCallback(
    () => setSideMenuVisibility(isVisible => !isVisible),
    []
  );

  const onSessionDialogLogout = useCallback(() => {
    onLogout();
    history.push("/cas-logout");
  }, [onLogout]);

  const organisationLink = useMemo(() => {
    if (user && user.oid && organisation && organisation[user.oid]) {
      const orgNimi =
        user && organisation && organisation[user.oid]
          ? R.prop("nimi", organisation[user.oid].data)
          : "";
      const isEsittelija = user
        ? R.includes("OIVA_APP_ESITTELIJA", user.roles)
        : false;
      const result = {
        // Select name by locale or first in nimi object
        text: R.or(
          R.prop(intl.locale, orgNimi),
          R.tail(R.head(R.toPairs(orgNimi)) || [])
        )
      };
      return isEsittelija
        ? result
        : R.assoc(
            "path",
            `/jarjestajat/${R.prop(
              "ytunnus",
              organisation[user.oid].data
            )}/jarjestamislupa-asia`,
            result
          );
    }
    return {};
  }, [intl, organisation, user]);

  const shortDescription = {
    text: intl.formatMessage(commonMessages.siteShortDescription),
    path: "/"
  };

  // Let's fetch ORGANISAATIO
  useEffect(() => {
    let abortController;
    if (user && user.oid) {
      abortController = organisationActions.load(user.oid);
    }
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [organisationActions, user]);

  /**
   * If user has authenticated save some of his/her information into the
   * session storage.
   */
  useEffect(() => {
    if (user && user.username !== sessionStorage.getItem("username")) {
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("oid", user.oid);
      const role = [
        ROLE_YLLAPITAJA,
        ROLE_ESITTELIJA,
        ROLE_MUOKKAAJA,
        ROLE_NIMENKIRJOITTAJA,
        ROLE_KATSELIJA
      ].find(role => R.indexOf(role, user.roles) > -1);
      sessionStorage.setItem("role", role || "");
    }
  }, [user]);

  const getHeader = useCallback(
    template => {
      if (
        appState.locale &&
        intl &&
        (!user || (organisation[user.oid] && !organisation[user.oid].isLoding))
      ) {
        return (
          <Header
            inFinnish={intl.formatMessage(langMessages.inFinnish)}
            inSwedish={intl.formatMessage(langMessages.inSwedish)}
            isAuthenticated={!!user}
            locale={appState.locale}
            logIn={intl.formatMessage(authMessages.logIn)}
            logo={logo}
            authenticationLink={authenticationLink}
            onLocaleChange={onLocaleChange}
            onLoginButtonClick={onLoginButtonClick}
            onMenuClick={onMenuClick}
            organisation={organisationLink}
            shortDescription={shortDescription}
            template={template}
            languageSelectionAriaLabel={intl.formatMessage(
              langMessages.selection
            )}></Header>
        );
      }
      return null;
    },
    [
      appState.locale,
      authenticationLink,
      intl,
      organisation,
      onLocaleChange,
      onLoginButtonClick,
      onMenuClick,
      organisationLink,
      shortDescription,
      user
    ]
  );

  return (
    <React.Fragment>
      <Router history={history}>
        <div className="flex flex-col min-h-screen">
          <SkipNavLink>
            {intl.formatMessage(commonMessages.jumpToContent)}
          </SkipNavLink>
          <div
            className={`relative lg:fixed z-50 ${
              appState.isDebugModeOn ? "w-2/3" : "w-full"
            }`}>
            {getHeader()}

            <div className="hidden md:block">
              <Navigation links={pageLinks}></Navigation>
            </div>
          </div>

          <SideNavigation
            isVisible={isSideMenuVisible}
            handleDrawerToggle={isVisible => {
              setSideMenuVisibility(isVisible);
            }}>
            {getHeader("C")}

            <div className="p-4 max-w-xl">
              <Navigation
                direction="vertical"
                links={pageLinks}
                theme={{
                  backgroundColor: "white",
                  color: "black",
                  hoverColor: "white"
                }}></Navigation>
            </div>
          </SideNavigation>

          <div className="flex flex-1 flex-col justify-between mt-16 md:mt-0 lg:mt-32">
            <div className="flex flex-col flex-1 bg-white">
              <div
                style={{ maxWidth: "90rem" }}
                className="w-full mx-auto px-3 lg:px-8 py-8">
                <nav
                  tabIndex="0"
                  className="breadcumbs-nav"
                  aria-label={intl.formatMessage(commonMessages.breadCrumbs)}>
                  <Breadcrumbs
                    hideIfEmpty={true}
                    separator={<b> / </b>}
                    item={NavLink}
                    finalItem={"b"}
                    finalProps={{
                      style: {
                        fontWeight: 400,
                        color: COLORS.BLACK
                      }
                    }}
                  />
                </nav>
              </div>
              <SkipNavContent />
              <main className="flex-1 flex flex-col">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/logout" component={Logout} />
                  <Route path="/kirjaudu" component={Login} />
                  <Route exact path="/tilastot" component={Tilastot} />
                  <Route path="/cas-auth" component={RequireCasAuth} />
                  <Route path="/cas-logout" component={DestroyCasAuth} />
                  <Route path="/cas-ready" component={CasAuthenticated} />
                  <Route
                    exact
                    path="/jarjestajat"
                    render={props => <Jarjestajat />}
                  />
                  <Route
                    path="/asiat"
                    render={() => {
                      return user &&
                        !user.isLoading &&
                        organisation[user.oid] &&
                        !!organisation[user.oid].fetchedAt ? (
                        <Esittelijat />
                      ) : null;
                    }}
                  />
                  <Route
                    path="/jarjestajat/:ytunnus"
                    render={props => {
                      return (
                        <BaseData
                          keys={keys}
                          locale={intl.locale}
                          render={_props => {
                            return (
                              <JarjestajaSwitch
                                lupa={_props.lupa}
                                path={props.match.path}
                                ytunnus={_props.ytunnus}
                                user={user}
                                kielet={_props.kielet}
                              />
                            );
                          }}
                        />
                      );
                    }}
                  />
                  <Route
                    path="/saavutettavuusseloste"
                    component={Saavutettavuusseloste}
                  />
                  <Route
                    path="/tietosuojailmoitus"
                    render={() => <Tietosuojailmoitus locale={intl.locale} />}
                  />
                  <Route
                    path="/yhteydenotto"
                    render={() => <Yhteydenotto locale={intl.locale} />}
                  />
                </Switch>
              </main>
            </div>
          </div>
          <footer>
            <Footer
            // props={props}
            />
            <ToastContainer />
          </footer>
        </div>
      </Router>
      {isSessionDialogVisible && !!user ? (
        <SessionDialog
          isVisible={isSessionDialogVisible}
          onLogout={onSessionDialogLogout}
          onOK={onSessionDialogOK}
        />
      ) : null}
    </React.Fragment>
  );
};

App.propTypes = {
  isSessionDialogVisible: PropTypes.bool,
  onLogout: PropTypes.func,
  onSessionDialogOK: PropTypes.func
};

App.displayName = "App";

export default App;
