import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FieldArray, reduxForm, formValueSelector } from 'redux-form'

import { ContentContainer } from "../../../../../../modules/elements"
import { Kohdenumero, Otsikko, Row, Checkbox, CheckboxRowContainer, RadioCheckbox, Div } from "./MuutospyyntoWizardComponents"
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
      let yhteistyosopimukset = []
      let laajennettu = []
      let sisaoppilaitos = []
      let urheilijat = []
      let muumaarays = []
      let luokattomat = []

      _.forEach(muutList, (maarays) => {

        const { metadata, koodiArvo, koodisto } = maarays;
        const kasite = parseLocalizedField(metadata, 'FI', 'kasite');
        const kuvaus = parseLocalizedField(metadata, 'FI', 'kuvaus');

        if (kuvaus) {

          switch (kasite) {

            case "laajennettu": {
              laajennettu.push(maarays)
              break
            }
            case "sisaoppilaitos": {
              sisaoppilaitos.push(maarays)
              break
            }
            case "urheilu": {
              urheilijat.push(maarays)
              break
            }
            case "kokeilu": {
              kokeilut.push(maarays)
              break
            }
            case "yhteistyo": {
              yhteistyo.push(maarays)
              break
            }
            case "yhteistyosopimukset": {
              yhteistyosopimukset.push(maarays)
              break
            }
            case "vaativa": {
              vaativat.push(maarays)
              break
            }
            case "vankila": {
              vankilat.push(maarays)
              break
            }
            case "muumaarays": {
              muumaarays.push(maarays)
              break
            }
            default: {
            //   luokattomat.push(maarays)
            //   break
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
              muutList={yhteistyosopimukset}
              otsikko={MUUTOS_WIZARD_TEKSTIT.MUUTOS_MUUT.YHTEISTYOSOPIMUKSET.FI}
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
            <FieldArray
              name={FIELD_ARRAY_NAMES.MUUT}
              muut={muutCombined}
              editValues={muutmuutoksetValue}
              muutList={muumaarays}
              otsikko=''
              component={this.renderMuutMuutokset}
            />
            {/* <FieldArray
              name={FIELD_ARRAY_NAMES.MUUT}
              muut={muutCombined}
              editValues={muutmuutoksetValue}
              muutList={luokattomat}
              otsikko={MUUTOS_WIZARD_TEKSTIT.MUUTOS_MUUT.EI_LUOKKAA.FI}
              component={this.renderMuutMuutokset}
            /> */}

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

  getHuomioitavaKoodi = (data) => {
    let { metadata } = data;
    return parseLocalizedField(metadata, 'FI', 'huomioitavaKoodi');
  }

  renderMuutMuutokset = (props) => {
    const { muut, editValues, fields, otsikko } = props
    let { muutList } = props
    muutList = muutList.sort((a,b) => 
      this.getHuomioitavaKoodi(a) - this.getHuomioitavaKoodi(b)
    );

    let title = undefined;
    if (muutList.length > 0) title = parseLocalizedField(muutList[0].metadata)
    if(otsikko !== '') {
      title = otsikko
    }

    return (
      <div>
        <Row>
          <h4>{title}</h4>

          {muutList.map((muu, i) => {
            const {koodiArvo, koodisto, metadata, voimassaLoppuPvm} = muu
            const {koodistoUri} = koodisto
            const nimi = parseLocalizedField(metadata)
            // let kuvaus = parseLocalizedField(metadata, 'FI', 'huomioitavaKoodi') + " - " + parseLocalizedField(metadata, 'FI', 'kuvaus') || ''
            // let kuvaus = parseLocalizedField(metadata, 'FI', 'kuvaus') || ''

            let kuvaus = koodiArvo + " - " + parseLocalizedField(metadata, 'FI', 'kuvaus') || ''
          
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
            voimassaLoppuPvm !== undefined ? customClassName = "is-out-of-date" : null

            if ((isInLupa && !isRemoved) || isAdded) {
              isChecked = true
            }

            if (kuvaus && kuvaus !== '') {

              return (
                <div key={identifier}>
                  { koodiArvo === "2" && 
                    <p>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_MUUT.YKSIVALINTA.FI}:</p> 
                  }
                  { koodiArvo === "3" && 
                    <p>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_MUUT.LISAALINTA.FI}:</p> 
                  }
                  <CheckboxRowContainer key={identifier} className={customClassName}>
                    
                  { koodiArvo === "2" || koodiArvo === "16" || koodiArvo === "17" || koodiArvo === "18"
                    || koodiArvo === "19" || koodiArvo === "20" || koodiArvo === "21"    ?
                      <RadioCheckbox>
                        <input
                          type="checkbox"
                          id={identifier}
                          checked={isChecked}
                          disabled={voimassaLoppuPvm !== undefined}
                          onChange={(e) => {
                            handleCheckboxChange(e, editValues, fields, isInLupa, muu)
                          }}
                        />
                      <label htmlFor={identifier}></label>
                      </RadioCheckbox>
                    :
                      <Checkbox>
                        <input
                          type="checkbox"
                          id={identifier}
                          checked={isChecked}
                          disabled={voimassaLoppuPvm !== undefined}
                          onChange={(e) => {
                            handleCheckboxChange(e, editValues, fields, isInLupa, muu)
                          }}
                        />
                      <label htmlFor={identifier}></label>
                    </Checkbox>
                    }
                    <Div margin="0 10px" flex="5">{kuvaus}</Div>
                  </CheckboxRowContainer>
                  </div>
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
