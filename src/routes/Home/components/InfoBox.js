import React, { Component } from 'react'
import styled from 'styled-components'

import { COLORS, BREAKPOINTS } from 'modules/styles'

const InfoBox = styled.div`
  margin: 20px;
  padding: 20px 40px;
  background-color: rgba(237, 237, 237, 0.5);
  max-width: ${props => props.maxWidth ? props.maxWidth : '100%'};
  
  @media ${BREAKPOINTS.MOBILE} {
    margin: 30px 15px;
    padding: 10px 20px;
  }
  
`

export default InfoBox
