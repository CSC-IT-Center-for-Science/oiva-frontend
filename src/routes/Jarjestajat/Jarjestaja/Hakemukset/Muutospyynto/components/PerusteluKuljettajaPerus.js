import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import { reduxForm, FieldArray, Field } from 'redux-form'
import styled from 'styled-components'

import "react-datepicker/dist/react-datepicker.css"

import { Area, Button, Checkbox } from './MuutospyyntoWizardComponents'

import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"
import { meta_kuljettaja_perus_henkilo } from "../modules/lisaperusteluUtil"
import { getIndex } from "../modules/muutosUtil"
import { FORM_NAME_UUSI_HAKEMUS } from "../modules/uusiHakemusFormConstants"
import validate from '../modules/validateWizard'

import Liitteet from './Liitteet'

import { COLORS } from "../../../../../../modules/styles"

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

const RadioWrapper = styled.div`
  margin-left: 14px;
  margin-top: 10px;
`

const Opettaja = styled.div`
  border-left: 1px solid #DFDFDF;
  border-top: 1px solid #DFDFDF;
  margin: 5px 0 5px 20px;
  padding: 5px;
`

const Radiobutton = styled.div`
  width: 20px;
  position: relative;
  margin: 6px 10px;
  
  label {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    top: -3px;
    left: 0;
    background: white;
    border-radius: 0;
    border: 1px solid ${COLORS.OIVA_GREEN};
    border-radius: 16px;
    
    &:hover {
      &:after {
        border-color: ${COLORS.OIVA_GREEN};
        opacity: 0.5;
      }
    }
    
    &:after {
      content: '';
      width: 9px;
      height: 5px;
      position: absolute;
      top: 4px;
      left: 4px;
      border: 3px solid #fcfff4;
      border-top: none;
      border-right: none;
      background: transparent;
      opacity: 0;
      transform: rotate(-45deg);
      border-radius: 0;
    }

  }
  input[type=radio] {
    visibility: hidden;
    
    &:checked + label {
      background: ${COLORS.OIVA_GREEN};
      border-radius: 16px;
      
      &:hover {
        &:after {
          background: rgba(90, 138, 112, 0.0);
        }
      }
    }
    
    &:hover {
      background: rgba(90, 138, 112, 0.5);
      border-radius: 16px;
    }
    
    &:checked + label:after {
      opacity: 1;
      background: ${COLORS.OIVA_GREEN};
      
      &:hover {
        background: rgba(90, 138, 112, 0.5);
      }
    }
    
    &:checked + label:hover {
      background: rgba(90, 138, 112, 0.5);
      border-radius: 16px;
      
      &:after {
        border-color: white;
        opacity: 1;
      }
    }
  }
`

class PerusteluKuljettajaPerus extends Component {

  // Luo FieldArrayn sisään valintaruutu-Fieldin
  // props = {'id': string, 'title': string}
  // fieldarray = fieldarrayn nimi, string
  // index = fieldarrayn käsiteltävä indeksi, int
  // render = this.renderCheckbox
  createCheckboxField(props, fieldarray, index, render) {
    return (
      <Field 
        name={`${fieldarray}[${index}].${props.id}`}
        id={`${fieldarray}_${index}_${props.id}`}
        type="checkbox"
        title={`${props.title}`}
        component={render} />
    )
  }

  renderCheckbox({input, title, id}) {
    return (
      <Checkbox>
        <input
          type="checkbox"
          id={id}
          {...input}
        />
        <label htmlFor={id}><ChkTitle>{title}</ChkTitle></label>
      </Checkbox>
    )
  }

  render() {
    const { muutokset, fields, koodiarvo, perusteluteksti_kuljetus_perus } = this.props
    const { tarpeellisuus, voimassaoleva_pvm, suunnitelma } = perusteluteksti_kuljetus_perus
    const { toimipisteet, kanta_linja_auto, kanta_kuorma_auto } = perusteluteksti_kuljetus_perus
    const { kanta_peravaunu, valineet_asetus, valineet_muut } = perusteluteksti_kuljetus_perus

    const i = getIndex(muutokset, koodiarvo)

    return (
      <div>
        <h4>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.PERUS.FI}</h4>
        <Area>
          <h4>1. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.TARPEELLISUUS.FI}</h4>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.TARPEELLISUUS.FI}</Instruction>
          <textarea
            rows="5"
            defaultValue={tarpeellisuus !== null ? tarpeellisuus : undefined}
            onBlur={(e) => {
              const i = getIndex(muutokset, koodiarvo)
              let obj = fields.get(i)
              obj.meta.perusteluteksti_kuljetus_perus.tarpeellisuus = e.target.value
              fields.remove(i)
              fields.insert(i, obj)
            }}
          />

          <h4>2. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.VOIMASSAOLEVA.FI}</h4>
          <RadioWrapper>
            <Radiobutton>
              <Field
                name={`tutkinnotjakoulutukset[${i}].meta.perusteluteksti_kuljetus_perus.voimassaoleva`}
                id="kuljetus_perus_voimassa_ei"
                component="input"
                type="radio"
                value="false"
                />
              <label htmlFor="kuljetus_perus_voimassa_ei"><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.EI.FI}</ChkTitle></label>
            </Radiobutton>
          </RadioWrapper>
          <RadioWrapper>
            <Radiobutton>
              <Field
                name={`tutkinnotjakoulutukset[${i}].meta.perusteluteksti_kuljetus_perus.voimassaoleva`}
                id="kuljetus_perus_voimassa_on"
                component="input"
                type="radio"
                value="true"
                />
              <label htmlFor="kuljetus_perus_voimassa_on"><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.YLEINEN.KYLLA.FI}</ChkTitle></label>
            </Radiobutton>
          </RadioWrapper>
          <Tarkenne>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.VOIMASSAOLEVA.FI}</Tarkenne>
          <InputWrapper>
            <DatePicker
              selected={voimassaoleva_pvm !== null ? moment(voimassaoleva_pvm, "DD.MM.YYYY") : undefined}
              onChange={(date) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_kuljetus_perus.voimassaoleva_pvm = date.format("DD.MM.YYYY")
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
              obj.meta.perusteluteksti_kuljetus_perus.suunnitelma = e.target.value
              fields.remove(i)
              fields.insert(i, obj)
            }}
          />
          <h4>4. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.JOHTAJA.FI}</h4>
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
                obj.meta.perusteluteksti_kuljetus_perus.toimipisteet.nimi = e.target.value
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
                checked={false}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LUPA.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LUPA.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KUORMA_AUTO.FI}
                checked={false}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KUORMA_AUTO.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KUORMA_AUTO.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LINJA_AUTO.FI}
                checked={false}
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
                checked={false}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_C.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_C.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_CE.FI}
                checked={false}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_CE.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_CE.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_D.FI}
                checked={false}
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
                checked={false}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_LINJA_AUTO.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_LINJA_AUTO.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_YHDISTELMA.FI}
                checked={false}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_YHDISTELMA.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_YHDISTELMA.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_PUUTAVARA.FI}
                checked={false}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_PUUTAVARA.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_PUUTAVARA.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSPALVELU.FI}
                checked={false}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSPALVELU.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSPALVELU.FI}</ChkTitle></label>
            </Checkbox>
            <Checkbox>
              <input
                type="checkbox"
                id={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSALA.FI}
                checked={false}
                //onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, koulutus) }}
              />
              <label htmlFor={MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSALA.FI}><ChkTitle>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSALA.FI}</ChkTitle></label>
            </Checkbox>
          </CheckboxWrapper>
          <CheckboxWrapper>
            <Liitteet {...this.props} paikka="kuljettaja-perus1"/>
          </CheckboxWrapper>

          <h4>5. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OPETTAJA.FI}</h4>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.OPETTAJA_TARKENNUS.FI}</Instruction>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.OPETTAJA.FI}</Instruction>

          {/* FieldArrayn tallennus tutkinnotjakoulutukset-rakenteen sisään tässä kohtaa tekee lomakkeesta mahdottoman hitaan.
          Tallenna erilliseen muuttujaan ja siirrä oikeaan paikkaan vasta tallennuksen yhteydessä. */}
          <FieldArray name={`perusteluteksti_kuljetus_perus.henkilot`} component={({fields}) =>
            <div>
              <Button type="button" onClick={() => fields.push(meta_kuljettaja_perus_henkilo)}>
                {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LISAA_HENKILO.FI}
              </Button>
              {fields.map((opettaja, index) =>
                <Opettaja key={index}>
                  <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.HENKILO.FI}</Instruction>
                  <InputWrapper>
                    <Field name={`${opettaja}.nimi`} type="text" component="input" />
                  </InputWrapper>

                  <CheckboxWrapper>
                    {_.map([
                      {'id': 'lupa', 'title': MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LUPA.FI},
                      {'id': 'voimassa_kuorma_auto', 'title': MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KUORMA_AUTO.FI},
                      {'id': 'voimassa_linja_auto', 'title': MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.LINJA_AUTO.FI}
                    ], props => this.createCheckboxField(
                      props, 'perusteluteksti_kuljetus_perus.henkilot', index, this.renderCheckbox
                    ))}
                  </CheckboxWrapper>

                  <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS.FI}</Label>
                  <CheckboxWrapper>
                  {_.map([
                      {'id': 'kokemus_c', 'title': MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_C.FI},
                      {'id': 'kokemus_ce', 'title': MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_CE.FI},
                      {'id': 'kokemus_d', 'title': MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KOKEMUS_D.FI}
                    ], props => this.createCheckboxField(
                      props, 'perusteluteksti_kuljetus_perus.henkilot', index, this.renderCheckbox
                    ))}
                  </CheckboxWrapper>

                  <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO.FI}</Label>
                  <CheckboxWrapper>
                  {_.map([
                      {'id': 'tutkinto_linja_auto', 'title': MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_LINJA_AUTO.FI},
                      {'id': 'tutkinto_yhdistelma', 'title': MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_YHDISTELMA.FI},
                      {'id': 'tutkinto_puutavara', 'title': MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_PUUTAVARA.FI},
                      {'id': 'tutkinto_kuljetuspalvelu', 'title': MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSPALVELU.FI},
                      {'id': 'tutkinto_kuljetusala', 'title': MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.TUTKINTO_KULJETUSALA.FI}
                    ], props => this.createCheckboxField(
                      props, 'perusteluteksti_kuljetus_perus.henkilot', index, this.renderCheckbox
                    ))}
                  </CheckboxWrapper>
                </Opettaja>
              )}
            </div>
          } />
          <CheckboxWrapper>
            <Liitteet {...this.props} paikka="kuljettaja-perus2" />
          </CheckboxWrapper>

          <h4>6. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KANTA.FI}</h4>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OHJEET.KANTA.FI}</Instruction>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KANTA_LINJA_AUTO.FI}</Instruction>
          <InputWrapper>
            <input
              type="number"
              defaultValue={kanta_linja_auto !== null ? kanta_linja_auto : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_kuljetus_perus.kanta_linja_auto = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
          </InputWrapper>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KANTA_KUORMA_AUTO.FI}</Instruction>
          <InputWrapper>
            <input
              type="number"
              defaultValue={kanta_kuorma_auto !== null ? kanta_kuorma_auto : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_kuljetus_perus.kanta_kuorma_auto = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
          </InputWrapper>
          <Instruction>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.KANTA_PERAVAUNU.FI}</Instruction>
          <InputWrapper>
            <input
              type="number"
              defaultValue={kanta_peravaunu !== null ? kanta_peravaunu : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.meta.perusteluteksti_kuljetus_perus.kanta_peravaunu = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
          </InputWrapper>

          <h4>7. {MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OPETUSVALINEET.FI}</h4>
          <Label>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_PERUSTELULOMAKKEET.KULJETTAJAKOULUTUS.OPETUSVALINEET_ASETUS.FI}</Label>
          <textarea
            rows="5"
            defaultValue={valineet_asetus !== null ? valineet_asetus : undefined}
            onBlur={(e) => {
              const i = getIndex(muutokset, koodiarvo)
              let obj = fields.get(i)
              obj.meta.perusteluteksti_kuljetus_perus.valineet_asetus = e.target.value
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
              obj.meta.perusteluteksti_kuljetus_perus.valineet_muut = e.target.value
              fields.remove(i)
              fields.insert(i, obj)
            }}
          />
        </Area>
      </div>
    )
  }
}

export default reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(PerusteluKuljettajaPerus)
