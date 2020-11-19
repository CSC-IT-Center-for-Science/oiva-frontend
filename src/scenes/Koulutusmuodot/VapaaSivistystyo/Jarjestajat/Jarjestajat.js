import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { MEDIA_QUERIES } from "modules/styles";
import { ContentContainer } from "../../modules/elements";
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

const Jarjestajat = ({ intl }) => {
  return (
    <ContentContainer>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>Oiva | Ammatillinen koulutus</title>
      </Helmet>
      <div height="300px">
        <Description>
          TODO: Linkitys Oivaan rakennettava näille hoodeille
        </Description>
      </div>
    </ContentContainer>
  );
};

export default injectIntl(Jarjestajat);
