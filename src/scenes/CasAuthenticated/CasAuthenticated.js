import React from "react";
import styled from "styled-components";
import { Navigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { ROLE_ESITTELIJA } from "modules/constants";
import commonMessages from "../../i18n/definitions/common";
import { useOrganisation } from "../../stores/organisation";
import { useUser } from "../../stores/user";
import * as R from "ramda";

const Successful = styled.div`
  padding-left: 20px;
  margin: auto;
  max-width: 1200px;
`;

const CasAuthenticated = () => {
  const intl = useIntl();

  const [user] = useUser();
  const [organisation] = useOrganisation();

  const ytunnus = R.path([user.data.oid, "data", "ytunnus"], organisation);

  if (user.hasErrored) {
    return <p>{intl.formatMessage(commonMessages.loginError)}</p>;
  } else if (user.fetchedAt && ytunnus) {
    const role = user.data.roles[1];
    // TODO: Different roles routing here when applicable
    switch (role) {
      case ROLE_ESITTELIJA: {
        return <Navigate to="/asiat" />;
      }
      default: {
        return (
          <Navigate
            ytunnus={ytunnus}
            to={{
              pathname: "/jarjestajat/" + ytunnus + "/omattiedot",
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
