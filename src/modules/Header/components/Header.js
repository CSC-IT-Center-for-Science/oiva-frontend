import React, { Component } from 'react'
import styled from 'styled-components'

import HeaderBar from 'modules/Header/components/HeaderBar'
import LinkItemUpper from 'modules/Header/components/LinkItemUpper'
import LinkItem from 'modules/Header/components/LinkItem'
import { ROLE_ESITTELIJA, ROLE_KAYTTAJA } from 'modules/constants'
import { COLORS, FONT_STACK } from 'modules/styles'

const HeaderTitle = styled.div`
  font-family: 'Arial';
  font-size: 14px;
  color: black;
  text-decoration: none;
  padding: 14px 0px;
  margin-left: 0px;
  line-height: 18px;
`

const HeaderBarUpper = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
  margin: 0 auto;
  width: 100%;
  max-width: ${props => props.maxWidth ? props.maxWidth : '1280px'};
  background: ${COLORS.WHITE};

`

const HeaderBarLower = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
  margin: 0 auto;
  width: 100%;
  max-width: ${props => props.maxWidth ? props.maxWidth : '1280px'};
  background: ${COLORS.OIVA_MENU_BG_COLOR};
`

const HeaderUpperRight = styled.div`
  padding: 14px 20px;
  line-height: 18px;

`

class Header extends Component {

  render() {

    return (
      <div>
        <HeaderBar>
          <HeaderBarUpper maxWidth="1280px" justifyContent="space-between">
              <HeaderTitle>Oiva - Opetushallinnon ohjaus- ja säätelypalvelu</HeaderTitle>

              <HeaderUpperRight>
                {(sessionStorage.getItem('role')!==ROLE_ESITTELIJA && sessionStorage.getItem('role')!==ROLE_KAYTTAJA)
                ? (<LinkItemUpper to="/cas-auth" className="has-separator pull-right">Kirjaudu sisään</LinkItemUpper>) : null}

                {(sessionStorage.getItem('role')===ROLE_ESITTELIJA || sessionStorage.getItem('role')===ROLE_KAYTTAJA)
                ? (<LinkItemUpper to="/cas-logout" className="has-separator pull-right">Kirjaudu ulos ({sessionStorage.getItem('username')})</LinkItemUpper>) : null}

                <LinkItemUpper to="/fi" className="has-separator pull-right">Suomeksi</LinkItemUpper>
                <LinkItemUpper to="/sv" className="pull-right">På svenska</LinkItemUpper>
              </HeaderUpperRight>

          </HeaderBarUpper>
        </HeaderBar>
        <HeaderBar>
          <HeaderBarLower>
            {/* TODO: localization! */}
            <LinkItem to="/" exact fontFamily={FONT_STACK.OPEN_SANS_REGULAR}>Etusivu</LinkItem>
            <LinkItem to="/esi-ja-perusopetus">Esi- ja perusopetus</LinkItem>
            <LinkItem to="/lukiokoulutus">Lukiokoulutus</LinkItem>
            <LinkItem to="/jarjestajat">Ammatillinen koulutus</LinkItem>
            <LinkItem to="/vapaa-sivistystyo">Vapaa sivistystyö</LinkItem>
            <LinkItem to="/tilastot">Tilastot</LinkItem>

            { (sessionStorage.getItem('role')===ROLE_ESITTELIJA) ? (<LinkItem to="/asiat" >Asiat</LinkItem>) : null}
          </HeaderBarLower>
        </HeaderBar>
      </div>
    )
  }
}
export default Header