import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FieldArray, formValueSelector, reduxForm } from 'redux-form'

import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"
import { hasFormChanges } from "../modules/muutospyyntoUtil"
import { FIELD_ARRAY_NAMES, FORM_NAME_UUSI_HAKEMUS, MUUTOS_TYPES } from "../modules/uusiHakemusFormConstants"
import validate from '../modules/validateWizard'

import { Button, Container, SubtleButton, WizardBottom } from './MuutospyyntoWizardComponents'
import Taloudelliset from './Taloudelliset'

class MuutospyyntoWizardTaloudelliset extends Component {


  render() {
    const { formValues, handleSubmit, previousPage, save, tutkinnotjakoulutuksetValue, initialValues } = this.props
    let { taloudellisetValue } = this.props
    const tutkintojaLisatty = _.find(tutkinnotjakoulutuksetValue, function(t) { 
      return t.type === MUUTOS_TYPES.ADDITION })

    if (initialValues) console.log(initialValues)
    if (!taloudellisetValue) {
      if ( initialValues && initialValues.taloudelliset && initialValues.taloudelliset.taloudelliset ) {
        taloudellisetValue = initialValues.taloudelliset.taloudelliset[0]
      }

      if (!taloudellisetValue || taloudellisetValue.length === 0) {
        taloudellisetValue = [{
          "edellytykset": null,
          "vaikutukset": null,
          "sopeuttaminen": null,
          "investoinnit": null,
          "kustannukset": null,
          "rahoitus": null,
          "omavaraisuusaste": null,
          "maksuvalmius": null,
          "velkaantuneisuus": null,
          "kannattavuus": null,
          "kumulatiivinen": null
        }]
      }
      console.log(taloudellisetValue)

    }


    return (
      <form onSubmit={handleSubmit}>

        <h2>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.PAAOTSIKKO.FI}</h2>

        {!tutkintojaLisatty && <div>{ MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.EI_LISATTYJA_TUTKINTOJA.FI }</div>}

        {tutkintojaLisatty &&    
          <FieldArray 
            name="taloudelliset" 
            component={Taloudelliset}
            taloudellisetValue={taloudellisetValue} />
        }

        <WizardBottom>
        <Container maxWidth="1085px" padding="15px">
            <Button onClick={previousPage} className="previous button-left">Edellinen</Button>
            <div>
            <SubtleButton disabled={!hasFormChanges(formValues)} onClick={(e) => save(e, formValues)}>Tallenna luonnos</SubtleButton>
            </div>
            <Button type="submit" className="next button-right">Seuraava</Button>
        </Container>
        </WizardBottom>
      </form>
    )
  }
}

const selector = formValueSelector(FORM_NAME_UUSI_HAKEMUS)

MuutospyyntoWizardTaloudelliset = connect(state => {
  const tutkinnotjakoulutuksetValue = selector(state, FIELD_ARRAY_NAMES.TUTKINNOT_JA_KOULUTUKSET)
  // const taloudellisetValue = selector(state, FIELD_ARRAY_NAMES.TALOUDELLISET)
  let formVals = undefined
  let taloudellisetValue = undefined
  if (state.form && state.form.uusiHakemus && state.form.uusiHakemus.values) {
    formVals = state.form.uusiHakemus.values;
    if (state.form.uusiHakemus.values.taloudelliset && state.form.uusiHakemus.values.taloudelliset.length>0) taloudellisetValue = state.form.uusiHakemus.values.taloudelliset[0];
  }
console.log(taloudellisetValue);
  return {
    tutkinnotjakoulutuksetValue,
    taloudellisetValue,
    formValues: formVals
  }
})(MuutospyyntoWizardTaloudelliset)

export default reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(MuutospyyntoWizardTaloudelliset)
