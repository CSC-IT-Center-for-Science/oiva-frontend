import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { useIntl } from "react-intl";
import { ROLE_ESITTELIJA } from "modules/constants";
import common from "../../i18n/definitions/common";
import { useUser } from "../../stores/user";
import { Typography } from "@material-ui/core";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const";
import ammatillinenKoulutus from "i18n/definitions/ammatillinenKoulutus";

const Successful = styled.div`
  padding-left: 20px;
  margin: auto;
  max-width: 1200px;
`;

const CasAuthenticated = ({ organisation = {} }) => {
  const { formatMessage, locale } = useIntl();
  const [user] = useUser();

  const { oid } = organisation;

  if (user.hasErrored) {
    return <p>Virhe tapahtui</p>; // <p>{intl.formatMessage(commonMessages.loginError)}</p>;
  } else if (user.fetchedAt && oid) {
    const role = user.data.roles[1];
    switch (role) {
      case ROLE_ESITTELIJA: {
        return <Redirect to="/" />;
      }
      default: {
        return (
          <Redirect
            oid={oid}
            to={localizeRouteKey(locale, AppRoute.OmatTiedot, formatMessage, {
              id: oid,
              koulutusmuoto: formatMessage(ammatillinenKoulutus.kebabCase)
            })}
          />
        );
      }
    }
  }
  return (
    <Successful>
      <Typography component="h2" variant="h2">
        {formatMessage(common.welcome)}
        {", "}
        {sessionStorage.getItem("username")}
      </Typography>
    </Successful>
  );
};

export default CasAuthenticated;
