import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Route, Router, Switch } from "react-router-dom";
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
import Navigation from "./components/02-organisms/Navigation";
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

import * as R from "ramda";

import "react-toastify/dist/ReactToastify.css";

const history = createBrowserHistory();

const logo = { text: "Oiva", path: "/" };

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
const App = ({ isSessionDialogVisible, onLogout, onSessionDialogOK }) => {
  const intl = useIntl();
  const [userState] = useUser();

  const { data: user } = userState;

  const [organisation, setOrganisation] = useState();

  const koulutusmuodot = useMemo(
    () => ({
      ...constants.koulutusmuodot,
      ammatillinenKoulutus: {
        ...constants.koulutusmuodot.ammatillinenKoulutus,
        genetiivi: intl.formatMessage(ammatillinenKoulutus.genetiivi),
        kortinOtsikko: intl.formatMessage(education.vocationalEducation),
        kuvausteksti: intl.formatMessage(ammatillinenKoulutus.kuvausteksti),
        lyhytKuvaus: intl.formatMessage(ammatillinenKoulutus.lyhytKuvaus),
        paasivunOtsikko: intl.formatMessage(education.vocationalEducation),
        jarjestajatOtsikko: intl.formatMessage(education.koulutuksenJarjestajat)
      },
      esiJaPerusopetus: {
        ...constants.koulutusmuodot.esiJaPerusopetus,
        genetiivi: intl.formatMessage(esiJaPerusopetus.genetiivi),
        kortinOtsikko: intl.formatMessage(education.preAndBasicEducation),
        kuvausteksti: intl.formatMessage(esiJaPerusopetus.kuvausteksti),
        lyhytKuvaus: intl.formatMessage(esiJaPerusopetus.lyhytKuvaus),
        paasivunOtsikko: intl.formatMessage(education.preAndBasicEducation),
        jarjestajatOtsikko: intl.formatMessage(education.opetuksenJarjestajat)
      },
      lukiokoulutus: {
        ...constants.koulutusmuodot.lukiokoulutus,
        genetiivi: intl.formatMessage(lukiokoulutus.genetiivi),
        kortinOtsikko: intl.formatMessage(education.highSchoolEducation),
        kuvausteksti: intl.formatMessage(lukiokoulutus.kuvausteksti),
        lyhytKuvaus: intl.formatMessage(lukiokoulutus.lyhytKuvaus),
        paasivunOtsikko: intl.formatMessage(education.highSchoolEducation),
        jarjestajatOtsikko: intl.formatMessage(education.koulutuksenJarjestajat)
      },
      vapaaSivistystyo: {
        ...constants.koulutusmuodot.vapaaSivistystyo,
        genetiivi: intl.formatMessage(vapaaSivistystyo.genetiivi),
        kortinOtsikko: intl.formatMessage(education.vstEducation),
        kuvausteksti: intl.formatMessage(vapaaSivistystyo.kuvausteksti),
        lyhytKuvaus: intl.formatMessage(vapaaSivistystyo.lyhytKuvaus),
        paasivunOtsikko: intl.formatMessage(common.vstTitleName),
        jarjestajatOtsikko: intl.formatMessage(
          education.oppilaitostenYllapitajat
        )
      }
    }),
    [intl]
  );

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

  const [appState, appActions] = useGlobalSettings();

  const pageLinks = [
    {
      path: "/esi-ja-perusopetus",
      text: intl.formatMessage(education.preAndBasicEducation)
    },
    {
      path: "/lukiokoulutus",
      text: intl.formatMessage(education.highSchoolEducation)
    },
    {
      path: "/ammatillinenkoulutus",
      text: intl.formatMessage(education.vocationalEducation)
    },
    {
      path: "/vapaa-sivistystyo",
      text: intl.formatMessage(education.vstEducation)
    },
    { path: "/tilastot", text: intl.formatMessage(common.statistics) }
  ];

  const authenticationLink = useMemo(() => {
    return {
      text: !user
        ? [intl.formatMessage(authMessages.logIn)]
        : [intl.formatMessage(authMessages.logOut), user.username],
      path: !user ? "/cas-auth" : "/cas-logout"
    };
  }, [intl, user]);

  const onLocaleChange = useCallback(
    locale => {
      appActions.setLocale(locale);
      if (locale) {
        sessionStorage.setItem("locale", locale);
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
      if (appState.locale) {
        return (
          <Header
            inFinnish={"FI"}
            inSwedish={"SV"}
            isAuthenticated={!!user}
            locale={appState.locale}
            logIn={intl.formatMessage(authMessages.logIn)}
            logo={logo}
            authenticationLink={authenticationLink}
            onLocaleChange={onLocaleChange}
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
      }
      return null;
    },
    [
      appState.locale,
      authenticationLink,
      intl,
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
              <main className="flex-1 flex flex-col">
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => <Home koulutusmuodot={koulutusmuodot} />}
                  />
                  <Route path="/logout" component={Logout} />
                  <Route path="/kirjaudu" component={Login} />
                  <Route exact path="/tilastot" component={Tilastot} />
                  <Route path="/cas-auth" component={RequireCasAuth} />
                  <Route path="/cas-logout" component={DestroyCasAuth} />
                  {!!organisation && (
                    <Route
                      path="/cas-ready"
                      render={() => (
                        <CasAuthenticated organisation={organisation} />
                      )}
                    />
                  )}
                  <Route
                    path="/ammatillinenkoulutus"
                    render={() => (
                      <AmmatillinenKoulutus
                        koulutusmuoto={koulutusmuodot.ammatillinenKoulutus}
                      />
                    )}
                  />
                  <Route
                    path="/esi-ja-perusopetus"
                    render={() => (
                      <EsiJaPerusopetus
                        koulutusmuoto={koulutusmuodot.esiJaPerusopetus}
                      />
                    )}
                  />
                  <Route
                    path="/lukiokoulutus"
                    render={() => (
                      <Lukiokoulutus
                        koulutusmuoto={koulutusmuodot.lukiokoulutus}
                      />
                    )}
                  />
                  <Route
                    path="/vapaa-sivistystyo"
                    render={() => (
                      <VapaaSivistystyo
                        koulutusmuoto={koulutusmuodot.vapaaSivistystyo}
                      />
                    )}
                  />
                  <Route
                    path="/saavutettavuusseloste"
                    render={() => (
                      <Saavutettavuusseloste locale={intl.locale} />
                    )}
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
  onLogout: PropTypes.func,
  onSessionDialogOK: PropTypes.func
};

App.displayName = "App";

export default App;
