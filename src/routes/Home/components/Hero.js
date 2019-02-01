import styled from 'styled-components'

import { MEDIA_QUERIES } from "../../../modules/styles"

const Hero = styled.div`
  background-image: url(${props => props.background});
  height: ${props => props.height};
  margin: 0 auto;
  max-width: ${props => props.maxWidth ? props.maxWidth : '100%'};
  
  a {
    display: inline-block;
  } 
  
  @media ${MEDIA_QUERIES.MOBILE} {
    height: auto;
  }
`

export default Hero