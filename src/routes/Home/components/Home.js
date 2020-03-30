import React, { Component } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import Hero from "./Hero";
import LinkBox from "./LinkBox";
import InfoBox from "./InfoBox";
import { BackgroundImage, MEDIA_QUERIES } from "modules/styles";
import { ContentContainer } from "../../../modules/elements";

const Title = styled.h2`
  color: #555;
  margin: 60px 0 0 20px;
  position: relative;
  top: 20px;

  @media ${MEDIA_QUERIES.MOBILE} {
    margin: 15px;
    top: 0;
  }
`;

const Palaute = styled.div`
  margin-top: 25px;
`;

class Home extends Component {
  render() {
    return (
      <ContentContainer>
        <Helmet>
          <title>Oiva | Etusivu</title>
        </Helmet>
        <Hero height="50px" maxWidth="600px">
          <Title>Oiva - Opetushallinnon ohjaus- ja säätelypalvelu</Title>
        </Hero>
        <InfoBox maxWidth="600px">
          <p>
            Palvelusta löytyvät tällä hetkellä kaikki ajantasaiset ammatillisen
            koulutuksen järjestämisluvat sekä vapaan sivistystyön oppilaitosten
            ylläpitämisluvat. Myöhemmin Oiva laajennetaan koskemaan myös esi- ja
            perusopetuksen sekä lukiokoulutuksen järjestämisluvat. Palvelusta
            löytyy lisäksi väestö-, koulutus- ja lupatietoja ja erilaisia
            tilastoja ammatillisen koulutuksen osalta.
          </p>
        </InfoBox>
      </ContentContainer>
    );
  }
}

export default Home;
