import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm, formValueSelector } from 'redux-form'
import validate from '../modules/validateWizard'
import { TUTKINTO_TEKSTIT } from "../../../modules/constants"
import TutkintoList from './TutkintoList'
import KoulutusList from './KoulutusList'
import { parseLocalizedField } from "../../../../../../modules/helpers"
import { ContentContainer } from "../../../../../../modules/elements"
import Loading from '../../../../../../modules/Loading'
import {
  Kohdenumero,
  Otsikko,
  Row,
  Kohde,
  Info,
} from './MuutospyyntoWizardComponents'
import { FIELD_ARRAY_NAMES, FORM_NAME_UUSI_HAKEMUS, MUUTOS_TYPES } from "../modules/uusiHakemusFormConstants"

class MuutospyyntoWizardTutkinnot extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { lupa, tutkintomuutoksetValue } = this.props
    const { kohteet } = lupa
    const { headingNumber, heading } = kohteet[1]
    const koulutusdata = this.props.koulutukset.koulutusdata
    const koulutuksetFetched = this.props.koulutukset.fetched
    const koulutuksetIsFetching = this.props.koulutukset.isFetching
    const koulutuksetHasErrored = this.props.koulutukset.hasErrored

    let muutFetched = undefined
    let muutIsFetching = undefined
    let muutHasErrored = undefined
    let muuData = undefined
    let poikkeusData = undefined

    const { muut, poikkeukset } = this.props.koulutukset

    if (muut) {
      muutFetched = muut.fetched
      muutIsFetching = muut.isFetching
      muutHasErrored = muut.hasErrored
      muuData = muut.muudata
    }

    if (poikkeukset) {
      poikkeusData = poikkeukset.data
    }

    if (koulutuksetFetched && muutFetched && muuData !== undefined && poikkeusData !== undefined) {
      return (
        <Kohde>
          <ContentContainer>
            <Kohdenumero>{headingNumber}.</Kohdenumero>
            <Otsikko>{heading}</Otsikko>
            <Row>
              <FieldArray
                name={FIELD_ARRAY_NAMES.TUTKINNOT_JA_KOULUTUKSET}
                kohde={kohteet[1]}
                lupa={lupa}
                data={koulutusdata}
                muut={muuData}
                editValue={tutkintomuutoksetValue}
                component={this.renderTutkinnot}
              />
            </Row>

            <Row>
              <FieldArray
                name={FIELD_ARRAY_NAMES.TUTKINNOT_JA_KOULUTUKSET}
                kohde={kohteet[1]}
                lupa={lupa}
                muut={muuData}
                poikkeukset={poikkeusData}
                editValue={tutkintomuutoksetValue}
                component={this.renderKoulutukset}
              />
            </Row>
          </ContentContainer>
        </Kohde>
      )
    } else if (koulutuksetIsFetching || muutIsFetching) {
      return <Loading/>
    } else if (koulutuksetHasErrored || muutHasErrored) {
      return <h2>Virhe ladattaessa tietoja</h2>
    } else {
      return null
    }
  }

  renderTutkinnot(props) {
    let { fields, data } = props
    const { kohde, lupa, editValue, muut } = props
    const { headingNumber, heading, maaraykset, muutMaaraykset } = kohde

    data = _.sortBy(data, d => {
      return d.koodiArvo
    })

    return (
      <Row>
        {_.map(data, (koulutusala, i) => {
          const koodiarvo = koulutusala.koodiarvo || koulutusala.koodiArvo
          const { metadata, koulutukset } = koulutusala
          const nimi = parseLocalizedField(metadata)
          return (
            <TutkintoList
              key={i}
              koodiarvo={koodiarvo}
              nimi={nimi}
              koulutukset={koulutukset}
              maaraykset={maaraykset}
              editValues={editValue}
              fields={fields}
            />
          )
        })}
      </Row>
    )
  }

  renderKoulutukset(props) {
    const { kohde, muut, poikkeukset, editValue, fields } = props
    const { muutMaaraykset } = kohde

    return (
      <Row>
        <Info>{TUTKINTO_TEKSTIT.otsikkoTaydentava.FI}</Info>

        <KoulutusList
          key="valmentavat"
          koodisto="koulutus"
          nimi="Valmentavat koulutukset"
          koulutukset={poikkeukset}
          muutMaaraykset={muutMaaraykset}
          editValues={editValue}
          fields={fields}
        />

        {muut.ammatilliseentehtavaanvalmistavakoulutus &&
          <KoulutusList
            key="ammatilliseentehtavaanvalmistavakoulutus"
            koodisto="ammatilliseentehtavaanvalmistavakoulutus"
            nimi="Ammatilliseen tehtävään valmistavat koulutukset"
            koulutukset={muut.ammatilliseentehtavaanvalmistavakoulutus}
            muutMaaraykset={muutMaaraykset}
            editValues={editValue}
            fields={fields}
          />
        }

        {muut.oivatyovoimakoulutus &&
          <KoulutusList
            key="oivatyovoimakoulutus"
            koodisto="oivatyovoimakoulutus"
            nimi="Työvoimakoulutukset"
            koulutukset={muut.oivatyovoimakoulutus}
            muutMaaraykset={muutMaaraykset}
            editValues={editValue}
            fields={fields}
          />
        }

        {muut.kuljettajakoulutus &&
          <KoulutusList
            key="kuljettajakoulutus"
            koodisto="kuljettajakoulutus"
            nimi="Kuljettajakoulutukset"
            koulutukset={muut.kuljettajakoulutus}
            muutMaaraykset={muutMaaraykset}
            editValues={editValue}
            fields={fields}
          />
        }

      </Row>
    )
  }
}

const selector = formValueSelector(FORM_NAME_UUSI_HAKEMUS)

MuutospyyntoWizardTutkinnot = connect(state => {
  const tutkintomuutoksetValue = selector(state, FIELD_ARRAY_NAMES.TUTKINNOT_JA_KOULUTUKSET)

  return {
    tutkintomuutoksetValue,
    koulutukset: state.koulutukset,
    paatoskierrokset: state.paatoskierrokset
  }
})(MuutospyyntoWizardTutkinnot)

export default reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize : true,
  validate
})(MuutospyyntoWizardTutkinnot)
