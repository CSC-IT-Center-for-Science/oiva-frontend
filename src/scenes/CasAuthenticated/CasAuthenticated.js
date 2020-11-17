import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import { useIntl } from "react-intl";
import { ROLE_ESITTELIJA } from "modules/constants";
import commonMessages from "../../i18n/definitions/common";
import { useUser } from "../../stores/user";

const Successful = styled.div`
  padding-left: 20px;
  margin: auto;
  max-width: 1200px;
`;

const CasAuthenticated = ({ organisation }) => {
  const intl = useIntl();
  const [user] = useUser();

  const { ytunnus } = organisation;

  console.info(ytunnus);

  if (user.hasErrored) {
    return <p>{intl.formatMessage(commonMessages.loginError)}</p>;
  } else if (user.fetchedAt && ytunnus) {
    const role = user.data.roles[1];
    // TODO: Different roles routing here when applicable
    switch (role) {
      case ROLE_ESITTELIJA: {
        return <Redirect to="/asianhallinta" />;
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
      <h2>
        {intl.formatMessage(commonMessages.welcome)}
        {", "}
        {sessionStorage.getItem("username")}
      </h2>
    </Successful>
  );
};

export default CasAuthenticated;
