import React, { Component } from 'react'
import styled from 'styled-components'

import HeaderBar from 'modules/Header/components/HeaderBar'
import LinkItem from 'modules/Header/components/LinkItem'
import { ROLE_ESITTELIJA, ROLE_KAYTTAJA } from 'modules/constants'
import { COLORS, FONT_STACK } from 'modules/styles'

const HeaderTitle = styled.div`
  font-family: ${FONT_STACK.GOTHAM_NARROW};
  font-size: 20px;
  color: white;
  padding: 14px 20px;
  text-decoration: none;
  color: white;
  margin-left: 0px;
  line-height: 20px;
`

// const HeaderLinks = styled.div`
//   display: flex;
// `

const HeaderBarInner = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
  margin: 0 auto;
  width: 100%;
  max-width: ${props => props.maxWidth ? props.maxWidth : '1280px'};
`

class Header extends Component {

  render() {

    return (
      <div>
        <HeaderBar bgColor={COLORS.OIVA_GREEN}>
          <HeaderBarInner maxWidth="1280px" justifyContent="space-between">
            <HeaderTitle>Oiva - Opetushallinnon ohjaus- ja säätelypalvelu</HeaderTitle>
            {/*<HeaderLinks>*/}

              {/*<LinkItem to="/sv" className="text-small has-separator">På svenska</LinkItem>*/}
            {/*
              {(sessionStorage.getItem('role')!==ROLE_ESITTELIJA && sessionStorage.getItem('role')!==ROLE_KAYTTAJA)
              ? (<LinkItem to="/cas-auth" className="text-small">Kirjaudu sisään</LinkItem>) : null}

              {(sessionStorage.getItem('role')===ROLE_ESITTELIJA || sessionStorage.getItem('role')===ROLE_KAYTTAJA)
              ? (<LinkItem to="/cas-logout" className="text-small">Kirjaudu ulos ({sessionStorage.getItem('username')})</LinkItem>) : null}
            */}
            {/*</HeaderLinks>*/}
          </HeaderBarInner>
        </HeaderBar>
        <HeaderBar>
          <HeaderBarInner>
            <LinkItem to="/" exact fontFamily={FONT_STACK.OPEN_SANS_REGULAR}>Etusivu</LinkItem>
            <LinkItem to="/jarjestajat">Koulutuksen järjestäjät</LinkItem>
            { (sessionStorage.getItem('role')===ROLE_ESITTELIJA) ? (<LinkItem to="/asiat" >Asiat</LinkItem>) : null}
            { /*<LinkItem to="/tilastot-raportit">Tilastot ja raportit</LinkItem> */}
          </HeaderBarInner>
        </HeaderBar>
      </div>
    )
  }
}
export default Header