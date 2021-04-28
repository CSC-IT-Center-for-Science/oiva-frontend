import React, { useCallback } from "react";
import Header from "components/02-organisms/Header/index";
import { useIntl } from "react-intl";
import authMessages from "i18n/definitions/auth";
import langMessages from "i18n/definitions/languages";
import { assoc, head, includes, or, prop, tail, toPairs } from "ramda";
import common from "i18n/definitions/common";
import { AppRoute } from "const/index";
import { localizeRoutePath } from "modules/i18n/components/LocalizedSwitch";
import { Breadcrumbs } from "react-breadcrumbs-dynamic";
import { NavLink, useLocation } from "react-router-dom";
import { COLORS } from "modules/styles";
import { localizeRouteKey } from "utils/common";
import ammatillinenKoulutus from "i18n/definitions/ammatillinenKoulutus";
import Footer from "components/03-templates/Footer";

export const App = ({ localesByLang, children, organisation, user }) => {
  const { formatMessage, locale } = useIntl();
  const { pathname } = useLocation();

  const authenticationLink = {
    text: !user
      ? [formatMessage(authMessages.logIn)]
      : [formatMessage(authMessages.logOut), user.username],
    path: !user
      ? localizeRoutePath(AppRoute.CasAuth, locale, formatMessage)
      : localizeRoutePath(AppRoute.CasLogOut, locale, formatMessage)
  };

  const getOrganisationLink = useCallback(() => {
    let result = {};

    if (user && user.oid && organisation) {
      const orgNimi = user && organisation ? prop("nimi", organisation) : "";
      const isEsittelija = user
        ? includes("OIVA_APP_ESITTELIJA", user.roles)
        : false;
      result = assoc(
        "text",
        // Select name by locale or first in nimi object
        or(prop(locale, orgNimi), tail(head(toPairs(orgNimi)) || [])),
        result
      );

      if (!isEsittelija) {
        result = assoc(
          "path",
          localizeRouteKey(locale, AppRoute.Jarjestamislupa, formatMessage, {
            id: organisation.oid,
            koulutusmuoto: formatMessage(ammatillinenKoulutus.kebabCase)
          }),
          result
        );
      }
    }
    return result;
  }, [formatMessage, locale, organisation, user]);

  const shortDescription = {
    text: formatMessage(common.siteShortDescription),
    path: "/"
  };

  const isBreadcrumbVisible =
    pathname !== `${localizeRouteKey(locale, AppRoute.Home, formatMessage)}`;

  const getHeader = useCallback(
    template => {
      const organisationLink = getOrganisationLink();
      return (
        <Header
          inFinnish={"FI"}
          inSwedish={"SV"}
          isAuthenticated={!!user}
          locale={locale}
          localesByLang={localesByLang}
          logIn={formatMessage(authMessages.logIn)}
          authenticationLink={authenticationLink}
          organisationLink={organisationLink}
          shortDescription={shortDescription}
          template={template}
          languageSelectionAriaLabel={formatMessage(langMessages.selection)}
        ></Header>
      );
    },
    [
      authenticationLink,
      locale,
      localesByLang,
      formatMessage,
      getOrganisationLink,
      shortDescription,
      user
    ]
  );

  return (
    <div className="flex flex-col" style={{ minHeight: "100vh" }}>
      {getHeader()}
      <main className="flex-1 flex flex-col">
        {isBreadcrumbVisible && (
          <nav
            tabIndex="0"
            className="breadcumbs-nav py-2 border-b pl-8 text-sm"
            aria-label={formatMessage(common.breadCrumbs)}
          >
            <Breadcrumbs
              hideIfEmpty={true}
              separator={<span> / </span>}
              item={NavLink}
              finalItem={"b"}
              finalProps={{
                style: {
                  fontWeight: 400,
                  color: COLORS.BLACK
                }
              }}
            />
          </nav>
        )}
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
