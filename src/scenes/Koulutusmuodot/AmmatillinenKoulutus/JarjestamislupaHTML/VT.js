import React from "react";
import styled from "styled-components";
import { PropTypes } from "prop-types";

const VTWrapper = styled.div`
  margin: 6px 0 0 0;
`;

const Nimi = styled.p`
  margin-left: 30px;
`;

const VT = props => {
  const { nimi, koodi } = props;
  return (
    <VTWrapper>
      <Nimi>
        {koodi ? koodi + " " : null}
        {nimi}
      </Nimi>
    </VTWrapper>
  );
};

VT.propTypes = {
  koodi: PropTypes.string,
  nimi: PropTypes.string
};

export default VT;
