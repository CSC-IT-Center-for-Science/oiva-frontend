import React, { Component } from 'react'
import styled from 'styled-components'
import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"
import { getIndex } from "../modules/muutosUtil"
import { Checkbox } from './MuutospyyntoWizardComponents'


const PerusteluKuljettajaJatkoWrapper = styled.div`
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

const Tarkenne = styled.div`
  display: flex;
  font-size: 15px;
  align-self: center;
  margin: 15px 0 5px 20px;
`

const ChkTitle = styled.div`
  margin-left: 40px;
  width:600px;
`
const CheckboxWrapper= styled.div`
  margin-left: 14px;
  margin-top: 20px;
`
const InputWrapper= styled.div`
  margin-left: 20px;
`

class PerusteluKuljettajaJatko extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const vuosi = this.props.muutosperustelut.data[0].voimassaAlkuPvm.split("-")[0]

    const { muutokset, fields, koodiarvo, perusteluteksti_kuljetus_jatko, koodisto } = this.props
    const { tarpeellisuus, voimassaoleva, voimassaoleva_pvm, suunnitelma } = perusteluteksti_kuljetus_jatko
    const { osaaminen ,toimipisteet, henkilot, kanta_linja_auto, kanta_kuorma_auto } = perusteluteksti_kuljetus_jatko
    const { kanta_peravaunu, kanta_muut, valineet_asetus, valineet_muut } = perusteluteksti_kuljetus_jatko

    return (
      <PerusteluKuljettajaJatkoWrapper>
        <h4>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.JATKO.FI}</h4>
        <Area>
          <h4>1. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.TARPEELLISUUS.FI}</h4>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.TARPEELLISUUS.FI}</Instruction>
          <textarea
            rows="5"
            defaultValue={tarpeellisuus !== null ? tarpeellisuus : undefined}
            onBlur={(e) => {
              const i = getIndex(muutokset, koodiarvo)
              let obj = fields.get(i)
              obj.meta.perusteluteksti_kuljetus_jatko.tarpeellisuus = e.target.value
              fields.remove(i)
              fields.insert(i, obj)
            }}
          />
          <h4>2. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.VOIMASSAOLEVA.FI}</h4>
          <CheckboxWrapper>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.VOIMASSAOLEVA_PVM.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.VOIMASSAOLEVA_PVM.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.KYLLA.FI}</ChkTitle></label>
            </Checkbox>
          </CheckboxWrapper>
          <Tarkenne>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.VOIMASSAOLEVA.FI}</Tarkenne>
          <InputWrapper>
            <input
              type="text"
              defaultValue={voimassaoleva_pvm !== null ? voimassaoleva_pvm : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_kuljetus_jatko.voimassaoleva_pvm = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
          </InputWrapper>
          <h4>3. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.SUUNNITELMA.FI}</h4>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.SUUNNITELMA.FI}</Instruction>
          <textarea
            rows="5"
            defaultValue={suunnitelma !== null ? suunnitelma : undefined}
            onBlur={(e) => {
              const i = getIndex(muutokset, koodiarvo)
              let obj = fields.get(i)
              obj.meta.perusteluteksti_kuljetus_jatko.suunnitelma = e.target.value
              fields.remove(i)
              fields.insert(i, obj)
            }}
          />
          <h4>4. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OSAAMINEN.FI}</h4>
          <textarea
            rows="5"
            defaultValue={osaaminen !== null ? osaaminen : undefined}
            onBlur={(e) => {
              const i = getIndex(muutokset, koodiarvo)
              let obj = fields.get(i)
              obj.meta.perusteluteksti_kuljetus_jatko.osaaminen = e.target.value
              fields.remove(i)
              fields.insert(i, obj)
            }}
          />
          <h4>5. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.JOHTAJA.FI}</h4>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.JOHTAJA_TARKENNUS.FI}</Instruction>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.JOHTAJA.FI}</Instruction>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TOIMIPISTE.FI}</Instruction>
          <InputWrapper>
            <input
              type="text"
              defaultValue={toimipisteet.nimi !== null ? toimipisteet.nimi : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_kuljetus_jatko.toimipisteet.nimi = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
          </InputWrapper>
          <CheckboxWrapper>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LUPA.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LUPA.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LUPA.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KUORMA_AUTO.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KUORMA_AUTO.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KUORMA_AUTO.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LINJA_AUTO.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LINJA_AUTO.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LINJA_AUTO.FI}</ChkTitle></label>
            </Checkbox>
          </CheckboxWrapper>
          <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS.FI}</Label>
          <CheckboxWrapper>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_C.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_C.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_C.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_CE.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_CE.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_CE.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_D.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_D.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_D.FI}</ChkTitle></label>
            </Checkbox>
          </CheckboxWrapper>
          <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO.FI}</Label>
          <CheckboxWrapper>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_LINJA_AUTO.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_LINJA_AUTO.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_LINJA_AUTO.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_YHDISTELMA.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_YHDISTELMA.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_YHDISTELMA.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_PUUTAVARA.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_PUUTAVARA.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_PUUTAVARA.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSPALVELU.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSPALVELU.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSPALVELU.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSALA.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSALA.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSALA.FI}</ChkTitle></label>
            </Checkbox>
          </CheckboxWrapper>
          <h4>6. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OPETTAJA.FI}</h4>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.OPETTAJA_TARKENNUS.FI}</Instruction>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.OPETTAJA_JATKO.FI}</Instruction>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.HENKILO.FI}</Instruction>
          <InputWrapper>
            <input
              type="text"
              defaultValue={henkilot.nimi !== null ? henkilot.nimi : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_kuljetus_jatko.henkilot.nimi = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
          </InputWrapper>
          <CheckboxWrapper>
            <Checkbox>
              <input
                type="checkbox"
                id={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LUPA.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LUPA.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LUPA.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KUORMA_AUTO.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KUORMA_AUTO.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KUORMA_AUTO.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LINJA_AUTO.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LINJA_AUTO.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LINJA_AUTO.FI}</ChkTitle></label>
            </Checkbox>
          </CheckboxWrapper>
          <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS.FI}</Label>
          <CheckboxWrapper>
            <Checkbox>
              <input
                type="checkbox"
                id={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_C.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_C.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_C.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_CE.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_CE.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_CE.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_D.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_D.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_D.FI}</ChkTitle></label>
            </Checkbox>
          </CheckboxWrapper>
          <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO.FI}</Label>
          <CheckboxWrapper>
            <Checkbox>
              <input
                type="checkbox"
                id={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_LINJA_AUTO.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_LINJA_AUTO.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_LINJA_AUTO.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_YHDISTELMA.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_YHDISTELMA.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_YHDISTELMA.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_PUUTAVARA.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_PUUTAVARA.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_PUUTAVARA.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSPALVELU.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSPALVELU.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSPALVELU.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSALA.FI}
                checked={voimassaoleva}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={'opettaja-'+MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSALA.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSALA.FI}</ChkTitle></label>
            </Checkbox>
          </CheckboxWrapper>
          <h4>7. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KANTA.FI}</h4>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.KANTA.FI}</Instruction>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KANTA_LINJA_AUTO.FI}</Instruction>
          <InputWrapper>
            <input
              type="text"
              defaultValue={kanta_linja_auto !== null ? kanta_linja_auto : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_kuljetus_jatko.kanta_linja_auto = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
          </InputWrapper>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KANTA_KUORMA_AUTO.FI}</Instruction>
          <InputWrapper>
            <input
              type="text"
              defaultValue={kanta_kuorma_auto !== null ? kanta_kuorma_auto : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_kuljetus_jatko.kanta_kuorma_auto = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
          </InputWrapper>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KANTA_PERAVAUNU.FI}</Instruction>
          <InputWrapper>
            <input
              type="text"
              defaultValue={kanta_peravaunu !== null ? kanta_peravaunu : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_kuljetus_jatko.kanta_peravaunu = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
          </InputWrapper>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KANTA_MUUT.FI}</Instruction>
          <InputWrapper>
            <input
              type="text"
              defaultValue={kanta_muut !== null ? kanta_muut : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_kuljetus_jatko.kanta_muut = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
          </InputWrapper>

          <h4>8. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OPETUSVALINEET.FI}</h4>
          <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OPETUSVALINEET_ASETUS.FI}</Label>
          <textarea
            rows="5"
            defaultValue={valineet_asetus !== null ? valineet_asetus : undefined}
            onBlur={(e) => {
              const i = getIndex(muutokset, koodiarvo)
              let obj = fields.get(i)
              obj.meta.perusteluteksti_kuljetus_jatko.valineet_asetus = e.target.value
              fields.remove(i)
              fields.insert(i, obj)
            }}
          />
          <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OPETUSVALINEET_MUUT.FI}</Label>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.OPETUSVALINEET.FI}</Instruction>
          <textarea
            rows="5"
            defaultValue={valineet_muut !== null ? valineet_muut : undefined}
            onBlur={(e) => {
              const i = getIndex(muutokset, koodiarvo)
              let obj = fields.get(i)
              obj.meta.perusteluteksti_kuljetus_jatko.valineet_muut = e.target.value
              fields.remove(i)
              fields.insert(i, obj)
            }}
          />
        </Area>
      </PerusteluKuljettajaJatkoWrapper>
    )
  }
}

export default PerusteluKuljettajaJatko