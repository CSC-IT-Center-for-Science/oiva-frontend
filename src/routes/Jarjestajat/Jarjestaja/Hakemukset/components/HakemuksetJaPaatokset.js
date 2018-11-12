import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import styled from 'styled-components'

import MuutospyyntoList from './MuutospyyntoList'
import Loading from '../../../../../modules/Loading'

import { COLORS } from "../../../../../modules/styles"
import { slugify } from "../../../../../modules/helpers"
import {ROLE_KAYTTAJA} from "../../../../../modules/constants";
import _ from 'lodash'

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
            <h2>Uuden hakemuksen tekeminen vaatii kirjautumisen palveluun.</h2>
        )
    }

    // TODO: organisaation oid pitää tarkastaa jotain muuta kautta kuin voimassaolevasta luvasta
    const { jarjestajaOid } = this.props.lupa.data
    if(sessionStorage.getItem('oid')!==jarjestajaOid) {
        return (
            <h2>Sinulla ei ole oikeuksia katsoa toisen organisaation hakemuksia.</h2>
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
            <h2>Hakemuksia ladattessa tapahtui virhe</h2>
        )
    } else {
        return null
    }
  }
}

export default withRouter(HakemuksetJaPaatokset)
