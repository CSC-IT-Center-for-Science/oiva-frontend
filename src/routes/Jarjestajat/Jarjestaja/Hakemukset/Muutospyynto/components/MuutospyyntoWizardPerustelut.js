import React from 'react'
import { connect } from 'react-redux'
import { FieldArray, reduxForm, formValueSelector } from 'redux-form'
import validate from '../modules/validateWizard'
import { Separator, Button, SubtleButton, Container, WizardBottom } from './MuutospyyntoWizardComponents'
import MuutosList from './MuutosList'
import MuutosListTutkinnot from './MuutosListTutkinnot'

import { HAKEMUS_OTSIKOT  } from "../modules/uusiHakemusFormConstants"
import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"
import { FIELD_ARRAY_NAMES, FORM_NAME_UUSI_HAKEMUS } from "../modules/uusiHakemusFormConstants"
import { hasFormChanges } from "../modules/muutospyyntoUtil"

import Liitteet from './Liitteet'

let MuutospyyntoWizardPerustelut = props => {
  const {
    handleSubmit,
    previousPage,
    save,
    tutkinnotjakoulutuksetValue,
    opetusjatutkintokieletValue,
    toimialueValue,
    opiskelijavuosiValue,
    muutmuutoksetValue,
    formValues,
    muutospyynto
  } = props

  console.log(muutospyynto);

  return (
    <div>
      <h2>{MUUTOS_WIZARD_TEKSTIT.PERUSTELUT_PAAOTSIKKO.FI}</h2>


        <form onSubmit={handleSubmit}>
        { 
          (tutkinnotjakoulutuksetValue && tutkinnotjakoulutuksetValue.length > 0) || 
          (opetusjatutkintokieletValue && opetusjatutkintokieletValue.length > 0) || 
          (toimialueValue && toimialueValue.length > 0) || 
          (opiskelijavuosiValue && opiskelijavuosiValue.length > 0) || 
          (muutmuutoksetValue && muutmuutoksetValue.length > 0) ?

          <div>
            <p>{MUUTOS_WIZARD_TEKSTIT.PERUSTELUT_OHJE.FI}</p>
            <Separator/>
            <FieldArray
              name={FIELD_ARRAY_NAMES.TUTKINNOT_JA_KOULUTUKSET}
              nimi={FIELD_ARRAY_NAMES.TUTKINNOT_JA_KOULUTUKSET}
              muutokset={tutkinnotjakoulutuksetValue}
              kategoria="tutkinto"
              headingNumber="1"
              heading="Tutkinnot ja koulutukset"
              component={MuutosListTutkinnot}
            />

            {tutkinnotjakoulutuksetValue && tutkinnotjakoulutuksetValue.length > 0 && 
              <Liitteet fields={formValues} paikka="tutkinnot" isIntend={true}/> 
            }

            <FieldArray
              name={FIELD_ARRAY_NAMES.OPETUS_JA_TUTKINTOKIELET}
              nimi={FIELD_ARRAY_NAMES.OPETUS_JA_TUTKINTOKIELET}
              muutokset={opetusjatutkintokieletValue}
              kategoria="opetuskieli"
              headingNumber="2"
              heading="Opetus- ja tutkintokielet"
              component={MuutosListTutkinnot}
            />

            <FieldArray
              name={FIELD_ARRAY_NAMES.TOIMINTA_ALUEET}
              muutokset={toimialueValue}
              kategoria="toimialue"
              headingNumber="3"
              heading="Toiminta-alueet"
              component={MuutosList}
            />

            <FieldArray
              name={FIELD_ARRAY_NAMES.OPISKELIJAVUODET}
              muutokset={opiskelijavuosiValue}
              kategoria="opiskelijavuosi"
              headingNumber="4"
              heading="Opiskelijavuodet"
              component={MuutosList}
            />

            <FieldArray
              name={FIELD_ARRAY_NAMES.MUUT}
              muutokset={muutmuutoksetValue}
              kategoria="muumuutos"
              headingNumber="5"
              heading="Muut oikeudet, velvollisuudet, ehdot ja tehtävät"
              component={MuutosList}
            />

            <Separator />

            <Liitteet fields={formValues} paikka="yleiset" header={ HAKEMUS_OTSIKOT.LIITE_YLEISET_HEADER.FI } />
            
            </div>
          : 
            <span>{ HAKEMUS_OTSIKOT.EI_MUUTOKSIA.FI }</span>
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
    </div>
  )
}

const selector = formValueSelector(FORM_NAME_UUSI_HAKEMUS)

MuutospyyntoWizardPerustelut = connect(state => {
  const tutkinnotjakoulutuksetValue = selector(state, FIELD_ARRAY_NAMES.TUTKINNOT_JA_KOULUTUKSET)
  const opetusjatutkintokieletValue = selector(state, FIELD_ARRAY_NAMES.OPETUS_JA_TUTKINTOKIELET)
  const toimialueValue = selector(state, FIELD_ARRAY_NAMES.TOIMINTA_ALUEET)
  const opiskelijavuosiValue = selector(state, FIELD_ARRAY_NAMES.OPISKELIJAVUODET)
  const muutmuutoksetValue = selector(state, FIELD_ARRAY_NAMES.MUUT)
  const muutospyynto = state.muutospyynto.data;
  let formVals = undefined
  if (state.form && state.form.uusiHakemus && state.form.uusiHakemus.values) {
    formVals = state.form.uusiHakemus.values
  }

  return {
    tutkinnotjakoulutuksetValue,
    opetusjatutkintokieletValue,
    toimialueValue,
    opiskelijavuosiValue,
    muutmuutoksetValue,
    formValues: formVals,
    muutospyynto
  }
})(MuutospyyntoWizardPerustelut)

export default reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(MuutospyyntoWizardPerustelut)
