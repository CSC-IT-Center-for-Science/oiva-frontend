import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import styled from 'styled-components'

import MuutospyyntoList from './MuutospyyntoList'
import Loading from '../../../../../modules/Loading'
import { MessageWrapper } from "../../../../../modules/elements"

import { COLORS } from "../../../../../modules/styles"
import { slugify } from "../../../../../modules/helpers"
import {ROLE_KAYTTAJA} from "../../../../../modules/constants";
import _ from 'lodash'
import { HAKEMUS_VIESTI, HAKEMUS_VIRHE } from '../Muutospyynto/modules/uusiHakemusFormConstants';

const Wrapper = styled.div`
  position: relative;
`

const UusiMuutospyynto = styled(Link)`
  position: absolute;
  right: 0;
  top: 10px;
  padding: 6px 12px;
  color: ${COLORS.OIVA_GREEN};
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`

class HakemuksetJaPaatokset extends Component {
  getMuutospyyntoUrl() {
    const {  match } = this.props
    return `${match.url}/uusi`
  }

  componentWillMount() {
    const { fetched, isFetching, hasErrored } = this.props.muutospyynnot
    if (!fetched && !isFetching && ! hasErrored) {
      const { ytunnus } = this.props.match.params
      this.props.fetchMuutospyynnot(ytunnus)
    }
  }

  render() {
    const { isFetching, fetched, hasErrored, data } = this.props.muutospyynnot


    if(sessionStorage.getItem('role')!==ROLE_KAYTTAJA) {
        return (
            <MessageWrapper><h3>{HAKEMUS_VIESTI.KIRJAUTUMINEN.FI}</h3></MessageWrapper>
        )
    }

    // TODO: organisaation oid pitää tarkastaa jotain muuta kautta kuin voimassaolevasta luvasta
    const { jarjestajaOid } = this.props.lupa.data
    if(sessionStorage.getItem('oid')!==jarjestajaOid) {
        return (
            <MessageWrapper><h3>{HAKEMUS_VIESTI.KIRJAUTUMINEN.FI}</h3></MessageWrapper>
        )
    }


    if (fetched) {
        return (
            <Wrapper>
              <h2>Hakemukset</h2>
              <UusiMuutospyynto to={this.getMuutospyyntoUrl()}>Luo uusi</UusiMuutospyynto>
              <MuutospyyntoList muutospyynnot={data}/>
            </Wrapper>
        )
    } else if (isFetching) {
        return (
            <Loading/>
        )
    } else if (hasErrored) {
        return (
            <MessageWrapper><h3>{HAKEMUS_VIRHE.HAKEMUKSIENNLATAUS.FI}</h3></MessageWrapper>
        )
    } else {
        return null
    }
  }
}

export default withRouter(HakemuksetJaPaatokset)
