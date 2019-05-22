import React, { Component } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { COLORS } from "../../../../../../modules/styles"
import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"
import { Area } from './MuutospyyntoWizardComponents'

const PerusteluWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 3px solid ${COLORS.BORDER_GRAY};
  padding: 0 110px 0 30px;
  margin: 10px 40px 20px 40px;
`

const PerusteluInner = styled.div`
  background-color: ${COLORS.BG_GRAY};
  padding: 10px 30px;
`

const Label = styled.div`
  margin-bottom: 5px;
`

const Content = styled.div`
  margin-left: 20px;
  font-style: italic;
`

class PerusteluTyovoimaYhteenveto extends Component {
  render() {
    const { perustelut } = this.props
    let perusteluText = 'Ei saatavilla'
    let tyovoimaMetaSuomeksi = null
    if (perustelut.yhteistyo && 'metadata' in perustelut.yhteistyo) {
      tyovoimaMetaSuomeksi = _.find(perustelut.yhteistyo.metadata, (m) => {return m.kieli === "FI"})
    }

    return (
      <PerusteluWrapper>
        <PerusteluInner>
          <Area>
            <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.TARPEELLISUUS.FI}</Label>
            <Content>{perustelut.tarpeellisuus || perusteluText}</Content>
          </Area>
          <Area>
            <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.JARJESTAMISEDELLYTYKSET.FI}</Label>
            <Content>{perustelut.henkilosto || perusteluText}</Content>
          </Area>
          <Area>
            <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.OSAAMINEN.FI}</Label>
            <Content>{perustelut.osaaminen || perusteluText}</Content>
          </Area>
          <Area>
            <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.PEDAGOGISET.FI}</Label>
            <Content>{perustelut.pedagogiset || perusteluText}</Content>
          </Area>
          <Area>
            <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.SIDOSRYHMA.FI}</Label>
            <Content>{perustelut.sidosryhma || perusteluText}</Content>
          </Area>
          <Area>
            <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.SUUNNITELMA.FI}</Label>
            <Content>{perustelut.suunnitelma || perusteluText}</Content>
          </Area>
          <Area>
            <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.YHTEISTYO.FI}</Label>
            <Content>{(tyovoimaMetaSuomeksi && 'nimi' in tyovoimaMetaSuomeksi && tyovoimaMetaSuomeksi.nimi) || perusteluText}</Content>
          </Area>
          <Area>
            <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.OPISKELIJAVUOSIARVIO.FI}</Label>
            <Content>{perustelut.vuodet.arvo_1.vuosi} {perustelut.vuodet.arvo_1.maara || perusteluText} </Content>
            <Content>{perustelut.vuodet.arvo_2.vuosi} {perustelut.vuodet.arvo_2.maara || perusteluText} </Content>
            <Content>{perustelut.vuodet.arvo_3.vuosi} {perustelut.vuodet.arvo_3.maara || perusteluText} </Content>
          </Area>
        </PerusteluInner>
      </PerusteluWrapper>
    )
  }
}

export default PerusteluTyovoimaYhteenveto
