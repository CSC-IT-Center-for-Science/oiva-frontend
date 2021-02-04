import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { useIntl } from "react-intl";
import { ROLE_ESITTELIJA } from "modules/constants";
import commonMessages from "../../i18n/definitions/common";
import { useUser } from "../../stores/user";
import { Typography } from "@material-ui/core";

const Successful = styled.div`
  padding-left: 20px;
  margin: auto;
  max-width: 1200px;
`;

const CasAuthenticated = ({ organisation }) => {
  console.info("ORGANISAATIO:", organisation);
  const intl = useIntl();
  const [user] = useUser();

  const { ytunnus } = organisation;

  if (user.hasErrored) {
    return <p>{intl.formatMessage(commonMessages.loginError)}</p>;
  } else if (user.fetchedAt && ytunnus) {
    const role = user.data.roles[1];
    switch (role) {
      case ROLE_ESITTELIJA: {
        return <Redirect to="/" />;
      }
      default: {
        return (
          <Redirect
            ytunnus={ytunnus}
            to={{
              pathname: `/ammatillinenkoulutus/koulutuksenjarjestajat/${ytunnus}/omattiedot`,
              ytunnus
            }}
          />
        );
      }
    }
  }
  return (
    <Successful>
      <Typography component="h2" variant="h2">
        {intl.formatMessage(commonMessages.welcome)}
        {", "}
        {sessionStorage.getItem("username")}
      </Typography>
    </Successful>
  );
};

export default CasAuthenticated;
