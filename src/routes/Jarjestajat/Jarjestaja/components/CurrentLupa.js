import React from 'react'
import styled from 'styled-components'
import Moment from 'react-moment'

import { COLORS, MEDIA_QUERIES } from "../../../../modules/styles"
import { API_BASE_URL } from "../../../../modules/constants"
import pdf from 'static/images/icon-pdf-large.png'

const CurrentLupaWrapper = styled.div`
  border-top: 1px solid ${COLORS.BORDER_GRAY};
  border-right: 1px solid ${COLORS.BORDER_GRAY};
  border-bottom: 1px solid ${COLORS.BORDER_GRAY};
  border-left: 6px solid ${COLORS.OIVA_GREEN};
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 26px;
  display: flex;
  align-items: center;
  width: 100%;
  -webkit-box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.3);
  -moz-box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.3);
  box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.3);
  
  img {
    height: 68px;
  }
  
  @media ${MEDIA_QUERIES.MOBILE} {
    padding: 14px;
  }
`

const OuterWrapper = styled.div`
  display: inline-block;
  margin-bottom: 40px;
`

const LupaTextWrapper = styled.div`
  margin-left: 20px;
  margin-right: 30px;
  width: 100%;
  flex: 1 1 auto;
  
  p {
    line-height: 24px;
    margin: 0;
    color: ${COLORS.BLACK};
  }
`

const CurrentLupa = (props) => {
  const { diaarinumero, jarjestaja, voimassaolo, lupaExceptionUrl } = props
  let url = `${API_BASE_URL}/pdf/${diaarinumero}`

  if (lupaExceptionUrl) {
    url = lupaExceptionUrl
  }

  return (
    <a href={url} target="_blank">
      <OuterWrapper>
        <CurrentLupaWrapper>
            <img src={pdf} alt="Voimassa oleva lupa PDF-tiedostona"/>
            <LupaTextWrapper>
              <p>{diaarinumero}</p>
              <p>{jarjestaja}</p>
              <p><Moment format="D.M.YYYY">{voimassaolo}</Moment> lukien</p>
            </LupaTextWrapper>
        </CurrentLupaWrapper>
      </OuterWrapper>
    </a>
  )
}

export default CurrentLupa
