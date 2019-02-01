import React, { Component } from 'react'
import styled from 'styled-components'
import { ROLE_ESITTELIJA, ROLE_KAYTTAJA } from 'modules/constants'
import { COLORS, FONT_STACK, Leijona } from 'modules/styles'


const FooterBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: ${COLORS.WHITE};
  color: black;
  border-top: 2px solid #70A489;
  padding: 1rem;
  padding-bottom: 40px;
  height:100px;
  bottom:0;
`

const FooterBarUpper = styled.div`
  display:flex;
  margin: 0 auto;
  width: 100%;
  background: ${COLORS.WHITE};
  font-size:11px;
`

const FooterLeft = styled.div`
`

const FooterRight = styled.div`
  margin-left:30px;
`

class Footer extends Component {

  render() {

    return (
      <FooterBar>
        <FooterBarUpper maxWidth="1280px">
          <FooterLeft>
            <Leijona/>
          </FooterLeft>
          <FooterRight>
            <p>&nbsp;</p>
            <p>OPETUS- JA KULTTUURIMINISTERIÖ</p>
            <p>PL 29, 00023 VALTIONEUVOSTO</p>
            <p>PUH. 029 533 0004, <a href="http://www.minedu.fi">WWW.MINEDU.FI</a></p>
          </FooterRight>
        </FooterBarUpper>
      </FooterBar>
    )
  }
}
export default Footer