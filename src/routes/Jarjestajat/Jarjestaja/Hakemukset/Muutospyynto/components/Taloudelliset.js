import React, { Component } from 'react'
import styled from 'styled-components'

import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"

import { FormField, FormGroup, Separator, Textarea } from './MuutospyyntoWizardComponents'

import Liitteet from './Liitteet'

const H4 = styled.h4 `
  margin: 20px 0;
`

export const Label = styled.label`
  align-self: center;
  flex: 1;
`

class Taloudelliset extends Component {
  render() {
    var { fields, taloudellisetValue } = this.props
    const { edellytykset, vaikutukset, sopeuttaminen, investoinnit, kustannukset, rahoitus, 
      omavaraisuusaste, maksuvalmius, velkaantuneisuus, kannattavuus, 
      kumulatiivinen } = taloudellisetValue

    console.log(fields.get(0));

    if (!fields.get(0)) {
      fields.push({
        "edellytykset": edellytykset,
        "vaikutukset": vaikutukset,
        "sopeuttaminen": sopeuttaminen,
        "investoinnit": investoinnit,
        "kustannukset": kustannukset,
        "rahoitus": rahoitus,
        "omavaraisuusaste": omavaraisuusaste,
        "maksuvalmius": maksuvalmius,
        "velkaantuneisuus": velkaantuneisuus,
        "kannattavuus": kannattavuus,
        "kumulatiivinen": kumulatiivinen
      })
    }

    return (
        <div>
          <H4>{ MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.YLEISET.FI }</H4>

          <label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.EDELLYTYKSET.FI}</label>
          <Textarea 
            rows="5"
            defaultValue={edellytykset !== null ? edellytykset : undefined}
            onBlur={(e) => {
              let obj = fields.get(0)
              obj.edellytykset = e.target.value
              fields.remove(0)
              fields.insert(0, obj)
            }}
          ></Textarea>

          <label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.VAIKUTUKSET.FI}</label>
          <Textarea 
            rows="5"
            defaultValue={vaikutukset !== null ? vaikutukset : undefined}
            onBlur={(e) => {
              let obj = fields.get(0)
              obj.vaikutukset = e.target.value
              fields.remove(0)
              fields.insert(0, obj)
            }}
          ></Textarea>

          <label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.SOPEUTTAMINEN.FI}</label>
          <Textarea 
            rows="5"
            defaultValue={sopeuttaminen !== null ? sopeuttaminen : undefined}
            onBlur={(e) => {
              let obj = fields.get(0)
              obj.sopeuttaminen = e.target.value
              fields.remove(0)
              fields.insert(0, obj)
            }}
          ></Textarea>

          <Separator />

          <H4>{ MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.INVESTOINNIT_LEGEND.FI }</H4>

          <label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.INVESTOINNIT.FI}</label>
          <Textarea 
            rows="5"
            defaultValue={investoinnit !== null ? investoinnit : undefined}
            onBlur={(e) => {
              let obj = fields.get(0)
              obj.investoinnit = e.target.value
              fields.remove(0)
              fields.insert(0, obj)
            }}
          ></Textarea>

          <FormGroup>
            <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.KUSTANNUKSET.FI}</Label>
            <FormField>
              <input 
                type="number"
                defaultValue={kustannukset !== null ? kustannukset : undefined}
                onBlur={(e) => {
                  let obj = fields.get(0)
                  obj.kustannukset = e.target.value
                  fields.remove(0)
                  fields.insert(0, obj)
                }}
                      />
            </FormField>
          </FormGroup>

          <label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.RAHOITUS.FI}</label>
          <Textarea 
            rows="5"
            defaultValue={rahoitus !== null ? rahoitus : undefined}
            onBlur={(e) => {
              let obj = fields.get(0)
              obj.rahoitus = e.target.value
              fields.remove(0)
              fields.insert(0, obj)
            }}
          ></Textarea>

          <Separator />

          <H4>{ MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.TILINPAATOSTIEDOT.FI }</H4>

          <FormGroup>
            <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.OMAVARAISUUSASTE.FI}</Label>
            <FormField>
              <input 
                type="number"
                defaultValue={omavaraisuusaste !== null ? omavaraisuusaste : undefined}
                onBlur={(e) => {
                  let obj = fields.get(0)
                  obj.omavaraisuusaste = e.target.value
                  fields.remove(0)
                  fields.insert(0, obj)
                }}
                      />
            </FormField>

          </FormGroup>

          <FormGroup>
            <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.MAKSUVALMIUS.FI}</Label>
            <FormField>
              <input 
                type="number"
                defaultValue={maksuvalmius !== null ? maksuvalmius : undefined}
                onBlur={(e) => {
                  let obj = fields.get(0)
                  obj.maksuvalmius = e.target.value
                  fields.remove(0)
                  fields.insert(0, obj)
                }}
                      />
            </FormField>

          </FormGroup>

          <FormGroup>
            <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.VELKAANTUNEISUUS.FI}</Label>
            <FormField>
              <input 
                type="number"
                defaultValue={velkaantuneisuus !== null ? velkaantuneisuus : undefined}
                onBlur={(e) => {
                  let obj = fields.get(0)
                  obj.velkaantuneisuus = e.target.value
                  fields.remove(0)
                  fields.insert(0, obj)
                }}
              />
            </FormField>

          </FormGroup>

          <FormGroup>
            <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.KANNATTAVUUS.FI}</Label>
            <FormField>
              <input 
                type="number"
                defaultValue={kannattavuus !== null ? kannattavuus : undefined}
                onBlur={(e) => {
                  let obj = fields.get(0)
                  obj.kannattavuus = e.target.value
                  fields.remove(0)
                  fields.insert(0, obj)
                }}
              />
            </FormField>

          </FormGroup>

          <FormGroup>
            <Label>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.KUMULATIIVINEN.FI}</Label>
            <FormField>
              <input 
                type="number"
                defaultValue={kumulatiivinen !== null ? kumulatiivinen : undefined}
                onBlur={(e) => {
                  let obj = fields.get(0)
                  obj.kumulatiivinen = e.target.value
                  fields.remove(0)
                  fields.insert(0, obj)
                }}
              />
            </FormField>

          </FormGroup>

          <Separator />

          <FormGroup>
            <Liitteet {...this.props} fields={fields.get(0)} paikka="taloudelliset"/>
          </FormGroup>
        </div>
    )
  }
}

export default Taloudelliset
