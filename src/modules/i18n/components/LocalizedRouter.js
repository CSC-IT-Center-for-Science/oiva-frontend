import React from "react";
import { IntlProvider } from "react-intl";
import { Route, Redirect } from "react-router-dom";
import { AppLanguage } from "const";
import { isEmpty } from "ramda";

export const LocalizedRouter = ({
  children,
  RouterComponent,
  localesByLang = {},
  defaultLanguage
}) => {
  console.info("Routeriiin...", localesByLang);
  return !isEmpty(localesByLang) ? (
    <RouterComponent>
      <Route path="/:lang([a-z]{2})">
        {({ match, location }) => {
          console.info(match, location);
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

          console.info(lang);

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
