import React, { useMemo, useEffect, useState, useCallback } from "react";
import { defaults } from "react-sweet-state";
import { loadProgressBar } from "axios-progress-bar";
import { useUser } from "./stores/user";
import App from "./App";
import "axios-progress-bar/dist/nprogress.css";
import { useGlobalSettings } from "./stores/appStore";
import { useIdleTimer } from "react-idle-timer";
import { BrowserRouter } from "react-router-dom";
import { sessionTimeoutInMinutes } from "modules/constants";
import { AppLanguage } from "const";
import { getRaw } from "basedata";
import { backendRoutes } from "stores/utils/backendRoutes";
import translations from "i18n/locales";
import { isEmpty } from "ramda";
import { setLocalizations } from "services/lomakkeet/i18n-config";
// import localforage from "localforage";
import { Route, Redirect } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { LocalizedRouter } from "modules/i18n";

defaults.devtools = true;

loadProgressBar();

if (!Intl.PluralRules) {
  require("@formatjs/intl-pluralrules/polyfill");
  require("@formatjs/intl-pluralrules/dist/locale-data/fi"); // Add locale data for fi
}

if (!Intl.RelativeTimeFormat) {
  require("@formatjs/intl-relativetimeformat/polyfill");
  require("@formatjs/intl-relativetimeformat/dist/locale-data/sv"); // Add locale data for sv
}

/**
 * The first thing to get the application running is to fetch the authenticated user.
 * Authentication is not required in every part of the app so even if there isn't an
 * authenticated user the basic structures of the app is shown.
 */
const AppWrapper = () => {
  const [user, userActions] = useUser();
  const [{ isDebugModeOn }] = useGlobalSettings();
  const [isSessionDialogVisible, setSessionDialogVisible] = useState(false);

  // See the file: .env.development.local
  const isBackendTheSourceOfLocalizations = !process.env.USE_LOCAL_TRANSLATIONS;

  const [messages, setMessages] = useState();

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
    if (!isEmpty(messages)) {
      setLocalizations(messages);
    }
  }, [messages]);

  const handleOnIdle = event => {
    setSessionDialogVisible(true);
  };
  console.info("asfd");
  useIdleTimer({
    timeout: (sessionTimeoutInMinutes / 2) * 60 * 1000, // unit: ms
    onIdle: handleOnIdle,
    debounce: 500
  });

  useEffect(() => {
    // Let's fetch the current user from backend
    const abortController = userActions.load();
    return function cancel() {
      abortController.abort();
    };
  }, [userActions]);

  const onSessionDialogOK = useCallback(() => {
    setSessionDialogVisible(false);
  }, []);

  const appStructure = useMemo(() => {
    if (user.fetchedAt && !isEmpty(messages)) {
      return isDebugModeOn ? (
        user.fetchedAt ? (
          <div className="flex">
            <div
              id="cy"
              className="z-50 r-0 t-0 bg-gray-100 w-1/3 h-auto border border-black"
              style={{ zIndex: 9000 }}
            ></div>
            <div className="w-2/3 relative">
              {
                <App
                  isSessionDialogVisible={isSessionDialogVisible}
                  localesByLang={messages}
                  onLogout={onSessionDialogOK}
                  onSessionDialogOK={onSessionDialogOK}
                />
              }
            </div>
          </div>
        ) : null
      ) : !!user.fetchedAt ? (
        <App
          isSessionDialogVisible={isSessionDialogVisible}
          localesByLang={messages}
          onLogout={onSessionDialogOK}
          onSessionDialogOK={onSessionDialogOK}
        />
      ) : null;
    }
    return null;
  }, [
    isSessionDialogVisible,
    messages,
    onSessionDialogOK,
    isDebugModeOn,
    user.fetchedAt
  ]);

  return (
    <LocalizedRouter
      languages={AppLanguage}
      localesByLang={messages}
      RouterComponent={BrowserRouter}
    >
      {/* {isDebugModeOn ? (
          user.fetchedAt ? (
            <div className="flex">
              <div
                id="cy"
                className="z-50 r-0 t-0 bg-gray-100 w-1/3 h-auto border border-black"
                style={{ zIndex: 9000 }}
              ></div>
              <div className="w-2/3 relative">
                {
                  <App
                    isSessionDialogVisible={isSessionDialogVisible}
                    localesByLang={messages}
                    onLogout={onSessionDialogOK}
                    onSessionDialogOK={onSessionDialogOK}
                  />
                }
              </div>
            </div>
          ) : null
      ) : !!user.fetchedAt ? ( */}
      <App
        isSessionDialogVisible={isSessionDialogVisible}
        localesByLang={messages}
        onLogout={onSessionDialogOK}
        onSessionDialogOK={onSessionDialogOK}
      />
    </LocalizedRouter>

    // <BrowserRouter>
    //   <Route path="/:lang([a-z]{2})">
    //     {({ match, location }) => {
    //       /**
    //        * Selvitetään nykyinen kieli.
    //        * Jos urlissa ei ole kieliasetusta, käytetään kieltä fi.
    //        */
    //       const params = match ? match.params : {};
    //       const { lang = AppLanguage.Finnish } = params;

    //       /**
    //        * If language is not in route path, redirect to language root
    //        */
    //       const { pathname } = location;
    //       if (!pathname.includes(`/${lang}/`)) {
    //         return <Redirect to={`/${lang}/`} />;
    //       }

    //       console.info(messages, lang);

    //       /**
    //        * Return Intl provider with default language set
    //        */
    //       return (
    //         <IntlProvider locale={lang} messages={messages[lang]}>
    //           {appStructure}
    //         </IntlProvider>
    //       );
    //     }}
    //   </Route>
    // </BrowserRouter>
  );
};

export default AppWrapper;
