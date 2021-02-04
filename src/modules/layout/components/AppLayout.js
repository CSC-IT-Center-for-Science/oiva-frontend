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

export const AppLayout = ({ localesByLang, children, organisation, user }) => {
  const { formatMessage, locale } = useIntl();
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
    if (user && user.oid && organisation) {
      const orgNimi = user && organisation ? prop("nimi", organisation) : "";
      const isEsittelija = user
        ? includes("OIVA_APP_ESITTELIJA", user.roles)
        : false;
      const result = {
        // Select name by locale or first in nimi object
        text: or(prop(locale, orgNimi), tail(head(toPairs(orgNimi)) || []))
      };
      return isEsittelija
        ? result
        : assoc(
            "path",
            `/ammatillinenkoulutus/koulutuksenjarjestajat/${prop(
              "ytunnus",
              organisation
            )}/jarjestamislupa`,
            result
          );
    }
    return {};
  }, [locale, organisation, user]);

  const shortDescription = {
    text: formatMessage(common.siteShortDescription),
    path: "/"
  };

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
      getOrganisationLink,
      shortDescription,
      user
    ]
  );

  return (
    <React.Fragment>
      {getHeader()}
      <main>{children}</main>
    </React.Fragment>
  );
};
