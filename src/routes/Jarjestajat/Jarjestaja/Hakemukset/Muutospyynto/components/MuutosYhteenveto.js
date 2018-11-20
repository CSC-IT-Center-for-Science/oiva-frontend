import React, { Component } from 'react'
import styled from 'styled-components'

import PerusteluSimple from './PerusteluSimple'
import PerusteluOppisopimusYhteenveto from './PerusteluOppisopimusYhteenveto'
import PerusteluVankilaYhteenveto from './PerusteluVankilaYhteenveto'
import Indikaattori from './Indikaattori'

import { COLORS } from "../../../../../../modules/styles"
import { MUUTOS_TYPES, MUUTOS_TYPE_TEXTS } from "../modules/uusiHakemusFormConstants"
import { KOODISTOT } from "../../../modules/constants"

const MuutosWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const MuutosTop = styled.div`
  width: 100%;
  display: flex;
`

const MuutosHeader = styled.div`
  width: 85%;
  background-color: ${props => props.isActive ? COLORS.ACTIVE_BLUE : COLORS.BG_GRAY};
  padding: 10px 20px;
  border-bottom: 1px solid ${props => props.isActive ? COLORS.OIVA_GREEN : COLORS.BORDER_GRAY };
  border-right: 1px solid ${props => props.isActive ? COLORS.OIVA_GREEN : COLORS.BORDER_GRAY };
  border-left: 3px solid ${COLORS.OIVA_GREEN};
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  display: flex;
  
  &:first-child {
    border-top: 1px solid ${props => props.isActive ? COLORS.OIVA_GREEN : COLORS.BORDER_GRAY };
  }
`

const Div = styled.div`
  ${props => props.margin ? props.margin : null}
`

const MuutosTyyppi = styled.div`
  width: 80px;
`

class MuutosYhteenveto extends Component {
  render() {
    const { muutokset, muutos, fields, kategoria } = this.props
    const { koodiarvo, type, meta, muutosperustelukoodiarvo, koodisto, nimi, label, arvo } = muutos

    const { perusteluteksti } = meta
    const helpText = "Perustele lyhyesti miksi tälle muutokselle on tarvetta"
    const tyyppi =
      type === MUUTOS_TYPES.ADDITION ? MUUTOS_TYPE_TEXTS.ADDITION.FI :
        type === MUUTOS_TYPES.REMOVAL ? MUUTOS_TYPE_TEXTS.REMOVAL.FI :
          type === MUUTOS_TYPES.CHANGE ? MUUTOS_TYPE_TEXTS.CHANGE.FI : null

    let name = `${koodiarvo} ${nimi}`
    if(koodisto==='osaamisala') {
      name = `${koodiarvo} ${nimi} (rajoite)`
    }

    if (kategoria === 'toimialue') {
      name = `${label}`
    }

    if (kategoria === 'opiskelijavuosi') {
      name = koodiarvo === "3"
        ? "Vähimmäisopiskelijavuosimäärä: " + arvo
        : koodiarvo === "2"
          ? "Vaativa koulutus: " + arvo
          : koodiarvo === "4"
            ? "Sisäoppilaitosmuotoinen opetus: " + arvo
            : null
    }

    if (kategoria === 'muumuutos') {
      name = nimi
    }

    return (
      <MuutosWrapper>
        <MuutosTop>
          <MuutosHeader>
            <MuutosTyyppi>{tyyppi}</MuutosTyyppi>
            <Div>{name}</Div>
          </MuutosHeader>
          {perusteluteksti !== null && muutosperustelukoodiarvo !== null &&
            <Indikaattori status="ok" text="Perusteltu" />
          }
        </MuutosTop>
        { koodisto === KOODISTOT.OIVA_MUUT && type === MUUTOS_TYPES.ADDITION && koodiarvo === "1" ? 
          <PerusteluOppisopimusYhteenveto 
            helpText={helpText}
            koodiarvo={koodiarvo}
            perustelut={meta.perusteluteksti_oppisopimus}
            muutosperustelukoodiarvo={muutosperustelukoodiarvo}
            muutokset={muutokset}
            muutos={muutos}
            fields={fields}
          />
         :
         koodisto === KOODISTOT.OIVA_MUUT && type === MUUTOS_TYPES.ADDITION && (koodiarvo === "5" || koodiarvo === "13") ?
          <PerusteluVankilaYhteenveto 
            helpText={helpText}
            koodiarvo={koodiarvo}
            perustelut={meta.perusteluteksti_vankila}
            muutosperustelukoodiarvo={muutosperustelukoodiarvo}
            muutokset={muutokset}
            muutos={muutos}
            fields={fields}
          />
          :         
          <PerusteluSimple
            helpText={helpText}
            koodiarvo={koodiarvo}
            perusteluteksti={perusteluteksti}
            muutosperustelukoodiarvo={muutosperustelukoodiarvo}
            muutokset={muutokset}
            muutos={muutos}
            fields={fields}
          />
          }
      </MuutosWrapper>
    )
  }
}

export default MuutosYhteenveto
