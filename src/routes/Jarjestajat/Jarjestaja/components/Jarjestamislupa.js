import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import Moment from 'react-moment'
import { withRouter } from 'react-router-dom'

import LupaSection from './LupaSection'

import { LUPA_SECTIONS } from "../modules/constants"
import { InnerContentContainer, InnerContentWrapper  } from "../../../../modules/elements"
import { COLORS } from "../../../../modules/styles"
import { API_BASE_URL } from "../../../../modules/constants"

import pdfIcon from 'static/images/icon-pdf-small.png'

const TopSectionWrapper = styled.div`
  margin: -30px -28px;
  padding: 15px 60px 30px;
  border-bottom: 1px solid ${COLORS.BORDER_GRAY};
  position: relative;
`

const LupaDetailsWrapper = styled.div`
  margin: 45px auto;
`

const Row = styled.div`
  display: flex;
  align-items: flex-end;
  margin: 8px 0;
  
  a {
    display: flex;
    align-items: flex-end;
  }
`

class Jarjestamislupa extends Component {
  render() {
    const { diaarinumero, alkupvm, paatospvm, meta, jarjestajaYtunnus } = this.props.lupa.data
    const { kohteet } = this.props.lupa
    const { muutospyynnot } = this.props
    const { ytunnus } = this.props
    const { esittelija } = meta
    const url = muutospyynnot.data.length > 0 ? `/jarjestajat/${ytunnus}/hakemukset-ja-paatokset` : `/jarjestajat/${ytunnus}/hakemukset-ja-paatokset/uusi`

    return (
      <InnerContentContainer>
        <InnerContentWrapper>
          <TopSectionWrapper>
            <h2>Järjestämislupa</h2>
            <Row>Diaarinumero:&nbsp;{diaarinumero}</Row>
            <Row>Päätös:&nbsp;<a href={`${API_BASE_URL}/pdf/${diaarinumero}`} target="_blank"><img src={pdfIcon} alt="Järjestämislupa PDF-muodossa"/><Moment format="DD.MM.YYYY">{paatospvm}</Moment></a></Row>
            <Row>Voimassaolo:&nbsp;<Moment format="DD.MM.YYYY">{alkupvm}</Moment>&nbsp;alkaen</Row>
            <Row>Esittelijä:&nbsp;{esittelija ? esittelija :  '-'}</Row>
          </TopSectionWrapper>
          <LupaDetailsWrapper>
            {Object.keys(LUPA_SECTIONS).map((k, i) =>
              <LupaSection
                kohde={kohteet[k]}
                ytunnus={jarjestajaYtunnus}
                key={i}
              />
            )}
          </LupaDetailsWrapper>
        </InnerContentWrapper>
      </InnerContentContainer>
    )
  }
}

export default withRouter(Jarjestamislupa)
