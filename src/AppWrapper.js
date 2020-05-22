import React, { useMemo, useEffect } from "react";
import { IntlProvider } from "react-intl";
import translations from "./i18n/locales";
import { defaults } from "react-sweet-state";
import { loadProgressBar } from "axios-progress-bar";
import { useUser } from "./stores/user";
import App from "./App";

import "axios-progress-bar/dist/nprogress.css";
import { useKaannokset } from "./stores/localizations";
import { useGlobalSettings } from "./stores/appStore";

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
  const [kaannokset, kaannoksetActions] = useKaannokset();
  // See the file: .env.development.local
  const isBackendTheSourceOfLocalizations =
    process.env.REACT_APP_FETCH_LOCALICATIONS_FROM_BACKEND === "true";

  const [user, actions] = useUser();
  const [state] = useGlobalSettings();

  useEffect(() => {
    // Let's fetch the current user from backend
    const abortController = actions.load();
    return function cancel() {
      abortController.abort();
    };
  }, [actions]);

  useEffect(() => {
    if (isBackendTheSourceOfLocalizations) {
      const abortController = kaannoksetActions.load(state.locale);
      return function cancel() {
        if (abortController) {
          abortController.abort();
        }
      };
    } else {
    }
  }, [isBackendTheSourceOfLocalizations, kaannoksetActions, state.locale]);

  const messages = useMemo(() => {
    return isBackendTheSourceOfLocalizations && kaannokset.length
      ? kaannokset
      : translations[state.locale];
  }, [isBackendTheSourceOfLocalizations, kaannokset, state]);

  const appStructure = useMemo(() => {
    return state.isDebugModeOn ? (
      user.fetchedAt ? (
        <div className="flex">
          <div
            id="cy"
            className="z-50 r-0 t-0 bg-gray-100 w-1/3 h-auto border border-black"
            style={{ zIndex: 9000 }}></div>
          <div className="w-2/3 relative">{<App />}</div>
        </div>
      ) : null
    ) : (
      user.fetchedAt && <App />
    );
  }, [state.isDebugModeOn, user.fetchedAt]);

  if (appStructure && state.locale && messages) {
    return (
      // Key has been set to ensure the providers's refresh when locale changes.
      <IntlProvider
        key={state.locale}
        locale={state.locale}
        messages={messages}>
        {appStructure}
      </IntlProvider>
    );
  } else {
    return null;
  }
};

export default AppWrapper;
