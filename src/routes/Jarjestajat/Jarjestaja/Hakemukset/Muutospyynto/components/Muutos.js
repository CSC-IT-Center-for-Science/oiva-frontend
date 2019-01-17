import React, { Component } from 'react'
import styled from 'styled-components'

import PerusteluContainer from '../containers/PerusteluContainer'
import Indikaattori from './Indikaattori'
import arrow from 'static/images/arrow-down.svg'

import { COLORS } from "../../../../../../modules/styles"
import { MUUTOS_TYPES, MUUTOS_TYPE_TEXTS } from "../modules/uusiHakemusFormConstants"
import { getTutkintoNimiByKoodiarvo} from "../modules/koulutusUtil"

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
  cursor: pointer;
  
  &:first-child {
    border-top: 1px solid ${props => props.isActive ? COLORS.OIVA_GREEN : COLORS.BORDER_GRAY };
  }
`


const Arrow = styled.img`
  ${props => props.rotated ? `transform: rotate(180deg);` : null};
  margin-left: auto;
`

const Div = styled.div`
  ${props => props.margin ? props.margin : null}
`
const Parent = styled.div`
  ${props => props.margin ? props.margin : null}
  padding-right:10px;
`

const MuutosTyyppi = styled.div`
  width: 80px;
`

class Muutos extends Component {
  constructor(props) {
    super(props)
    this.toggleMuutos = this.toggleMuutos.bind(this)
    this.state = {
      isHidden: true
    }
  }

  toggleMuutos() {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  render() {
    const { isHidden } = this.state
    const { muutokset, muutos, fields, kategoria } = this.props
    const { koodiarvo, type, meta, muutosperustelukoodiarvo, koodisto, kuvaus, nimi, label, arvo, parentId } = muutos
    const { perusteluteksti, perusteluteksti_oppisopimus, perusteluteksti_vaativa, perusteluteksti_tyovoima } = meta
    const { perusteluteksti_vankila, perusteluteksti_kuljetus_perus, perusteluteksti_kuljetus_jatko} = meta

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
          <MuutosHeader isActive={!isHidden}  onClick={this.toggleMuutos}>
            <MuutosTyyppi>{tyyppi}</MuutosTyyppi>
            {parentId != null && parentId != '' ?
              <Parent>{getTutkintoNimiByKoodiarvo(parentId)}: </Parent>
              : ''
            }
            <Div>{name}</Div>
            <Arrow src={arrow} rotated={!isHidden} />
          </MuutosHeader>
          {perusteluteksti !== null && muutosperustelukoodiarvo !== null &&
            <Indikaattori status="ok" text="Perusteltu" />
          }
        </MuutosTop>
        {!isHidden &&
          <PerusteluContainer
            helpText={helpText}
            koodiarvo={koodiarvo}
            perusteluteksti={perusteluteksti}
            perusteluteksti_oppisopimus={perusteluteksti_oppisopimus}
            perusteluteksti_vaativa={perusteluteksti_vaativa}
            perusteluteksti_tyovoima={perusteluteksti_tyovoima}
            perusteluteksti_vankila={perusteluteksti_vankila}
            perusteluteksti_kuljetus_perus={perusteluteksti_kuljetus_perus}
            perusteluteksti_kuljetus_jatko={perusteluteksti_kuljetus_jatko}
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

export default Muutos
