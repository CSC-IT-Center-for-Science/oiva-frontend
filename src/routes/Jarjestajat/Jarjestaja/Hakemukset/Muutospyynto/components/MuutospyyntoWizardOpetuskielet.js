import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FieldArray, reduxForm, formValueSelector } from 'redux-form'
import styled from 'styled-components'

import { ContentContainer} from "../../../../../../modules/elements"
import { Kohde, Kohdenumero, Otsikko, Row, Div, Checkbox, CheckboxRowContainer } from "./MuutospyyntoWizardComponents"
import { LUPA_TEKSTIT } from "../../../modules/constants"
import Loading from "../../../../../../modules/Loading"
import { parseLocalizedField } from "../../../../../../modules/helpers"
import { handleCheckboxChange } from "../modules/koulutusUtil"
import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"


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
                name="opetuskielimuutokset"
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
            const { koodiArvo, koodisto, metadata} = opetuskieli
            const { koodistoUri } = koodisto
            const nimi = parseLocalizedField(metadata)
            const identifier = `input-${koodiArvo}-${i}`

            let isInLupa = false
            let isAdded = false
            let isRemoved = false
            let isChecked = false
            let customClassName = ""

            kohdeArvot.forEach(arvo => {
              if (arvo === nimi) {
                isInLupa = true
              }
            })

            if (editValues) {
              editValues.forEach(val => {
                if (val.koodiarvo === koodiArvo && val.nimi === nimi) {
                  val.type === "addition" ? isAdded = true : null
                  val.type === "removal" ? isRemoved = true : null
                }
              })
            }

            isInLupa ? customClassName = "is-in-lupa" : null
            isAdded ? customClassName = "is-added" : null
            isRemoved ? customClassName = "is-removed" : null

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

const selector = formValueSelector('uusiHakemus')

MuutospyyntoWizardKielet = connect(state => {
  const opetusjatutkintokielimuutoksetValue = selector(state, 'opetuskielimuutokset')

  return {
    opetusjatutkintokielimuutoksetValue
  }
})(MuutospyyntoWizardKielet)

export default reduxForm({
  form: 'uusiHakemus',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  // validate,
})(MuutospyyntoWizardKielet)
