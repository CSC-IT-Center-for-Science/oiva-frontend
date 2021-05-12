import React from "react";
import { IntlProvider } from "react-intl";
import { Route, Redirect } from "react-router-dom";
import { AppLanguage } from "const";
import { isEmpty } from "ramda";
import Login from "scenes/Login/Login";
import DestroyCasAuth from "scenes/Logout/services/DestroyCasAuth";
import RequireCasAuth from "scenes/Login/services/RequireCasAuth";
import { PropTypes } from "prop-types";

export const LocalizedRouter = ({
  children,
  defaultLanguage,
  localesByLang = {},
  RouterComponent
}) => {
  return !isEmpty(localesByLang) ? (
    <RouterComponent>
      <Route exact path={"/kirjaudu"} component={Login} />
      <Route path="/cas-auth" component={RequireCasAuth} />
      <Route path="/cas-logout" component={DestroyCasAuth} />
      <Route path="/:lang([a-z]{2})">
        {({ match, location }) => {
          /**
           * Päätellään nykyinen kieli.
           * Asetetaan kieleksi fi, jos polkua käytetään ilman kieliasetusta.
           */
          const params = match ? match.params : {};
          const { lang = defaultLanguage || AppLanguage.Finnish } = params;

          /**
           * Jos url ei sisällä kielitietoa, ohjataan käyttäjä sovelluksen juureen juuri
           * määritellyn kielen kera
           */
          const { pathname } = location;

          if (!pathname.includes(`/${lang}/`)) {
            return <Redirect to={`/${lang}/`} />;
          }

          return (
            <IntlProvider
              otherKey={lang}
              locale={lang}
              messages={localesByLang[lang]}>
              {children}
            </IntlProvider>
          );
        }}
      </Route>
      <Route
        exact
        path={"/logout"}
        render={() => {
          // Väliaikainen ratkaisu siihen asti, kunnes backend
          // osaa käsitellä sille välitetyn kielitiedon (fi/sv).
          return <Redirect to={"/fi/logout"} />;
        }}
      />
    </RouterComponent>
  ) : (
    <div>Ladataan käännöksiä...</div>
  );
};

LocalizedRouter.propTypes = {
  children: PropTypes.object,
  defaultLanguage: PropTypes.string,
  localesByLang: PropTypes.object,
  RouterComponent: PropTypes.func
};
