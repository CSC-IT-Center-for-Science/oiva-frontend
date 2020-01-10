import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import { MEDIA_QUERIES } from "modules/styles";
import { ContentContainer } from "modules/elements";
import common from "../../../i18n/definitions/common";
import { injectIntl } from "react-intl";

const Description = styled.p`
  font-size: 18px;
  max-width: 500px;
  margin: 50px 0 0 20px;
  position: relative;

  @media ${MEDIA_QUERIES.MOBILE} {
    margin: 15px;
  }
`;

const VapaaSivistystyo = ({ intl }) => {
  return (
    <ContentContainer>
      <Helmet>
        <title>Oiva | Vapaa sivistystyö</title>
      </Helmet>
      <div height="300px">
        <Description>
          {intl.formatMessage(common.tietoaTulevanJulkaisunAjankohdasta)}
        </Description>
      </div>
    </ContentContainer>
  );
};

export default injectIntl(VapaaSivistystyo);
