import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FieldArray, reduxForm, formValueSelector } from 'redux-form'
import validate from '../modules/validateValmistelu'
import { Button, SubtleButton, Container, WizardBottom } from './ValmisteluComponents'
import MuutosList from './MuutosList'

import { FIELD_ARRAY_NAMES } from "../../modules/constants"

class ValmisteluWizardMuutokset extends Component {
  render() {
    const {
      handleSubmit,
      previousPage,
      tutkinnotjakoulutuksetValue,
      opetusjatutkintokieletValue,
      toimialueValue,
      opiskelijavuosiValue,
      muutmuutoksetValue
    } = this.props

    setTimeout(() => console.log(this.props), 500)

    return (
      <div>
        <h3>Käsiteltävän muutospyynnön muutokset</h3>

        <form onSubmit={handleSubmit}>
          <FieldArray
            name={FIELD_ARRAY_NAMES.TUTKINNOT_JA_KOULUTUKSET}
            muutokset={tutkinnotjakoulutuksetValue}
            kategoria="tutkinto"
            headingNumber="1"
            heading="Tutkinnot ja koulutukset"
            component={MuutosList}
          />

          <FieldArray
            name={FIELD_ARRAY_NAMES.OPETUS_JA_TUTKINTOKIELET}
            muutokset={opetusjatutkintokieletValue}
            kategoria="opetuskieli"
            headingNumber="2"
            heading="Opetus- ja tutkintokielet"
            component={MuutosList}
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

          <WizardBottom>
            <Container maxWidth="1085px" padding="15px">
              <Button onClick={previousPage} className="previous button-left">Edellinen</Button>
              <div>
                <SubtleButton disabled>Tallenna luonnos</SubtleButton>
              </div>
              <Button type="submit" className="next button-right">Seuraava</Button>
            </Container>
          </WizardBottom>
        </form>
      </div>
    )
  }
}

const selector = formValueSelector('uusiPaatos')

ValmisteluWizardMuutokset = connect(state => {
  const tutkinnotjakoulutuksetValue = selector(state, FIELD_ARRAY_NAMES.TUTKINNOT_JA_KOULUTUKSET)
  const opetusjatutkintokieletValue = selector(state, FIELD_ARRAY_NAMES.OPETUS_JA_TUTKINTOKIELET)
  const toimialueValue = selector(state, FIELD_ARRAY_NAMES.TOIMINTA_ALUEET)
  const opiskelijavuosiValue = selector(state, FIELD_ARRAY_NAMES.OPISKELIJAVUODET)
  const muutmuutoksetValue = selector(state, FIELD_ARRAY_NAMES.MUUT)

  let formVals = undefined
  if (state.form && state.form.uusiPaatos && state.form.uusiPaatos.values) {
    formVals = state.form.uusiPaatos.values
  }

  return {
    tutkinnotjakoulutuksetValue,
    opetusjatutkintokieletValue,
    toimialueValue,
    opiskelijavuosiValue,
    muutmuutoksetValue
  }
})(ValmisteluWizardMuutokset)

export default reduxForm({
  form: 'uusiPaatos',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(ValmisteluWizardMuutokset)
