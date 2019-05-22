import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import HeaderBar from 'modules/Header/components/HeaderBar'
import LinkItemUpper from 'modules/Header/components/LinkItemUpper'
import LinkItem from 'modules/Header/components/LinkItem'
import { ROLE_ESITTELIJA } from 'modules/constants'
import { COLORS, FONT_STACK, MEDIA_QUERIES } from 'modules/styles'
import { getRoles, getOrganisation } from 'routes/Login/modules/user'

import styles from './Header.module.css'

const HeaderTitle = styled.div`
  font-family: 'Arial';
  color: ${COLORS.BLACK};
  text-decoration: none;
`

const HeaderBarLower = styled.div`
  display: flex;
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
  margin: 0 auto;
  width: 100%;
  background: ${COLORS.OIVA_MEDIUM_GREEN};
  max-height: 50px;
  overflow: hidden;
  @media ${MEDIA_QUERIES.MOBILE} {
    padding-left: 32px;
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
      padding-top: 10px;
    }
    &:hover {
      max-height: initial;
      height: initial;
      background: ${COLORS.OIVA_MEDIUM_GREEN};  
      width: 100%;
      div {
        width: initial;
      }
    }
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
          <div className={styles.headerBarUpper} maxwidth="1280px">
              <HeaderTitle className="hidden md:inline">Oiva - Opetushallinnon ohjaus- ja säätelypalvelu</HeaderTitle>

              <div className="flex ml-auto md:ml-2">
                {!sessionStorage.getItem('role')
                ? (<LinkItemUpper to="/cas-auth" className="hidden md:inline has-separator pull-right">Kirjaudu sisään</LinkItemUpper>) : null}

                {sessionStorage.getItem('role')
                ? (<LinkItemUpper to="/cas-logout" className="hidden md:inline has-separator pull-right">Kirjaudu ulos ({sessionStorage.getItem('username')})</LinkItemUpper>) : null}

                <LinkItemUpper to="/fi" className="has-separator pull-right">Suomeksi</LinkItemUpper>
                <LinkItemUpper to="/sv" className="pull-right">På svenska</LinkItemUpper>
              </div>

          </div>
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
              <LinkItem className="md:ml-auto" onClick={this.forceUpdate} ytunnus={ytunnus} to={{pathname: "/jarjestajat/" + ytunnus + "/omattiedot", ytunnus: ytunnus}} exact>Oma organisaatio</LinkItem>
            }

            {!sessionStorage.getItem('role')
            ? (<LinkItem to="/cas-auth" className="md:hidden has-separator">Kirjaudu sisään</LinkItem>) : null}

            {sessionStorage.getItem('role')
            ? (<LinkItem to="/cas-logout" className="md:hidden has-separator">Kirjaudu ulos ({sessionStorage.getItem('username')})</LinkItem>) : null}

            { (sessionStorage.getItem('role')===ROLE_ESITTELIJA) ? (<LinkItem to="/asiat">Asiat</LinkItem>) : null}
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
