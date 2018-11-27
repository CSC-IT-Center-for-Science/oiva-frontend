import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getRoles, getOrganisation } from 'routes/Login/modules/user'
import styled from 'styled-components'
import { Link, Redirect } from 'react-router-dom'

import { ROLE_ESITTELIJA } from "../../../modules/constants";

const Successful = styled.div`
  padding-left: 20px;
  margin:auto;
  width:1200px;
`

class CasAuthenticated extends Component {

  componentDidMount() {
      this.props.getRoles().then(() => {
         this.props.getOrganisation(sessionStorage.getItem('oid'))
      })
  }

  render() {

      const { oppilaitos } = this.props.user
      let organisaatio = undefined
      let ytunnus = undefined
      let nimi = undefined
      if(oppilaitos) {
          organisaatio = oppilaitos.organisaatio
          if(oppilaitos.organisaatio) {
              ytunnus = organisaatio.ytunnus
              nimi = organisaatio.nimi.fi
          }
      }

      if(sessionStorage.getItem('role')===ROLE_ESITTELIJA) {
          return (
              <Redirect to="/asiat" />
          )
      }

      return (

          <div>

              {this.props.user.hasErrored
                  ?
                  <p>Kirjautumisessa tapahtui virhe</p>
                  :
                  ytunnus ?
                    <Redirect ytunnus={ytunnus} to={{pathname: "/jarjestajat/" + ytunnus + "/jarjestamislupa", ytunnus: ytunnus}} />
                    :
                    <Successful><h2>Tervetuloa Oiva-palveluun {sessionStorage.getItem('username')}</h2>
                    </Successful>
              }
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

export default connect(mapStateToProps, mapDispatchToProps)(CasAuthenticated)
