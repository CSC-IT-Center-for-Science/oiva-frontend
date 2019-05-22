import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FieldArray, reduxForm, formValueSelector } from 'redux-form'

import { ContentContainer} from "../../../../../../modules/elements"
import { Kohdenumero, Otsikko, Row, Checkbox, CheckboxRowContainer } from "./MuutospyyntoWizardComponents"
import Loading from "../../../../../../modules/Loading"
import { parseLocalizedField } from "../../../../../../modules/helpers"
import { handleCheckboxChange } from "../modules/koulutusUtil"
import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"
import { FIELD_ARRAY_NAMES, FORM_NAME_UUSI_HAKEMUS, MUUTOS_TYPES } from "../modules/uusiHakemusFormConstants"

class MuutospyyntoWizardKielet extends Component {
  componentWillMount() {
    const { oppilaitoksenopetuskielet } = this.props

    if (oppilaitoksenopetuskielet && !oppilaitoksenopetuskielet.fetched) {
      this.props.fetchOppilaitoksenopetuskielet()
    }
  }

  render() {
    const { lupa } = this.props
    const { kohteet} = lupa
    const kohde = kohteet[2]
    const { headingNumber, heading } = kohde
    const { oppilaitoksenopetuskielet, opetusjatutkintokielimuutoksetValue } = this.props

    if (oppilaitoksenopetuskielet.fetched) {
      return (
          <ContentContainer>
            <Kohdenumero>{headingNumber}.</Kohdenumero>
            <Otsikko>{heading}</Otsikko>
            <Row>
              <FieldArray
                name={FIELD_ARRAY_NAMES.OPETUS_JA_TUTKINTOKIELET}
                kohde={kohde}
                opetuskielet={oppilaitoksenopetuskielet.data}
                editValues={opetusjatutkintokielimuutoksetValue}
                component={this.renderOpetuskieliMuutokset}
              />
            </Row>
          </ContentContainer>
      )
    } else if (oppilaitoksenopetuskielet.isFetching) {
      return <Loading/>
    } else if (oppilaitoksenopetuskielet.hasErrored) {
      return <h2>Opetuskieliä ei voitu ladata.</h2>
    } else {
      return null
    }
  }

  renderOpetuskieliMuutokset(props) {
    const { opetuskielet, fields, editValues, kohde } = props
    const { kohdeArvot } = kohde

    return (
      <div>
        <Row>
          <h4>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_OPETUSKIELET.HEADING.FI}</h4>

          {opetuskielet.map((opetuskieli, i) => {
            const { koodiArvo, metadata} = opetuskieli
            const nimi = parseLocalizedField(metadata)
            const identifier = `input-${koodiArvo}-${i}`

            let isInLupa = false
            let isAdded = false
            let isRemoved = false
            let isChecked = false
            let customClassName = ""

            kohdeArvot.forEach(arvo => {
              if (arvo.koodiarvo === koodiArvo) {
                isInLupa = true
              }
              // if (arvo === nimi) {
              //   isInLupa = true
              // }
            })

            if (editValues) {
              editValues.forEach(val => {
                if (val.koodiarvo === koodiArvo && val.nimi === nimi) {
                  isAdded = (val.type === MUUTOS_TYPES.ADDITION) ? true : null
                  isRemoved = (val.type === MUUTOS_TYPES.REMOVAL) ? true : null
                }
              })
            }

            customClassName = isInLupa ? "is-in-lupa" : null
            customClassName = isAdded ? "is-added" : null
            customClassName = isRemoved ? "is-removed" : null

            if ((isInLupa && !isRemoved) || isAdded) {
              isChecked = true
            }

            return (
              <CheckboxRowContainer key={identifier} className={customClassName}>
                <Checkbox>
                  <input
                    type="checkbox"
                    id={identifier}
                    checked={isChecked}
                    onChange={(e) => { handleCheckboxChange(e, editValues, fields, isInLupa, opetuskieli) }}
                  />
                  <label htmlFor={identifier}></label>
                </Checkbox>
                <div>{_.capitalize(nimi)}</div>
              </CheckboxRowContainer>
            )
          })}
        </Row>
      </div>
    )
  }
}

const selector = formValueSelector(FORM_NAME_UUSI_HAKEMUS)

MuutospyyntoWizardKielet = connect(state => {
  const opetusjatutkintokielimuutoksetValue = selector(state, FIELD_ARRAY_NAMES.OPETUS_JA_TUTKINTOKIELET)

  return {
    opetusjatutkintokielimuutoksetValue
  }
})(MuutospyyntoWizardKielet)

export default reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  // validate,
})(MuutospyyntoWizardKielet)
