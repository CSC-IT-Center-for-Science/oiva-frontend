import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import HeaderBar from 'modules/Header/components/HeaderBar'
import LinkItemUpper from 'modules/Header/components/LinkItemUpper'
import LinkItem from 'modules/Header/components/LinkItem'
import { ROLE_ESITTELIJA, ROLE_KAYTTAJA } from 'modules/constants'
import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants"
import { COLORS, FONT_STACK } from 'modules/styles'
import { MdEmail } from 'react-icons/md';
import { getRoles, getOrganisation } from 'routes/Login/modules/user'
import Loading from '../../../../modules/Loading'
import { InnerContentContainer, InnerContentWrapper  } from "../../../../modules/elements"

class OmatTiedot extends Component {

  componentDidMount() {
    // getRoles lataa datan sessionStorageen
    this.props.getRoles().then(() => {
       this.props.getOrganisation(sessionStorage.getItem('oid'))
    })
  }

  render() {

    console.log(this.props.user);
    const { oppilaitos } = this.props.user;
    let ytunnus = undefined;
    let postinumero = undefined;
    let ppostinumero = undefined;
    let numero = undefined;
    let www = undefined;
    let email = undefined;
    if (oppilaitos) {
        if (oppilaitos.organisaatio) {
            ytunnus = oppilaitos.organisaatio.ytunnus
            if (oppilaitos.organisaatio.kayntiosoite.postinumeroUri) postinumero = oppilaitos.organisaatio.kayntiosoite.postinumeroUri.substr(6)
            if (oppilaitos.organisaatio.postiosoite.postinumeroUri) ppostinumero = oppilaitos.organisaatio.postiosoite.postinumeroUri.substr(6)
            // jos tietoja enemmän, ottaa jälkimmäisen arvon (yleiset yhteystiedot)
            oppilaitos.organisaatio.yhteystiedot.map(item => {
                if (item.www) www = item.www;
                if (item.numero) numero = item.numero;
                if (item.email) email = item.email;
              }
            )
        }
    }

    if (oppilaitos && oppilaitos.organisaatio)
      return (
        <InnerContentContainer>
          <InnerContentWrapper>
            <h2>{LUPA_TEKSTIT.OMATTIEDOT.OTSIKKO.FI}</h2>
            <h3>{LUPA_TEKSTIT.OMATTIEDOT.KAYNTIOSOITE.FI}</h3>
            <p>
              {oppilaitos.organisaatio.kayntiosoite.osoite}
              {postinumero && <span>,&nbsp;</span> }
              {postinumero}
              {oppilaitos.organisaatio.kayntiosoite.postitoimipaikka && <span>&nbsp;</span> }
              {oppilaitos.organisaatio.kayntiosoite.postitoimipaikka}
            </p>
            <h3>{LUPA_TEKSTIT.OMATTIEDOT.POSTIOSOITE.FI}</h3>
            <p>
              {oppilaitos.organisaatio.postiosoite.osoite && oppilaitos.organisaatio.postiosoite.osoite}
              {ppostinumero && <span>,&nbsp;</span> }
              {ppostinumero && ppostinumero}&nbsp;
              {oppilaitos.organisaatio.postiosoite.postitoimipaikka && <span>&nbsp;</span> }
              {oppilaitos.organisaatio.postiosoite.postitoimipaikka}
            </p>
            <h3>{LUPA_TEKSTIT.OMATTIEDOT.YHTEYSTIEDOT.FI}</h3>
            { numero &&
              <p>
                <b>{LUPA_TEKSTIT.OMATTIEDOT.PUHELINNUMERO.FI}:</b> {numero}
              </p>
            }
            { www &&
              <p>
                <b>{LUPA_TEKSTIT.OMATTIEDOT.WWWW.FI}:</b> <a href={www} target="full">{www}</a>
              </p>
            }
            { email &&
              <p>
                <b>{LUPA_TEKSTIT.OMATTIEDOT.EMAIL.FI}:</b> {email}
              </p>
            }
            <br />
            <p>{LUPA_TEKSTIT.OMATTIEDOT.INFO.FI}</p>
          </InnerContentWrapper>
        </InnerContentContainer>
      ) 
    else
      return <Loading />

    // Käyntiosoite: Hallilantie 24 , 33820  TAMPERE
    // Postiosoite: Ahlmanin koulu Hallilantie 24 , 33820  TAMPERE
    // Puhelinnumero: 03 3399 2500
    // Www-osoite: http://www.ahlman.fi
    // Sähköpostiosoite: ahlman@ahlman.fi
    // Sivulle myös info: Tiedot tulevat Opetushallituksen Organisaatiotietopalvelusta, joka päivittää ne Yritys- ja yhteisötietojärjestelmästä. Muutokset tietoihin sitä kautta.
    
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

export default connect(mapStateToProps, mapDispatchToProps, null, {pure: false})(OmatTiedot)
