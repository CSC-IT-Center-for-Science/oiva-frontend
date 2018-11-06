import React, { Component } from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'

import { MEDIA_QUERIES } from 'modules/styles'
import { ContentContainer } from '../../../modules/elements'

const Title = styled.h1`
  color: #555;
  margin: 60px 0 0 20px;
  position: relative;
  top: 20px;
  
  @media ${MEDIA_QUERIES.MOBILE} {
    margin: 15px;
    top: 0;
  }
`

const Description = styled.p`
  font-size: 18px;
  max-width: 500px;
  margin: 50px 0 0 20px;
  position: relative;
  
  @media ${MEDIA_QUERIES.MOBILE} {
    margin: 15px;
  }
`

class Lukiokoulutus extends Component {
  render() {
    return (
      <ContentContainer>
        <Helmet>
          <Title>Oiva | Lukiokoulutus</Title>
        </Helmet>
        <div height="300px">
          <Description>Tulossa vuoden 2019 aikana</Description>
        </div>
      </ContentContainer>
    )
  }
}

export default Lukiokoulutus
