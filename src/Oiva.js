import React, { useEffect, useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { AppRoute, AppLanguage } from "const";
import { LocalizedRouter, LocalizedSwitch } from "modules/i18n/index";
import Home from "scenes/Home/index";
import { useGlobalSettings } from "stores/appStore";
import { getRaw } from "basedata";
import { backendRoutes } from "stores/utils/backendRoutes";
import translations from "i18n/locales";
import { AppLayout } from "modules/layout";
import Tilastot from "scenes/Tilastot/components/index";
import JarjestamisJaYllapitamisluvat from "scenes/JarjestamisJaYllapitamisluvat/index";
import Login from "scenes/Login/Login";
import Logout from "scenes/Logout/Logout";
import DestroyCasAuth from "scenes/Logout/services/DestroyCasAuth";
import RequireCasAuth from "scenes/Login/services/RequireCasAuth";
import CasAuthenticated from "scenes/CasAuthenticated/CasAuthenticated";

import { useUser } from "stores/user";

export const Oiva = () => {
  const [{ isDebugModeOn }] = useGlobalSettings();
  const [isSessionDialogVisible, setSessionDialogVisible] = useState(false);

  // See the file: .env.development.local
  const isBackendTheSourceOfLocalizations = !process.env.USE_LOCAL_TRANSLATIONS;

  const [messages, setMessages] = useState();

  const [userState, userActions] = useUser();

  const { data: user } = userState;

  const [organisation, setOrganisation] = useState();

  useEffect(() => {
    if (isBackendTheSourceOfLocalizations) {
      getRaw("lokalisaatio", backendRoutes.kaannokset.path, []).then(result => {
        const combinedMessages = Object.assign({}, result, translations);
        setMessages(combinedMessages);
        // localforage.setItem("lokalisaatio", combinedMessages).then(result => {
        // });
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
    // Let's fetch the current user from backend
    const abortController = userActions.load();
    return function cancel() {
      abortController.abort();
    };
  }, [userActions]);

  console.info(organisation, user);

  return (
    <LocalizedRouter
      RouterComponent={BrowserRouter}
      languages={AppLanguage}
      localesByLang={messages}
    >
      <AppLayout
        localesByLang={messages}
        organisation={organisation}
        user={user}
      >
        <LocalizedSwitch>
          <Route exact path={AppRoute.LogIn} component={Login} />
          <Route exact path={AppRoute.LogOut} component={Logout} />
          <Route exact path={AppRoute.CasAuth} component={RequireCasAuth} />
          <Route exact path={AppRoute.CasLogOut} component={DestroyCasAuth} />
          {!!organisation && (
            <Route
              exact
              path={AppRoute.CasReady}
              render={() => (
                <CasAuthenticated organisation={organisation} user={user} />
              )}
            />
          )}
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
          <Route path="*">
            <div>Error view</div>
          </Route>
        </LocalizedSwitch>
      </AppLayout>
    </LocalizedRouter>
  );
};
