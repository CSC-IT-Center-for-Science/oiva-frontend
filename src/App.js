import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback
} from "react";
import { Route, Router, Switch } from "react-router-dom";
import Login from "scenes/Login/Login";
import PropTypes from "prop-types";
import Logout from "scenes/Logout/Logout";
import Footer from "scenes/Footer/Footer";
import Jarjestajat from "./scenes/Jarjestajat/Jarjestajat";
import { COLORS } from "./modules/styles";
import Home from "scenes/Home";
import CasAuthenticated from "scenes/CasAuthenticated/CasAuthenticated";
import Tilastot from "./scenes/Tilastot/components/Tilastot";
import RequireCasAuth from "./scenes/Login/services/RequireCasAuth";
import DestroyCasAuth from "./scenes/Logout/services/DestroyCasAuth";
import Lukiokoulutus from "./scenes/Lukiokoulutus/components/Lukiokoulutus";
import { Breadcrumbs } from "react-breadcrumbs-dynamic";
import EsiJaPerusopetus from "./scenes/EsiJaPerusopetus/components/EsiJaPerusopetus";
import VapaaSivistystyo from "./scenes/VapaaSivistystyo/components/VapaaSivistystyo";
import JarjestajaSwitch from "./scenes/Jarjestajat/Jarjestaja/components/JarjestajaSwitch";
import { NavLink } from "react-dom";
import { createBrowserHistory } from "history";
import authMessages from "./i18n/definitions/auth";
import { useIntl } from "react-intl";
import commonMessages from "./i18n/definitions/common";
import educationMessages from "./i18n/definitions/education";
import langMessages from "./i18n/definitions/languages";
import { ToastContainer } from "react-toastify";
import ReactResizeDetector from "react-resize-detector";
import {
  ROLE_ESITTELIJA,
  ROLE_KATSELIJA,
  ROLE_MUOKKAAJA,
  ROLE_NIMENKIRJOITTAJA,
  ROLE_YLLAPITAJA
} from "./modules/constants";
import Header from "./components/02-organisms/Header";
import { setLocale } from "./services/app/actions";
import { AppContext } from "./context/appContext";
import Navigation from "./components/02-organisms/Navigation";
import SideNavigation from "./components/02-organisms/SideNavigation";
import { useOrganisation } from "./stores/organisation";
import * as R from "ramda";

const history = createBrowserHistory();

const logo = { text: "Oiva", path: "/" };

/**
 * App component forms the basic structure of the application and its routing.
 *
 * @param {props} - Properties object.
 */
const App = ({ user }) => {
  const intl = useIntl();

  const [organisation, organisationActions] = useOrganisation();

  const [isSideMenuVisible, setSideMenuVisibility] = useState(false);

  const { state: appState, dispatch: appDispatch } = useContext(AppContext);

  const [headerHeight, setHeaderHeight] = useState(0);

  const pageLinks = [
    {
      path: "/esi-ja-perusopetus",
      text: intl.formatMessage(educationMessages.preAndBasicEducation),
      isExact: false
    },
    {
      path: "/lukiokoulutus",
      text: intl.formatMessage(educationMessages.highSchoolEducation)
    },
    {
      path: "/jarjestajat",
      text: intl.formatMessage(educationMessages.vocationalEducation)
    },
    { path: "/vapaa-sivistystyo", text: "Vapaa sivistystyö" },
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
      setLocale(props[1])(appDispatch);
      if (props[1]) {
        sessionStorage.setItem("locale", props[1]);
      } else {
        sessionStorage.removeItem("locale");
      }
    },
    [appDispatch]
  );

  const onLoginButtonClick = useCallback(() => history.push("/cas-auth"), []);

  const onMenuClick = useCallback(
    () => setSideMenuVisibility(isVisible => !isVisible),
    []
  );

  const organisationLink = useMemo(() => {
    return {
      text: R.path(["nimi", intl.locale], organisation.data),
      path: `/jarjestajat/${R.prop(
        "ytunnus",
        organisation.data
      )}/jarjestamislupa-asia`
    };
  }, [intl, organisation.data]);

  const shortDescription = useMemo(() => {
    return {
      text: intl.formatMessage(commonMessages.siteShortDescription),
      path: "/"
    };
  }, [intl]);

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

  const onHeaderResize = (width, height) => {
    setHeaderHeight(height);
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
      if (
        (appDispatch,
        appState.locale && intl && (!user || !organisation.isLoding))
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
            template={template}></Header>
        );
      }
      return null;
    },
    [
      appDispatch,
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
          <div className="fixed z-50 w-full">
            <ReactResizeDetector handleHeight onResize={onHeaderResize} />
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

          <main
            className="flex flex-1 flex-col justify-between"
            style={{ marginTop: headerHeight }}>
            <div className="flex flex-col flex-1 bg-white">
              <div className="pb-16 pt-8 mx-auto w-11/12 lg:w-3/4">
                <Breadcrumbs
                  separator={<b> / </b>}
                  item={NavLink}
                  finalItem={"b"}
                  finalProps={{
                    style: {
                      color: COLORS.BLACK
                    }
                  }}
                />
              </div>
              <div className="flex-1 flex flex-col">
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
                    render={props => <Jarjestajat history={props.history} />}
                  />
                  <Route
                    exact
                    path="/lukiokoulutus"
                    component={Lukiokoulutus}
                  />
                  <Route
                    exact
                    path="/vapaa-sivistystyo"
                    component={VapaaSivistystyo}
                  />
                  <Route
                    exact
                    path="/esi-ja-perusopetus"
                    component={EsiJaPerusopetus}
                  />
                  <Route
                    path="/jarjestajat/:ytunnus"
                    render={props => (
                      <JarjestajaSwitch
                        history={props.history}
                        path={props.match.path}
                        ytunnus={props.match.params.ytunnus}
                        user={user}
                      />
                    )}
                  />
                </Switch>
              </div>
            </div>
          </main>
          <footer>
            <Footer
            // props={props}
            />
            <ToastContainer />
          </footer>
        </div>
      </Router>
      }
    </React.Fragment>
  );
};

App.propTypes = {
  user: PropTypes.object
};

export default App;
