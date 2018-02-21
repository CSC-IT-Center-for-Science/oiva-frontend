import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import Moment from 'react-moment'

import Section from './Section'

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
    const { esittelija } = meta

    return (
      <InnerContentContainer>
        <InnerContentWrapper>
          <TopSectionWrapper>
            <h2>Järjestämislupa</h2>
            <Row>Diaarinumero:&nbsp;{diaarinumero}</Row>
            <Row>Päätös:&nbsp;<a href={`${API_BASE_URL}/api/pdf/${diaarinumero}`}><img src={pdfIcon} alt="Järjestämislupa PDF-muodossa"/><Moment format="MM.DD.YYYY">{paatospvm}</Moment></a></Row>
            <Row>Voimassaolo:&nbsp;<Moment format="MM.DD.YYYY">{alkupvm}</Moment>&nbsp;alkaen</Row>
            <Row>Esittelijä:&nbsp;{esittelija ? esittelija :  '-'}</Row>
          </TopSectionWrapper>

          <LupaDetailsWrapper>
            {Object.keys(LUPA_SECTIONS).map((key, i) =>
              <Section
                key={i}
                heading={LUPA_SECTIONS[key].heading}
                target={key}
                ytunnus={jarjestajaYtunnus}
                diaarinumero={diaarinumero}
                maaraykset={this.parseMaaraykset(parseInt(key, 10))}
              />
            )}
          </LupaDetailsWrapper>

        </InnerContentWrapper>
      </InnerContentContainer>
    )
  }

  parseMaaraykset(kohdeId) {
    const { maaraykset } = this.props.lupa.data

    if (!maaraykset) {
      return null
    }

    return _.filter(maaraykset, (maarays) => {
      return maarays.kohde.id === kohdeId
    })
  }
}

export default Jarjestamislupa
