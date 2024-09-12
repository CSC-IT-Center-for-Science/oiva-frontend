import React from "react";
import styled from "styled-components";
import { PropTypes } from "prop-types";

const MuuMaaraysWrapper = styled.div`
  margin: 6px 0 20px 0;
`;

const Nimi = styled.p`
  margin-left: 30px;
`;

const MuuMaarays = props => {
  const { selite, nimi, koodi } = props;
  return (
    <MuuMaaraysWrapper>
      <p>{selite}</p>
      <Nimi>
        {koodi ? koodi + " " : null}
        {nimi}
      </Nimi>
    </MuuMaaraysWrapper>
  );
};

MuuMaarays.propTypes = {
  koodi: PropTypes.string,
  nimi: PropTypes.string,
  selite: PropTypes.string
};

export default MuuMaarays;
