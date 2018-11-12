import styled from 'styled-components'
import { APP_WIDTH, COLORS, MEDIA_QUERIES } from "./styles"

export const AppContainer = styled.div`
  position: relative;
  min-height: 85vh;

`

export const ContentContainer = styled.div`
  width: 100%;
  max-width: ${props => props.maxWidth ? props.maxWidth : '1030px'};
  margin: ${props => props.margin ? props.margin : '28px auto'};  
  padding: ${props => props.padding ? props.padding : '0 15px'};
  box-sizing: border-box;
  @media ${MEDIA_QUERIES.MOBILE} {
    margin: 0 auto;
  }
`

export const FullWidthWrapper = styled.div`
  background-color: ${props => props.backgroundColor ? props.backgroundColor : COLORS.WHITE};
`

export const BreadcrumbsContainer = styled.div`
  width: 100%;
  max-width: ${APP_WIDTH}px;
  margin: 15px auto 0;
  padding: 15px;
  box-sizing: border-box;

`

export const InnerContentContainer = styled.div`
  background-color: ${COLORS.WHITE};
  border: 1px solid ${COLORS.BORDER_GRAY};
  box-shadow: 0 2px 4px 3px rgba(219, 219, 219, 0.2);
`

export const InnerContentWrapper = styled.div`
  margin: 30px 28px;
  margin-bottom: 100px;

`