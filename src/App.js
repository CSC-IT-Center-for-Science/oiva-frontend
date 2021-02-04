import React, { useEffect, useMemo, useState, useCallback } from "react";
import { NavLink, Route, Router, useLocation } from "react-router-dom";
import { PropTypes } from "prop-types";
import Login from "scenes/Login/Login";
import Logout from "scenes/Logout/Logout";
import Footer from "components/03-templates/Footer";
import Home from "scenes/Home";
import CasAuthenticated from "scenes/CasAuthenticated/CasAuthenticated";
import Tilastot from "./scenes/Tilastot/components";
import RequireCasAuth from "./scenes/Login/services/RequireCasAuth";
import DestroyCasAuth from "./scenes/Logout/services/DestroyCasAuth";
import { createBrowserHistory } from "history";
import authMessages from "./i18n/definitions/auth";
import { useIntl } from "react-intl";
import common from "./i18n/definitions/common";
import education from "./i18n/definitions/education";
import langMessages from "./i18n/definitions/languages";
import { ToastContainer } from "react-toastify";
import {
  ROLE_ESITTELIJA,
  ROLE_KATSELIJA,
  ROLE_MUOKKAAJA,
  ROLE_NIMENKIRJOITTAJA,
  ROLE_YLLAPITAJA
} from "./modules/constants";
import Header from "./components/02-organisms/Header";
// import Navigation from "./components/02-organisms/Navigation";
import SideNavigation from "./components/02-organisms/SideNavigation";
import { useGlobalSettings } from "./stores/appStore";
import { useUser } from "./stores/user";
import Yhteydenotto from "./scenes/Yhteydenotto";
import Saavutettavuusseloste from "./scenes/Saavutettavuusseloste";
import Tietosuojailmoitus from "./scenes/Tietosuojailmoitus";
import { SkipNavLink, SkipNavContent } from "@reach/skip-nav";
import "@reach/skip-nav/styles.css";
import SessionDialog from "SessionDialog";
import AmmatillinenKoulutus from "scenes/Koulutusmuodot/AmmatillinenKoulutus";
import EsiJaPerusopetus from "scenes/Koulutusmuodot/EsiJaPerusopetus";
import Lukiokoulutus from "scenes/Koulutusmuodot/Lukiokoulutus";
import VapaaSivistystyo from "scenes/Koulutusmuodot/VapaaSivistystyo";
import { getRaw } from "basedata";
import { backendRoutes } from "stores/utils/backendRoutes";
import ammatillinenKoulutus from "i18n/definitions/ammatillinenKoulutus";
import esiJaPerusopetus from "i18n/definitions/esiJaPerusopetus";
import lukiokoulutus from "i18n/definitions/lukiokoulutus";
import vapaaSivistystyo from "i18n/definitions/vapaaSivistystyo";
import * as views from "views";
import * as R from "ramda";

import "react-toastify/dist/ReactToastify.css";
import { LocalizedSwitch } from "modules/i18n/index";
import { AppLanguage, AppRoute } from "const/index";
import { LanguageSwitcher } from "modules/i18n";
import { Navigation } from "modules/navigation";

const history = createBrowserHistory();

const logo = { text: "Oiva", path: AppRoute.Home };

const constants = {
  koulutusmuodot: {
    ammatillinenKoulutus: {
      kebabCase: "ammatillinenkoulutus"
    },
    esiJaPerusopetus: {
      kebabCase: "esi-ja-perusopetus",
      koulutustyyppi: "1"
    },
    lukiokoulutus: {
      kebabCase: "lukiokoulutus",
      koulutustyyppi: "2"
    },
    vapaaSivistystyo: {
      kebabCase: "vapaa-sivistystyo",
      koulutustyyppi: "3"
    }
  }
};

/**
 * App component forms the basic structure of the application and its routing.
 *
 * @param {props} - Properties object.
 */
const App = ({
  children,
  isSessionDialogVisible,
  localesByLang,
  onLogout,
  onSessionDialogOK
}) => {
  const intl = useIntl();
  const [userState] = useUser();
  console.info(intl.locale);
  const { data: user } = userState;

  const [organisation, setOrganisation] = useState();

  useEffect(() => {
    if (user && user.oid) {
      getRaw(
        "organisaatio",
        `${backendRoutes.organisaatio.path}/${user.oid}`,
        []
      ).then(result => {
        setOrganisation(result);
      });
    }
  }, [setOrganisation, user]);

  const [isSideMenuVisible, setSideMenuVisibility] = useState(false);
  const [appState] = useGlobalSettings();

  const pageLinks = [
    {
      path: AppRoute.EsiJaPerusopetus,
      text: intl.formatMessage(education.preAndBasicEducation)
    },
    {
      path: AppRoute.Lukiokoulutus,
      text: intl.formatMessage(education.highSchoolEducation)
    },
    {
      path: AppRoute.AmmatillinenKoulutus,
      text: intl.formatMessage(education.vocationalEducation)
    },
    {
      path: AppRoute.VapaaSivistystyo,
      text: intl.formatMessage(education.vstEducation)
    },
    { path: AppRoute.Tilastot, text: intl.formatMessage(common.statistics) }
  ];

  const authenticationLink = useMemo(() => {
    return {
      text: !user
        ? [intl.formatMessage(authMessages.logIn)]
        : [intl.formatMessage(authMessages.logOut), user.username],
      path: !user ? "/cas-auth" : "/cas-logout"
    };
  }, [intl, user]);

  const onLoginButtonClick = useCallback(() => history.push("/cas-auth"), []);

  const onMenuClick = useCallback(
    () => setSideMenuVisibility(isVisible => !isVisible),
    []
  );
  console.info("hasd");
  const onSessionDialogLogout = useCallback(() => {
    onLogout();
    history.push("/cas-logout");
  }, [onLogout]);

  const organisationLink = useMemo(() => {
    if (user && user.oid && organisation) {
      const orgNimi = user && organisation ? R.prop("nimi", organisation) : "";
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
            `/ammatillinenkoulutus/koulutuksenjarjestajat/${R.prop(
              "ytunnus",
              organisation
            )}/jarjestamislupa`,
            result
          );
    }
    return {};
  }, [intl, organisation, user]);

  const shortDescription = {
    text: intl.formatMessage(common.siteShortDescription),
    path: "/"
  };

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
      return (
        <Header
          inFinnish={"FI"}
          inSwedish={"SV"}
          isAuthenticated={!!user}
          locale={intl.locale}
          localesByLang={localesByLang}
          logIn={intl.formatMessage(authMessages.logIn)}
          logo={logo}
          authenticationLink={authenticationLink}
          onLoginButtonClick={onLoginButtonClick}
          onMenuClick={onMenuClick}
          organisationLink={organisationLink}
          shortDescription={shortDescription}
          template={template}
          languageSelectionAriaLabel={intl.formatMessage(
            langMessages.selection
          )}
        ></Header>
      );
    },
    [
      authenticationLink,
      intl,
      localesByLang,
      onLoginButtonClick,
      onMenuClick,
      organisationLink,
      shortDescription,
      user
    ]
  );

  return (
    <React.Fragment>
      <ToastContainer />
      <Router history={history}>
        <div
          className={`relative lg:fixed z-50 ${
            appState.isDebugModeOn ? "w-2/3" : "w-full"
          }`}
        >
          {getHeader()}

          <div className="hidden md:block">
            <Navigation links={pageLinks}></Navigation>
          </div>
        </div>

        <SideNavigation
          isVisible={isSideMenuVisible}
          handleDrawerToggle={isVisible => {
            setSideMenuVisibility(isVisible);
          }}
        >
          {getHeader("C")}

          <div className="p-4 max-w-xl">
            <Navigation
              direction="vertical"
              links={pageLinks}
              theme={{
                backgroundColor: "white",
                color: "black",
                hoverColor: "white"
              }}
            ></Navigation>
          </div>
        </SideNavigation>

        <div className="flex flex-col min-h-screen bg-white">
          <SkipNavLink>{intl.formatMessage(common.jumpToContent)}</SkipNavLink>
          <div className="flex flex-1 flex-col justify-between md:mt-0 lg:mt-32">
            <div className="flex flex-col flex-1 bg-white">
              <SkipNavContent />
              <div>
                <header>
                  <nav>
                    <Navigation />
                    <LanguageSwitcher localesByLang={localesByLang} />
                  </nav>
                </header>
                <main>{children}</main>
              </div>
              {/* <main className="flex-1 flex flex-col"> */}
              {/* <LanguageSwitcher localesByLang={localesByLang} />
                {children} */}
              {/* <LocalizedSwitch>
                  <Route
                    exact
                    path={AppRoute.Home}
                    render={() => <Home koulutusmuodot={koulutusmuodot} />}
                  />
                  <Route exact path={AppRoute.LogOut} component={Logout} />
                  <Route exact path={AppRoute.LogIn} component={Login} />
                  <Route exact path={AppRoute.Tilastot} component={Tilastot} />
                  <Route
                    exact
                    path={AppRoute.CasAuth}
                    component={RequireCasAuth}
                  />
                  <Route
                    exact
                    path={AppRoute.CasLogOut}
                    component={DestroyCasAuth}
                  />
                  {!!organisation && (
                    <Route
                      exact
                      path={AppRoute.CasReady}
                      render={() => (
                        <CasAuthenticated organisation={organisation} />
                      )}
                    />
                  )}
                  <Route
                    exact
                    path={AppRoute.AmmatillinenKoulutus}
                    render={() => (
                      <AmmatillinenKoulutus
                        koulutusmuoto={koulutusmuodot.ammatillinenKoulutus}
                      />
                    )}
                  />
                  <Route
                    exact
                    path={AppRoute.EsiJaPerusopetus}
                    render={() => (
                      <EsiJaPerusopetus
                        koulutusmuoto={koulutusmuodot.esiJaPerusopetus}
                      />
                    )}
                  />
                  <Route
                    exact
                    path={AppRoute.Lukiokoulutus}
                    render={() => (
                      <Lukiokoulutus
                        koulutusmuoto={koulutusmuodot.lukiokoulutus}
                      />
                    )}
                  />
                  <Route
                    exact
                    path={AppRoute.VapaaSivistystyo}
                    render={() => (
                      <VapaaSivistystyo
                        koulutusmuoto={koulutusmuodot.vapaaSivistystyo}
                      />
                    )}
                  />
                  <Route
                    exact
                    path={AppRoute.Saavutettavuusseloste}
                    render={() => (
                      <Saavutettavuusseloste locale={intl.locale} />
                    )}
                  />
                  <Route
                    exact
                    path={AppRoute.Tietosuojailmoitus}
                    render={() => <Tietosuojailmoitus locale={intl.locale} />}
                  />
                  <Route
                    exact
                    path={AppRoute.Yhteydenotto}
                    render={() => <Yhteydenotto locale={intl.locale} />}
                  />
                  <Route path="*">
                    <views.GeneralError />
                  </Route>
                </LocalizedSwitch> */}
              {/* </main> */}
            </div>
          </div>
          <footer>
            <Footer />
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
  localesByLang: PropTypes.object,
  onLogout: PropTypes.func,
  onSessionDialogOK: PropTypes.func
};

App.displayName = "App";

export default App;
