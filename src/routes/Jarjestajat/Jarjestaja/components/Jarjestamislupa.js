import React, { Component } from 'react'
import styled from 'styled-components'
import Moment from 'react-moment'
import { withRouter } from 'react-router-dom'

import LupaSection from './LupaSection'

import { LUPA_SECTIONS } from "../modules/constants"
import { InnerContentContainer, InnerContentWrapper  } from "../../../../modules/elements"
import { COLORS } from "../../../../modules/styles"
import { API_BASE_URL, LUPA_EXCEPTION_PATH } from "../../../../modules/constants"

import pdfIcon from 'static/images/icon-pdf-small.png'
import { LUPA_LISAKOULUTTAJAT } from "../../modules/constants"

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
    const { diaarinumero, alkupvm, meta, jarjestajaYtunnus } = this.props.lupa.data
    const { kohteet } = this.props.lupa
    const { esittelija } = meta


    // Luvan poikkeuskäsittely erikoisluville (17kpl)
    let pdfLink = ''
    const lupaException = LUPA_LISAKOULUTTAJAT[jarjestajaYtunnus]
    if (lupaException) {
      const { pdflink } = lupaException
      pdfLink = pdflink
    }

    return (
      <InnerContentContainer>
        <InnerContentWrapper>

            {lupaException ?
              <TopSectionWrapper>
                <h2>Ajantasainen järjestämislupa</h2>
                <Row>Viimeisin päätös sisältäen ajantasaisen järjestämisluvan:&nbsp;<a href={`${LUPA_EXCEPTION_PATH}${pdfLink}`} target="_blank"><img src={pdfIcon} alt="Järjestämislupa PDF-muodossa"/>{diaarinumero}</a></Row>
              </TopSectionWrapper>
              :
              <TopSectionWrapper>
                <h2>Ajantasainen järjestämislupa</h2>
                <Row>Viimeisin päätös sisältäen ajantasaisen järjestämisluvan:&nbsp;<a href={`${API_BASE_URL}/pdf/${diaarinumero}`} target="_blank"><img src={pdfIcon} alt="Järjestämislupa PDF-muodossa"/>{diaarinumero}</a></Row>
                <Row>Luvan voimaantulopäivämäärä:&nbsp;<Moment format="DD.MM.YYYY">{alkupvm}</Moment>&nbsp;lukien</Row>
                <Row>Esittelijä:&nbsp;{esittelija ? esittelija :  '-'}</Row>
              </TopSectionWrapper>
            }

          {lupaException ? '' :
            <LupaDetailsWrapper>
              {Object.keys(LUPA_SECTIONS).map((k, i) =>
                <LupaSection
                  kohde={kohteet[k]}
                  ytunnus={jarjestajaYtunnus}
                  key={i}
                />
              )}
            </LupaDetailsWrapper>
          }

        </InnerContentWrapper>
      </InnerContentContainer>
    )
  }
}

export default withRouter(Jarjestamislupa)
