import React from "react";
import styled from "styled-components";

const OrganizerH1 = styled.h1`
  margin-bottom: 10px;
`;

const LargeParagraph = styled.p`
  font-size: 20px;
  line-height: 24px;
  margin: 0;
`;

const JarjestajaBasicInfo = ({ jarjestaja }) => {
  return (
    <React.Fragment>
      <OrganizerH1>{jarjestaja.nimi}</OrganizerH1>
      <LargeParagraph>{jarjestaja.ytunnus}</LargeParagraph>
    </React.Fragment>
  );
};

export default JarjestajaBasicInfo;
