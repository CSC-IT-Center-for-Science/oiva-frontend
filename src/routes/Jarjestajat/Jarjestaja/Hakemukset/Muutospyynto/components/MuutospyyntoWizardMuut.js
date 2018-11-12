import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FieldArray, reduxForm, formValueSelector } from 'redux-form'

import { ContentContainer } from "../../../../../../modules/elements"
import { Kohdenumero, Otsikko, Row, Checkbox, CheckboxRowContainer, Div } from "./MuutospyyntoWizardComponents"
import Loading from "../../../../../../modules/Loading"
import { parseLocalizedField } from "../../../../../../modules/helpers"
import { handleCheckboxChange } from "../modules/koulutusUtil"
import { FIELD_ARRAY_NAMES, FORM_NAME_UUSI_HAKEMUS, MUUTOS_TYPES } from "../modules/uusiHakemusFormConstants"
import _ from 'lodash'
import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"

class MuutospyyntoWizardMuut extends Component {
  componentWillMount() {
    const { muut } = this.props

    if (muut && !muut.fetched) {
      this.props.fetchMuut()
    }
  }

  render() {
    const { lupa, muut, muutmuutoksetValue } = this.props
    const { kohteet } = lupa
    const kohde = kohteet[5]
    const { headingNumber, heading } = kohde

    if (muut.fetched) {
      // Muut, vaativat, vankilat, kokeilut
      const { muutCombined } = kohde
      const { data } = muut
      let muutList = data
      let vaativat = []
      let vankilat = []
      let kokeilut = []
      let yhteistyo = []
      let laajennettu = []
      let sisaoppilaitos = []
      let urheilijat = []


      _.forEach(muutList, (maarays) => {
        const { metadata, koodiArvo, koodisto } = maarays

        if (koodiArvo) {

          switch (koodiArvo){

            case "1": {
              laajennettu.push(maarays)
              break
            }
            case "4": {
              sisaoppilaitos.push(maarays)
              break
            }
            case "6": {
              urheilijat.push(maarays)
              break
            }
            case "7": {
              kokeilut.push(maarays)
              break
            }
            case "8": {
              yhteistyo.push(maarays)
              break
            }
            case "9": {
              muutCombined.push(maarays)
              break
            }
            case "10": {
              yhteistyo.push(maarays)
              break
            }
            case "11": {
              yhteistyo.push(maarays)
              break
            }
            case "2": {
              vaativat.push(maarays)
              break
            }
            case "3": {
              vaativat.push(maarays)
              break
            }
            case "12": {
              vaativat.push(maarays)
              break
            }
            case "5": {
              vankilat.push(maarays)
              break
            }
            case "13": {
              vankilat.push(maarays)
              break
            }
          }

        }

      })

      return (
        <ContentContainer>
          <Kohdenumero>{headingNumber}</Kohdenumero>
          <Otsikko>{heading}</Otsikko>
          <Row>
            <FieldArray
              name={FIELD_ARRAY_NAMES.MUUT}
              muut={muutCombined}
              editValues={muutmuutoksetValue}
              muutList={laajennettu}
              otsikko=''
              component={this.renderMuutMuutokset}
            />
            <FieldArray
              name={FIELD_ARRAY_NAMES.MUUT}
              muut={muutCombined}
              editValues={muutmuutoksetValue}
              muutList={vaativat}
              otsikko=''
              component={this.renderMuutMuutokset}
            />
            <FieldArray
              name={FIELD_ARRAY_NAMES.MUUT}
              muut={muutCombined}
              editValues={muutmuutoksetValue}
              muutList={sisaoppilaitos}
              otsikko=''
              component={this.renderMuutMuutokset}
            />
            <FieldArray
              name={FIELD_ARRAY_NAMES.MUUT}
              muut={muutCombined}
              editValues={muutmuutoksetValue}
              muutList={vankilat}
              otsikko=''
              component={this.renderMuutMuutokset}
            />
            <FieldArray
              name={FIELD_ARRAY_NAMES.MUUT}
              muut={muutCombined}
              editValues={muutmuutoksetValue}
              muutList={urheilijat}
              otsikko=''
              component={this.renderMuutMuutokset}
            />
            <FieldArray
              name={FIELD_ARRAY_NAMES.MUUT}
              muut={muutCombined}
              editValues={muutmuutoksetValue}
              muutList={kokeilut}
              otsikko=''
              component={this.renderMuutMuutokset}
            />
            <FieldArray
              name={FIELD_ARRAY_NAMES.MUUT}
              muut={muutCombined}
              editValues={muutmuutoksetValue}
              muutList={yhteistyo}
              otsikko={MUUTOS_WIZARD_TEKSTIT.MUUTOS_MUUT.YHTEISTYO.FI}
              component={this.renderMuutMuutokset}
            />

          </Row>
        </ContentContainer>
      )
    } else if (muut.hasErrored) {
      return <h2>Muita määräyksiä ladattaessa tapahtui virhe</h2>
    } else if (muut.isFetching) {
      return <Loading/>
    } else {
      return null
    }
  }

  renderMuutMuutokset(props) {
    const { muut, muutList, editValues, fields, otsikko } = props

    let title = parseLocalizedField(muutList[0].metadata)
    if(otsikko != '') {
      title = otsikko
    }

    return (
      <div>
        <Row>
          <h4>{title}</h4>

          {muutList.map((muu, i) => {
            const {koodiArvo, koodisto, metadata} = muu
            const {koodistoUri} = koodisto
            const nimi = parseLocalizedField(metadata)
            let kuvaus = parseLocalizedField(metadata, 'FI', 'kuvaus') || ''
            const identifier = `input-${koodistoUri}-${koodiArvo}`

            let isInLupa = false
            let isAdded = false
            let isRemoved = false
            let isChecked = false
            let customClassName = ""

            muut.forEach(m => {
              if (m.koodiarvo === koodiArvo) {
                isInLupa = true
              }
              if (koodiArvo == 7 && m.koodiarvo == 7) {
                kuvaus = m.kuvaus
              }
              if (koodiArvo == 8 && m.koodiarvo == 8) {
                kuvaus = m.kuvaus
              }
            })

            if (editValues) {
              editValues.forEach(val => {
                if (val.koodiarvo === koodiArvo && val.nimi === nimi) {
                  val.type === MUUTOS_TYPES.ADDITION ? isAdded = true : null
                  val.type === MUUTOS_TYPES.REMOVAL ? isRemoved = true : null
                }
              })
            }

            isInLupa ? customClassName = "is-in-lupa" : null
            isAdded ? customClassName = "is-added" : null
            isRemoved ? customClassName = "is-removed" : null

            if ((isInLupa && !isRemoved) || isAdded) {
              isChecked = true
            }

            if (kuvaus != '') {

              return (
                <CheckboxRowContainer key={identifier} className={customClassName}>
                  <Checkbox>
                    <input
                      type="checkbox"
                      id={identifier}
                      checked={isChecked}
                      onChange={(e) => {
                        handleCheckboxChange(e, editValues, fields, isInLupa, muu)
                      }}
                    />
                    <label htmlFor={identifier}></label>
                  </Checkbox>
                  <Div margin="0 10px" flex="5">{kuvaus}</Div>
                </CheckboxRowContainer>
              )
            }
          })}


        </Row>
      </div>
    )
  }
}
const selector = formValueSelector(FORM_NAME_UUSI_HAKEMUS)

MuutospyyntoWizardMuut = connect(state => {
  const muutmuutoksetValue = selector(state, FIELD_ARRAY_NAMES.MUUT)

  return {
    muutmuutoksetValue
  }
})(MuutospyyntoWizardMuut)

export default reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  // validate,
})(MuutospyyntoWizardMuut)
