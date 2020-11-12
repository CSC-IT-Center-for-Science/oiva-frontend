import React, { useMemo, useEffect, useState, useCallback } from "react";
import { IntlProvider } from "react-intl";
import translations from "./i18n/locales";
import { defaults } from "react-sweet-state";
import { loadProgressBar } from "axios-progress-bar";
import { useUser } from "./stores/user";
import App from "./App";
import "axios-progress-bar/dist/nprogress.css";
import { useGlobalSettings } from "./stores/appStore";
import { setLocalizations } from "services/lomakkeet/i18n-config";
import { useIdleTimer } from "react-idle-timer";
import { isEmpty } from "ramda";
import { sessionTimeoutInMinutes } from "modules/constants";
import { backendRoutes } from "stores/utils/backendRoutes";
import { getRaw } from "./basedata";

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
  // See the file: .env.development.local
  const isBackendTheSourceOfLocalizations = !process.env.USE_LOCAL_TRANSLATIONS;
  const [user, userActions] = useUser();
  const [state] = useGlobalSettings();
  const [isSessionDialogVisible, setSessionDialogVisible] = useState(false);
  const [messages, setMessages] = useState();

  const handleOnIdle = event => {
    setSessionDialogVisible(true);
  };

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

  useEffect(() => {
    if (isBackendTheSourceOfLocalizations) {
      getRaw("lokalisaatio", backendRoutes.kaannokset.path, []).then(result => {
        setMessages(result || translations);
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

  const onSessionDialogOK = useCallback(() => {
    setSessionDialogVisible(false);
  }, []);

  const appStructure = useMemo(() => {
    if (user.fetchedAt) {
      return state.isDebugModeOn ? (
        user.fetchedAt ? (
          <div className="flex">
            <div
              id="cy"
              className="z-50 r-0 t-0 bg-gray-100 w-1/3 h-auto border border-black"
              style={{ zIndex: 9000 }}></div>
            <div className="w-2/3 relative">
              {
                <App
                  isSessionDialogVisible={isSessionDialogVisible}
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
          onLogout={onSessionDialogOK}
          onSessionDialogOK={onSessionDialogOK}
        />
      ) : null;
    }
    return null;
  }, [
    isSessionDialogVisible,
    onSessionDialogOK,
    state.isDebugModeOn,
    user.fetchedAt
  ]);

  if (appStructure && messages && state.locale && user.fetchedAt) {
    return (
      // Key has been set to ensure the providers's refresh when locale changes.
      <IntlProvider
        otherKey={state.locale}
        locale={state.locale}
        messages={messages[state.locale]}>
        {appStructure}
      </IntlProvider>
    );
  } else {
    return null;
  }
};

export default AppWrapper;
