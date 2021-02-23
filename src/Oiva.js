import React, { useEffect, useState } from "react";
import { BrowserRouter, Redirect, Route } from "react-router-dom";
import { AppRoute, AppLanguage } from "const";
import { LocalizedRouter, LocalizedSwitch } from "modules/i18n/index";
import Home from "scenes/Home/index";
import { getRaw } from "basedata";
import { backendRoutes } from "stores/utils/backendRoutes";
import translations from "i18n/locales";
import { AppLayout } from "modules/layout";
import Tilastot from "scenes/Tilastot/components/index";
import JarjestamisJaYllapitamisluvat from "scenes/JarjestamisJaYllapitamisluvat/index";
import { useUser } from "stores/user";
import {
  ROLE_ESITTELIJA,
  ROLE_KATSELIJA,
  ROLE_MUOKKAAJA,
  ROLE_NIMENKIRJOITTAJA,
  ROLE_YLLAPITAJA
} from "modules/constants";
import { indexOf, isEmpty, mergeDeepRight } from "ramda";
import { setLocalizations } from "services/lomakkeet/i18n-config";
import AuthWithLocale from "AuthWithLocale";
import CasAuthenticated from "scenes/CasAuthenticated/CasAuthenticated";
import LogOutWithLocale from "LogOutWithLocale";
import Logout from "scenes/Logout/Logout";
import { defaults } from "react-sweet-state";
import Tietosuojailmoitus from "./scenes/Tietosuojailmoitus";
import Yhteydenotto from "./scenes/Yhteydenotto";
import Saavutettavuusseloste from "./scenes/Saavutettavuusseloste";

defaults.devtools = true;

export const Oiva = () => {
  // See the file: .env.development.local
  const isBackendTheSourceOfLocalizations = !process.env.USE_LOCAL_TRANSLATIONS;

  const [messages, setMessages] = useState();

  const [userState, userActions] = useUser();

  const { data: user } = userState;

  const [organisation, setOrganisation] = useState();

  useEffect(() => {
    if (isBackendTheSourceOfLocalizations) {
      getRaw("lokalisaatio", backendRoutes.kaannokset.path, []).then(result => {
        // Reititykseen liittyvät käännökset hoidetaan lokaalisti.
        const combinedMessages = mergeDeepRight(translations, result);
        setMessages(combinedMessages);
      });
    } else {
      setMessages(translations);
    }
  }, [isBackendTheSourceOfLocalizations]);

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

  useEffect(() => {
    if (!isEmpty(messages)) {
      setLocalizations(messages);
    }
  }, [messages]);

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
      ].find(role => indexOf(role, user.roles) > -1);
      sessionStorage.setItem("role", role || "");
    }
  }, [user]);

  useEffect(() => {
    // Let's fetch the current user from backend
    const abortController = userActions.load();
    return function cancel() {
      abortController.abort();
    };
  }, [userActions]);

  return (
    <LocalizedRouter
      languages={AppLanguage}
      localesByLang={messages}
      RouterComponent={BrowserRouter}
    >
      <AppLayout
        localesByLang={messages}
        organisation={organisation}
        user={user}
      >
        <LocalizedSwitch>
          <Route exact path={AppRoute.CasAuth} component={AuthWithLocale} />
          <Route exact path={AppRoute.CasLogOut} component={LogOutWithLocale} />
          <Route exact path={AppRoute.LogOut} component={Logout} />
          <Route
            exact
            path={AppRoute.CasReady}
            render={() => (
              <CasAuthenticated organisation={organisation} user={user} />
            )}
          />
          <Route exact path={AppRoute.Home}>
            <Home />
          </Route>
          <Route path={AppRoute.JarjestamisJaYllapitamisluvat}>
            <JarjestamisJaYllapitamisluvat
              localesByLang={messages}
              organisation={organisation}
            />
          </Route>
          <Route exact path={AppRoute.Tilastot}>
            <Tilastot />
          </Route>
          <Route path={AppRoute.Tietosuojailmoitus}>
            <Tietosuojailmoitus />
          </Route>
          <Route path={AppRoute.Yhteydenotto}>
            <Yhteydenotto />
          </Route>
          <Route path={AppRoute.Saavutettavuusseloste}>
            <Saavutettavuusseloste />
          </Route>

          <Route path="*">
            <Redirect to={"/"} />
          </Route>
        </LocalizedSwitch>
      </AppLayout>
    </LocalizedRouter>
  );
};
