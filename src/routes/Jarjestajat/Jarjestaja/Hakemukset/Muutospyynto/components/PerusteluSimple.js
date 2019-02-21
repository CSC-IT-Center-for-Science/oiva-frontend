import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from "../../../../../../modules/styles"

import { getMuutosperusteluByKoodiArvo } from "../modules/muutosperusteluUtil"
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

class PerusteluSimple extends Component {
  componentWillMount() {
    const { muutosperustelut } = this.props

    if (muutosperustelut && !muutosperustelut.fetched) {
      this.props.fetchMuutosperustelut()
    }
  }

  render() {
    const { perusteluteksti, muutosperustelukoodiarvo } = this.props
    let perusteluText = 'Ei saatavilla'
    const perusteluObj = getMuutosperusteluByKoodiArvo(muutosperustelukoodiarvo)
    if (perusteluObj) {
      perusteluText = perusteluObj.label
    }

    return (
      <PerusteluWrapper>
        <PerusteluInner>
          <Area>
            <Label>Perustelun taustalla oleva syy:</Label>
            <Content>{perusteluText}</Content>
          </Area>
          <Area>
            <Label>Perusteluteksti:</Label>
            <Content>{perusteluteksti}</Content>
          </Area>
        </PerusteluInner>
      </PerusteluWrapper>
    )
  }
}

export default PerusteluSimple
