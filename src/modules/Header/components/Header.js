import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import HeaderBar from 'modules/Header/components/HeaderBar'
import LinkItemUpper from 'modules/Header/components/LinkItemUpper'
import LinkItem from 'modules/Header/components/LinkItem'
import { ROLE_ESITTELIJA } from 'modules/constants'
import { COLORS, FONT_STACK, MEDIA_QUERIES } from 'modules/styles'
import { getRoles, getOrganisation } from 'routes/Login/modules/user'

const HeaderTitle = styled.div`
  font-family: 'Arial';
  font-size: 16px;
  color: black;
  text-decoration: none;
  padding: 14px 0px;
  margin-left: 30px;
  line-height: 18px;
  @media ${MEDIA_QUERIES.MOBILE} {
    width: 0;
    overflow: hidden;
  }
`

const HeaderBarUpper = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
  background: ${COLORS.WHITE};
  max-height: 50px;
`

const HeaderBarLower = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
  margin: 0 auto;
  width: 100%;
  background: ${COLORS.OIVA_MENU_BG_COLOR};
  max-height: 50px;
  overflow: hidden;
  @media ${MEDIA_QUERIES.MOBILE} {
    padding-left:32px;
    flex-flow: column;
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 40px;
    opacity: 0.99;
    z-index: 100;

    &:before {
      content: "Ξ";
      margin-left: -20px;
      margin-top: 10px;
    }
    &:hover {
      max-height: initial;
      height: initial;
      background: ${COLORS.OIVA_MENU_BG_COLOR};  
      width: 100%;
      div {
        width: initial;
      }
    }
  }
`

const HeaderUpperRight = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-right: 20px;
`

const LanguageBar = styled.div`
  padding: 14px 0;
  @media ${MEDIA_QUERIES.MOBILE} {
    margin-left: auto;
    padding: 0;
    padding-right: 20px;
  }
`

class Header extends Component {

  componentDidMount() {
    // getRoles lataa datan sessionStorageen
    this.props.getRoles().then(() => {
       this.props.getOrganisation(sessionStorage.getItem('oid'))
    })
  }

  render() {

    const { oppilaitos } = this.props.user
    let ytunnus = undefined
    if (oppilaitos) {
        if (oppilaitos.organisaatio) {
            ytunnus = oppilaitos.organisaatio.ytunnus
        }
    }

    return (
      <div>
        <HeaderBar>
          <HeaderBarUpper maxWidth="1280px" justifyContent="space-between">
              <HeaderTitle>Oiva - Opetushallinnon ohjaus- ja säätelypalvelu</HeaderTitle>

              <HeaderUpperRight>
                {!sessionStorage.getItem('role')
                ? (<LinkItemUpper to="/cas-auth" className="has-separator pull-right">Kirjaudu sisään</LinkItemUpper>) : null}

                {sessionStorage.getItem('role')
                ? (<LinkItemUpper to="/cas-logout" className="has-separator pull-right">Kirjaudu ulos ({sessionStorage.getItem('username')})</LinkItemUpper>) : null}

                <LanguageBar>
                  <LinkItemUpper to="/fi" className="has-separator pull-right">Suomeksi</LinkItemUpper>
                  <LinkItemUpper to="/sv" className="pull-right">På svenska</LinkItemUpper>
                </LanguageBar>
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

            { ytunnus &&
              <LinkItem onClick={this.forceUpdate} ytunnus={ytunnus} to={{pathname: "/jarjestajat/" + ytunnus + "/omattiedot", ytunnus: ytunnus}} exact>Oma organisaatio</LinkItem>
            }

            { (sessionStorage.getItem('role')===ROLE_ESITTELIJA) ? (<LinkItem to="/asiat" >Asiat</LinkItem>) : null}
          </HeaderBarLower>
        </HeaderBar>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { user: state.user }
}

function mapDispatchToProps(dispatch) {
  return {
    getRoles: () => dispatch(getRoles()),
    getOrganisation: (oid) => dispatch(getOrganisation(oid))
  }
}

// Aktiivisen linkin päättely feilaa, jos React olettaa komponentin olevan puhdas
export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(Header)
