import styled from 'styled-components'

import { MEDIA_QUERIES } from 'modules/styles'

const InfoBox = styled.div`
  margin: 20px auto;
  padding: 20px 40px;
  background-color: rgba(237, 237, 237, 0.5);
  max-width: ${props => props.maxWidth ? props.maxWidth : '100%'};
  
  @media ${MEDIA_QUERIES.MOBILE} {
    margin: 30px 15px;
    padding: 10px 20px;
  }
  
`

export default InfoBox
