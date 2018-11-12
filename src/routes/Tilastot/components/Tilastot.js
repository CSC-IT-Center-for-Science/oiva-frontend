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

const Linkki = styled.div`
    margin-top:15px;  
`

class Tilastot extends Component {
  render() {
    return (
      <ContentContainer>
        <Helmet height="50px">
           <Title>Oiva | Tilastot</Title>
        </Helmet>
          <p>
            Linkkejä tilastodataan (beta-versio):
          </p>
          <Linkki><a href="https://app.powerbi.com/view?r=eyJrIjoiN2M1YWZiYzUtOTEyYS00NTY2LTgzNDctNGZjOTVmOWQ4ZTlkIiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9">Ammatillisen koulutuksen järjestämisluvat</a></Linkki>
          <Linkki><a href="https://app.powerbi.com/view?r=eyJrIjoiNjQ4NGRmNWEtYmRmMC00YWNkLWI4NGEtNDg2NTBmMWFmYTM0IiwidCI6IjkxMDczODlkLTQ0YjgtNDcxNi05ZGEyLWM0ZTNhY2YwMzBkYiIsImMiOjh9">Väestötiedot</a></Linkki>

      </ContentContainer>
    )
  }
}

export default Tilastot
