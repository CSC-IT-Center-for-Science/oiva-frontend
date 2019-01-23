import React, { Component } from 'react'
import styled from 'styled-components'

import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"

import { COLORS } from "../../../../../../modules/styles"

const MuutosListWrapper = styled.div`
`

const MuutosWrapper = styled.div`
  margin-left: 30px;
  display: flex;
`

const Heading = styled.h4`
  margin: 18px 0;
`

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

const Area = styled.div`
  margin: 15px 0;
`

class TaloudellisetYhteenveto extends Component {
  render() {
    const { muutokset, fields, heading } = this.props
    const { length } = fields

    return (
      <MuutosListWrapper>
        {length > 0 &&
        <Heading>{ heading }</Heading>
        }
        {fields.map((field, index) => {
          const identifier = "taloudelliset"

          return (
            <MuutosWrapper key={identifier}>
              <RenderTaloudellisetYhteenveto
                key={index}
                muutokset={muutokset}
              />
            </MuutosWrapper>
          )
        })}
      </MuutosListWrapper>
    )
  }
}

const RenderTaloudellisetYhteenveto = (muutokset) => {
  return (
    <PerusteluWrapper>
      <PerusteluInner>
      <Area>
          <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.EDELLYTYKSET.FI}:</Label>
          <Content>{muutokset.muutokset[0].edellytykset}</Content>
        </Area>
        <Area>
          <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.VAIKUTUKSET.FI}:</Label>
          <Content>{muutokset.muutokset[0].vaikutukset}</Content>
        </Area>
        <Area>
          <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.SOPEUTTAMINEN.FI}:</Label>
          <Content>{muutokset.muutokset[0].sopeuttaminen}</Content>
        </Area>
        <Area>
          <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.INVESTOINNIT.FI}:</Label>
          <Content>{muutokset.muutokset[0].investoinnit}</Content>
        </Area>
        <Area>
          <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.KUSTANNUKSET.FI}:</Label>
          <Content>{muutokset.muutokset[0].kustannukset}</Content>
        </Area>
        <Area>
          <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.RAHOITUS.FI}:</Label>
          <Content>{muutokset.muutokset[0].rahoitus}</Content>
        </Area>
        <Area>
          <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.OMAVARAISUUSASTE.FI}:</Label>
          <Content>{muutokset.muutokset[0].omavaraisuusaste}</Content>
        </Area>
        <Area>
          <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.MAKSUVALMIUS.FI}:</Label>
          <Content>{muutokset.muutokset[0].maksuvalmius}</Content>
        </Area>
        <Area>
          <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.VELKAANTUNEISUUS.FI}:</Label>
          <Content>{muutokset.muutokset[0].velkaantuneisuus}</Content>
        </Area>
        <Area>
          <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.KANNATTAVUUS.FI}:</Label>
          <Content>{muutokset.muutokset[0].kannattavuus}</Content>
        </Area>
        <Area>
          <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.KUMULATIIVINEN.FI}:</Label>
          <Content>{muutokset.muutokset[0].kumulatiivinen}</Content>
        </Area>
      </PerusteluInner>
    </PerusteluWrapper>

  )
}

export default TaloudellisetYhteenveto
