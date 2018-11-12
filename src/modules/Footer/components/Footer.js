import React, { Component } from 'react'
import styled from 'styled-components'

import LinkItemUpper from 'modules/Header/components/LinkItemUpper'
import LinkItem from 'modules/Header/components/LinkItem'
import { ROLE_ESITTELIJA, ROLE_KAYTTAJA } from 'modules/constants'
import { COLORS, FONT_STACK, Leijona } from 'modules/styles'

const HeaderTitle = styled.div`
  font-family: 'Arial';
  font-size: 14px;
  color: black;
  text-decoration: none;
  padding: 14px 20px;
  margin-left: 0px;
  line-height: 18px;
`

const FooterBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: ${COLORS.WHITE};
  color: black;
  border-top: 2px solid #70A489;
  padding-top: 20px;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  height:100px;
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