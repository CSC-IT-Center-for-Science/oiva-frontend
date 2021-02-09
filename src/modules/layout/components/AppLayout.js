import React, { useCallback, useEffect, useState } from "react";
import Header from "components/02-organisms/Header/index";
import { useIntl } from "react-intl";
import { useUser } from "stores/user";
import authMessages from "i18n/definitions/auth";
import langMessages from "i18n/definitions/languages";
import { getRaw } from "basedata";
import { assoc, head, includes, or, prop, tail, toPairs } from "ramda";
import { backendRoutes } from "stores/utils/backendRoutes";
import common from "i18n/definitions/common";
import { AppRoute } from "const/index";
import { localizeRoutePath } from "modules/i18n/components/LocalizedSwitch";
import { Breadcrumbs, BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { NavLink, useLocation } from "react-router-dom";
import { COLORS } from "modules/styles";
import { localizeRouteKey } from "utils/common";
import ammatillinenKoulutus from "i18n/definitions/ammatillinenKoulutus";

export const AppLayout = ({ localesByLang, children, organisation, user }) => {
  const { formatMessage, locale } = useIntl();
  const { pathname } = useLocation();
  // const [userState, userActions] = useUser();

  // const { data: user } = userState;

  // const [organisation, setOrganisation] = useState();

  const authenticationLink = {
    text: !user
      ? [formatMessage(authMessages.logIn)]
      : [formatMessage(authMessages.logOut), user.username],
    path: !user
      ? localizeRoutePath(AppRoute.CasAuth, locale, formatMessage)
      : localizeRoutePath(AppRoute.CasLogOut, locale, formatMessage)
  };

  // useEffect(() => {
  //   if (user && user.oid) {
  //     getRaw(
  //       "organisaatio",
  //       `${backendRoutes.organisaatio.path}/${user.oid}`,
  //       []
  //     ).then(result => {
  //       setOrganisation(result);
  //     });
  //   }
  // }, [setOrganisation, user]);

  // useEffect(() => {
  //   // Let's fetch the current user from backend
  //   const abortController = userActions.load();
  //   return function cancel() {
  //     abortController.abort();
  //   };
  // }, [userActions]);

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
            id: organisation.ytunnus,
            koulutusmuoto: formatMessage(ammatillinenKoulutus.kebabCase)
          }),
          result
        );
      }
    }
    return result;
  }, [locale, organisation, user]);

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
          // onLoginButtonClick={onLoginButtonClick}
          // onMenuClick={onMenuClick}
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
      // onLoginButtonClick,
      // onMenuClick,
      formatMessage,
      getOrganisationLink,
      shortDescription,
      user
    ]
  );

  return (
    <React.Fragment>
      <BreadcrumbsItem
        to={localizeRouteKey(locale, AppRoute.Home, formatMessage)}
      >
        Oiva
      </BreadcrumbsItem>
      {getHeader()}
      <main>
        {isBreadcrumbVisible && (
          <nav
            tabIndex="0"
            className="breadcumbs-nav py-4 border-b pl-8"
            aria-label={formatMessage(common.breadCrumbs)}
          >
            <Breadcrumbs
              hideIfEmpty={true}
              separator={<b> / </b>}
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
    </React.Fragment>
  );
};
