import React, { useContext, useMemo, useEffect } from "react";
import { IntlProvider } from "react-intl";
import translations from "./i18n/locales";
import { AppContext } from "./context/appContext";
import { defaults } from "react-sweet-state";
import { loadProgressBar } from "axios-progress-bar";
import { useUser } from "./stores/user";
import App from "./App";

import "axios-progress-bar/dist/nprogress.css";

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
  const [user, actions] = useUser();

  const { state } = useContext(AppContext);

  useEffect(() => {
    // Let's fetch the current user from backend
    const abortController = actions.load();
    return function cancel() {
      abortController.abort();
    };
  }, [actions]);

  const messages = useMemo(() => {
    return translations[state.locale];
  }, [state]);

  return (
    <IntlProvider locale={state.locale} key={state.locale} messages={messages}>
      {user.fetchedAt && <App user={user.data} />}
    </IntlProvider>
  );
};

export default AppWrapper;
