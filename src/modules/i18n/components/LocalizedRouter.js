import React from "react";
import { IntlProvider } from "react-intl";
import { Route, Redirect } from "react-router-dom";
import { AppLanguage } from "const";
import { isEmpty } from "ramda";
import { CAS_BASE_URL } from "modules/constants";
import Login from "scenes/Login/Login";
import { AppRoute } from "const/index";
import RequireCasAuth from "scenes/Login/services/RequireCasAuth";

export const LocalizedRouter = ({
  children,
  RouterComponent,
  localesByLang = {},
  defaultLanguage
}) => {
  return !isEmpty(localesByLang) ? (
    <RouterComponent>
      <Route path="/cas-auth" component={RequireCasAuth} />
      <Route path="/:lang([a-z]{2})">
        {({ match, location }) => {
          /**
           * Get current language
           * Set default locale to en if base path is used without a language
           */
          const params = match ? match.params : {};
          const { lang = defaultLanguage || AppLanguage.Finnish } = params;

          /**
           * If language is not in route path, redirect to language root
           */
          const { pathname } = location;
          if (!pathname.includes(`/${lang}/`)) {
            return <Redirect to={`/${lang}/`} />;
          }

          /**
           * Return Intl provider with default language set
           */
          return (
            <IntlProvider
              otherKey={lang}
              locale={lang}
              messages={localesByLang[lang]}
            >
              {children}
            </IntlProvider>
          );
        }}
      </Route>
    </RouterComponent>
  ) : (
    <div>Ladataan käännöksiä...</div>
  );
};
