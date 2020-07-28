import React from "react";
import styled from "styled-components";
import common from "../../../../i18n/definitions/common";
import { useIntl } from "react-intl";
import { split, join, replace } from "ramda";

const OrganizerH1 = styled.h1`
  margin-bottom: 10px;
`;

const LargeParagraph = styled.p`
  font-size: 20px;
  line-height: 24px;
  margin: 0;
`;

const JarjestajaBasicInfo = ({ jarjestaja }) => {
  const intl = useIntl();
  const ytunnusTitle = `${intl.formatMessage(common.ytunnus)}: `;
  const ytunnusVoiceOverSpelling = replace(
    "-",
    intl.formatMessage(common.viiva),
    join(" ", split("", jarjestaja.ytunnus))
  );
  const ariaLabel = `${ytunnusTitle}: ${ytunnusVoiceOverSpelling}`;

  return (
    <React.Fragment>
      <OrganizerH1>{jarjestaja.nimi}</OrganizerH1>
      <LargeParagraph aria-label={ariaLabel} role="text">
        {ytunnusTitle} {jarjestaja.ytunnus}
      </LargeParagraph>
    </React.Fragment>
  );
};

export default JarjestajaBasicInfo;
