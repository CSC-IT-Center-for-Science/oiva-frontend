import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form'
import Select from 'react-select'

import Loading from '../../../../../../modules/Loading'

import { ContentContainer } from "../../../../../../modules/elements"
import { Kohdenumero, Otsikko, Row, CheckboxRowContainer, Checkbox, Nimi } from "./MuutospyyntoWizardComponents"
import { getToimialueByKoodiArvo, handleToimialueSelectChange } from "../modules/toimialueUtil"
import { handleSimpleCheckboxChange } from "../modules/koulutusUtil"
import { FIELD_ARRAY_NAMES, FORM_NAME_UUSI_HAKEMUS, MUUTOS_TYPES } from "../modules/uusiHakemusFormConstants"

class MuutospyyntoWizardToimialue extends Component {
  componentWillMount() {
    const { kunnat, maakunnat, maakuntakunnat } = this.props

    if (kunnat && !kunnat.fetched) {
      this.props.fetchKunnat()
    }

    if (maakunnat && !maakunnat.fetched) {
      this.props.fetchMaakunnat()
    }

    if (maakuntakunnat && !maakuntakunnat.fetched) {
      this.props.fetchMaakuntakunnat()
    }
  }

  render() {
    const { lupa, valtakunnallinenmuutoksetValue, toimialuemuutoksetValue, kunnat, maakunnat, maakuntakunnat } = this.props
    const { kohteet } = lupa
    const { headingNumber, heading } = kohteet[3]
    const maakuntaMaaraykset = kohteet[3].maakunnat
    const kuntaMaaraykset = kohteet[3].kunnat
    const valtakunnallinen = kohteet[3].valtakunnallinen || false

    if (kunnat.fetched && maakunnat.fetched && maakuntakunnat.fetched) {
      return (
        <ContentContainer>
          <Kohdenumero>{headingNumber}.</Kohdenumero>
          <Otsikko>{heading}</Otsikko>
          <Row>
            <p>Tähän lyhyt ohjeteksti kohteen täyttämisestä</p>
          </Row>
          <Row>
            <FieldArray
              name={FIELD_ARRAY_NAMES.TOIMINTA_ALUEET}
              maakunnat={maakuntaMaaraykset}
              kunnat={kuntaMaaraykset}
              editValues={toimialuemuutoksetValue}
              maakuntaList={maakunnat.maakuntaList}
              kuntaList={kunnat.kuntaList}
              maakuntakunnatList={maakuntakunnat.maakuntakunnatList}
              valtakunnallinen={valtakunnallinen}
              component={this.renderToimialueMuutokset}
            />
          </Row>
          <Row>
            <FieldArray
              name="valtakunnallinen"
              editValues={valtakunnallinenmuutoksetValue}
              valtakunnallinen={valtakunnallinen}
              component={this.renderValtakunnallinen}
            />
          </Row>
        </ContentContainer>
      )
    } else if (kunnat.hasErrored || maakunnat.hasErrored || maakuntakunnat.hasErrored) {
      return <h2>Toiminta-aluetta ladattaessa tapahtui virhe</h2>
    } else if (kunnat.isFetching || maakunnat.isFetching || maakuntakunnat.isFetching) {
      return <Loading/>
    } else {
      return null
    }
  }

  renderToimialueMuutokset(props) {
    const { maakunnat, kunnat, maakuntakunnatList, editValues, fields } = props
    let opts = []
    let initialValue = []
    let valitutMaakunnat = []
    let valitutKunnat = []

    _.forEach(maakuntakunnatList, maakunta => {
      opts.push(maakunta)
      _.forEach(maakunta.kunta, kunta => {
        opts.push(kunta)
      })
    })

    maakunnat.forEach(maakunta => { initialValue.push(maakunta.koodiarvo) })
    kunnat.forEach(kunta => { initialValue.push(kunta.koodiarvo) })


    if (editValues) {
      editValues.forEach(value => {
        if (value.type === MUUTOS_TYPES.ADDITION) {
          initialValue.push(value.value)
        } else if (value.type === MUUTOS_TYPES.REMOVAL) {
          // Jätetään poistettu toimialue näkyville
          // if (_.includes(initialValue, value.value)) {
          //   _.pull(initialValue, value.value)
          // }
        }
      })
    }

    if (initialValue) {
      initialValue.forEach(value => {
        const alue = getToimialueByKoodiArvo(value)

        if (alue) {
          if (editValues) {
            const val = _.find(editValues, editValue => { return editValue.koodiArvo === value })
            if (val) {
              alue.type = val.type
            }
          }

          if (alue.tyyppi === "maakunta") {
            valitutMaakunnat.push(alue)
          } else if (alue.tyyppi === "kunta") {
            valitutKunnat.push(alue)
          }
        }
      })
    }

    return (
      <div>
        <p>Tähän lyhyt ohjeteksti toimialueiden valintaan liittyen</p>
        <ToimialueSelect
          options={opts}
          value={initialValue}
          initialValue={initialValue}
          editValues={editValues}
          fields={fields}
        />

        {initialValue && initialValue.length === 0 &&
          <h4>Toiminta-aluetta ei määritetty</h4>
        }

        {valitutMaakunnat.length > 0 &&
          <div>
            <h4>Maakunnat</h4>
            {valitutMaakunnat.map(alue => {
              const { label, type } = alue
              const customClass = type === MUUTOS_TYPES.ADDITION ? 'is-added' : type === MUUTOS_TYPES.REMOVAL ? 'is-removed' : 'is-in-lupa'
              return (
                <div key={label} className={customClass}>{label}</div>
              )
            })}
          </div>
        }

        {valitutKunnat.length > 0 &&
          <div>
            <h4>Kunnat</h4>
            {valitutKunnat.map(alue => {
              const { label, type } = alue
              const customClass = type === MUUTOS_TYPES.ADDITION ? 'is-added' : type === MUUTOS_TYPES.REMOVAL ? 'is-removed' : 'is-in-lupa'
              return (
                <div key={label} className={customClass}>{label}</div>
              )
            })}
          </div>
        }
      </div>
    )
  }

  renderValtakunnallinen(props) {
    const { editValues, fields } = props
    let { valtakunnallinen } = props

    let isInLupa = false
    let isChecked = false

    if (valtakunnallinen) {
      isChecked = true
      isInLupa = true
    } else {
      valtakunnallinen = { koodisto: 'nuts1', koodiarvo: 'FI1'}

      if (editValues) {
        const found = _.find(editValues, value => { return value.koodiarvo === 'FI1' })
        if (found) {
          isChecked = true
        }
      }
    }

    return (
      <div>
        <p>Tähän lyhyt ohjeteksti valtakunnallisen valintaan liittyen</p>
        <CheckboxRowContainer>
          <Checkbox>
            <input
              name="valtakunnallinencheckbox"
              id="valtakunnallinencheckbox"
              type="checkbox"
              checked={isChecked}
              onChange={(e) => { handleSimpleCheckboxChange(e, editValues, fields, isInLupa, valtakunnallinen) }}
            />
            <label htmlFor="valtakunnallinencheckbox"></label>
          </Checkbox>
          <Nimi>Koulutuksen järjestäjällä on velvollisuus järjestää tutkintoja ja koulutusta Ahvenanmaan maakuntaa lukuunottamatta koko Suomen osaamis- ja koulutustarpeeseen.</Nimi>
        </CheckboxRowContainer>
      </div>
    )
  }
}

class ToimialueSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  handleSelectChange(value) {
    this.setState({ value })
    const { editValues, fields, initialValue } = this.props
    handleToimialueSelectChange(editValues, fields, initialValue, value)
  }

  render() {
    const { value } = this.state
    const { options } = this.props

    return (
      <Select
        name="toimialue"
        multi
        options={options}
        value={value}
        onChange={this.handleSelectChange.bind(this)}
      />
    )
  }
}

const selector = formValueSelector(FORM_NAME_UUSI_HAKEMUS)

MuutospyyntoWizardToimialue = connect(state => {
  const toimialuemuutoksetValue = selector(state, FIELD_ARRAY_NAMES.TOIMINTA_ALUEET)
  const valtakunnallinenmuutoksetValue = selector(state, 'valtakunnallinen')

  return {
    valtakunnallinenmuutoksetValue,
    toimialuemuutoksetValue
  }
})(MuutospyyntoWizardToimialue)

export default reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  // validate,
})(MuutospyyntoWizardToimialue)
