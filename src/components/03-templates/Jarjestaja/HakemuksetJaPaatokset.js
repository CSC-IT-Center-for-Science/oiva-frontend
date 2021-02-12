import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import PropTypes from "prop-types";
import MuutospyyntoList from "./MuutospyyntoList";
import { MessageWrapper } from "modules/elements";
import { COLORS } from "modules/styles";
import { ROLE_MUOKKAAJA } from "modules/constants";
import { HAKEMUS_VIESTI } from "./uusiHakemusFormConstants";
import { useMuutospyynnot } from "stores/muutospyynnot";
import { useUser } from "stores/user";
import * as R from "ramda";
import { Typography } from "@material-ui/core";

const Wrapper = styled.div`
  position: relative;
`;

const UusiMuutospyynto = styled(Link)`
  position: absolute;
  right: 0;
  top: 10px;
  padding: 6px 12px;
  color: ${COLORS.OIVA_GREEN};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const HakemuksetJaPaatokset = ({ match }) => {
  const [muutospyynnot] = useMuutospyynnot();
  const [user] = useUser();

  const organisation = {};

  const getMuutospyyntoUrl = () => {
    return `${match.url}/uusi/1`;
  };

  if (sessionStorage.getItem("role") !== ROLE_MUOKKAAJA) {
    return (
      <MessageWrapper>
        <Typography component="h3" variant="h3">
          {HAKEMUS_VIESTI.KIRJAUTUMINEN.FI}
        </Typography>
      </MessageWrapper>
    );
  }

  if (
    R.includes(ROLE_MUOKKAAJA, user.data.roles) &&
    organisation.data.oid === user.data.oid
  ) {
    return (
      <Wrapper>
        <Typography component="h2" variant="h2">
          Hakemukset
        </Typography>
        <UusiMuutospyynto to={getMuutospyyntoUrl()}>Luo uusi</UusiMuutospyynto>
        <MuutospyyntoList muutospyynnot={muutospyynnot.data} />
      </Wrapper>
    );
  } else {
    return (
      <MessageWrapper>
        <Typography component="h3" variant="h3">
          {HAKEMUS_VIESTI.KIRJAUTUMINEN.FI}
        </Typography>
      </MessageWrapper>
    );
  }
};

HakemuksetJaPaatokset.propTypes = {
  match: PropTypes.object,
  muutospyynnot: PropTypes.array,
  organisaatio: PropTypes.object
};

export default HakemuksetJaPaatokset;
