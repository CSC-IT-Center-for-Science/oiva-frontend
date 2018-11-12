import React, { Component } from 'react'
import styled from 'styled-components'
import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"
import { getIndex } from "../modules/muutosUtil"
import Select from '../../../../../../modules/Select'
import { handleMuutosperusteluSelectChange } from "../modules/muutosperusteluUtil"

const PerusteluTyovoimaWrapper = styled.div`
  margin-bottom: 20px;
`

const Area = styled.div`
  margin: 15px 0;
`
const Label = styled.label`
  flex: 1;
  font-size: 14px;
  align-self: center;
  margin: 0 10px 0 20px;
  font-weight:bold;
`

const Instruction = styled.div`
  display: flex;
  font-size: 14px;
  align-self: center;
  margin: 5px 0 5px 20px;
`

class PerusteluTyovoima extends Component {
    constructor(props) {
      super(props)
      this.state = {
        selectedOption: props.muutosperustelukoodiarvo
      }
    }

    handleChange(selectedOption) {
      this.setState({ selectedOption })
      const { muutokset, fields, muutos } = this.props
      handleMuutosperusteluSelectChange(muutokset, fields, muutos, selectedOption)
    }

    render() {
      const vuosi = this.props.muutosperustelut.data[0].voimassaAlkuPvm.split("-")[0]

      const { muutokset, fields, koodiarvo, perusteluteksti_tyovoima, koodisto } = this.props

      console.log("teksti: " + JSON.stringify(perusteluteksti_tyovoima))
      const { tarpeellisuus, henkilosto, osaaminen, pedagogiset, sidosryhma, suunnitelma, vuodet } = perusteluteksti_tyovoima
      const { arvo_1, arvo_2, arvo_3 } = vuodet

      // ELY-keskukset hardcode
      const options = [
        { value: 'Etelä-Pohjanmaa', label: 'Etelä-Pohjanmaa' },
        { value: 'Etelä-Savo', label: 'Etelä-Savo' },
        { value: 'Häme', label: 'Häme' },
        { value: 'Kaakkois-Suomi', label: 'Kaakkois-Suomi' },
        { value: 'Kainuu', label: 'Kainuu' },
        { value: 'Keski-Suomi', label: 'Keski-Suomi' },
        { value: 'Lappi', label: 'Lappi' },
        { value: 'Pirkanmaa', label: 'Pirkanmaa' },
        { value: 'Pohjanmaa', label: 'Pohjanmaa' },
        { value: 'Pohjois-Karjala', label: 'Pohjois-Karjala' },
        { value: 'Pohjois-Pohjanmaa', label: 'Pohjois-Pohjanmaa' },
        { value: 'Pohjois-Savo', label: 'Pohjois-Savo'},
        { value: 'Satakunta', label: 'Satakunta' },
        { value: 'Uusimaa', label: 'Uusimaa' },
        { value: 'Varsinais-Suomi', label: 'Varsinais-Suomi' }
      ];
      const { selectedOption } = this.state


      return (
        <PerusteluTyovoimaWrapper>
          <h4>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.KUVAUS.FI}</h4>
          <Area>
            <h4>1. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.TARPEELLISUUS.FI}</h4>
            <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.OHJEET.TARPEELLISUUS.FI}</Instruction>
            <textarea
              rows="5"
              defaultValue={tarpeellisuus !== null ? tarpeellisuus : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_tyovoima.tarpeellisuus = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
            <h4>2. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.JARJESTAMISEDELLYTYKSET.FI}</h4>
            <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.HENKILOSTO.FI}</Label>
            <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.OHJEET.HENKILOSTO.FI}</Instruction>
            <textarea
              rows="5"
              defaultValue={henkilosto !== null ? henkilosto : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_tyovoima.henkilosto = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
            <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.OSAAMINEN.FI}</Label>
            <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.OHJEET.OSAAMINEN.FI}</Instruction>
            <textarea
              rows="5"
              defaultValue={osaaminen !== null ? osaaminen : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_tyovoima.osaaminen = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
            <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.PEDAGOGISET.FI}</Label>
            <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.OHJEET.PEDAGOGISET.FI}</Instruction>
            <textarea
              rows="5"
              defaultValue={pedagogiset !== null ? pedagogiset : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_tyovoima.pedagogiset = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
            <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.SIDOSRYHMA.FI}</Label>
            <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.OHJEET.SIDOSRYHMA.FI}</Instruction>
            <textarea
              rows="5"
              defaultValue={sidosryhma !== null ? sidosryhma : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_tyovoima.sidosryhma = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
            <h4>3. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.SUUNNITELMA.FI}</h4>
            <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.OHJEET.SUUNNITELMA.FI}</Instruction>
            <textarea
              rows="5"
              defaultValue={suunnitelma !== null ? suunnitelma : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_tyovoima.suunnitelma = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
            <h4>4. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.YHTEISTYO.FI}</h4>
            <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.OHJEET.YHTEISTYO.FI}</Instruction>
            <Select
              name={`select-muutosperustelu-${koodisto}-${koodiarvo}`}
              value={selectedOption}
              options={options}
              onChange={this.handleChange.bind(this)}
              placeholder="Valitse ely-keskus..."

            />
            <h4>5. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.OPISKELIJAVUOSIARVIO.FI}</h4>
            <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.TYOVOIMA.OHJEET.VUODET.FI}</Instruction>

            <Label>{vuosi}</Label>
            <input
              type="number"
              defaultValue={arvo_1.maara  !== null ? arvo_1.maara  : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_tyovoima.vuodet.arvo_1.vuosi = vuosi
                obj.meta.perusteluteksti_tyovoima.vuodet.arvo_1.maara = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
            <Label>{parseFloat(vuosi) + 1}</Label>
            <input
              type="number"
              defaultValue={arvo_2.maara  !== null ? arvo_2.maara  : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_tyovoima.vuodet.arvo_2.vuosi = vuosi
                obj.meta.perusteluteksti_tyovoima.vuodet.arvo_2.maara = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
            <Label>{parseFloat(vuosi) + 2}</Label>
            <input
              type="number"
              defaultValue={arvo_3.maara  !== null ? arvo_3.maara  : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_tyovoima.vuodet.arvo_3.vuosi = vuosi
                obj.meta.perusteluteksti_tyovoima.vuodet.arvo_3.maara = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
          </Area>
        </PerusteluTyovoimaWrapper>
      )
    }
  }
  
  export default PerusteluTyovoima