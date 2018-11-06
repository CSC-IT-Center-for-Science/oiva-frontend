import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FieldArray, reduxForm, formValueSelector } from 'redux-form'
import 'react-select/dist/react-select.css'

import TutkintoKieliList from './TutkintoKieliList'
import { ContentContainer} from "../../../../../../modules/elements"
import { Row } from "./MuutospyyntoWizardComponents"
import Loading from "../../../../../../modules/Loading"
import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"
import { parseLocalizedField } from "../../../../../../modules/helpers"
import { FIELD_ARRAY_NAMES, FORM_NAME_UUSI_HAKEMUS } from "../modules/uusiHakemusFormConstants"

class MuutospyyntoWizardTutkintokielet extends Component {
  componentWillMount() {
    const { kielet } = this.props

    if (kielet && !kielet.fetched) {
      this.props.fetchKielet()
    }

  }

  render() {
    const { lupa, koulutukset } = this.props
    const { kohteet} = lupa
    const kohde = kohteet[2]
    const { kielet, tutkintokielimuutoksetValue, tutkinnotJaKoulutuksetValue } = this.props

    if (kielet.fetched) {
      return (
        <ContentContainer>
          <h4>{MUUTOS_WIZARD_TEKSTIT.MUUTOS_TUTKINTOKIELET.HEADING.FI}</h4>
          <Row>
            <FieldArray
              name={FIELD_ARRAY_NAMES.OPETUS_JA_TUTKINTOKIELET}
              kohde={kohde}
              kielet={kielet.data}
              koulutukset={koulutukset}
              kieliList={kielet.kieliList}
              tutkintomaaraykset={kohteet[1].maaraykset}
              tutkinnotJaKoulutuksetValue={tutkinnotJaKoulutuksetValue}
              editValues={tutkintokielimuutoksetValue}
              component={this.renderTutkintokieliList}
            />
          </Row>
        </ContentContainer>
      )
    } else if (kielet.isFetching) {
      return <Loading/>
    } else if (kielet.hasErrored) {
      return <h2>Tutkintokieliä ladatessa tapahtui virhe</h2>
    } else {
      return null
    }
  }

  renderTutkintokieliList(props) {
    const { kielet, kieliList, fields, editValues, kohde, tutkintomaaraykset, koulutukset, tutkinnotJaKoulutuksetValue } = props
    const { tutkinnotjakielet } = kohde

    // TODO: Tarvitaanko valittujen tutkintokielten listausta tässä?
    // const valitutKielet = getSelectedTutkintoKielet(tutkinnotjakielet, editValues)

    return (
      <div>
        <Row>

          {_.map(tutkintomaaraykset, (koulutusala, i) => {
            const koodiarvo = koulutusala.koodi || koulutusala.koodiarvo || koulutusala.koodiArvo
            const { nimi, metadata, koulutusalat } = koulutusala
            let nimiText = nimi
            let arrays = _.flatten(_.concat(_.map(koulutusalat, ala => { return ala.koulutukset })))
            let koulutuslista = koulutukset.koulutusdata ? koulutukset.koulutusdata[koodiarvo].koulutukset : []

            if (!nimi && metadata) {
              nimiText = parseLocalizedField(metadata)
            } else {
              nimiText = nimi
            }

            return (
              <TutkintoKieliList
                key={i}
                koodiarvo={koodiarvo}
                nimi={nimiText}
                koulutukset={koulutuslista}
                maaraykset={arrays}
                editValues={editValues}
                fields={fields}
                kielet={kielet}
                kieliList={kieliList}
                tutkinnotjakielet={tutkinnotjakielet}
                tutkinnotJaKoulutuksetValue={tutkinnotJaKoulutuksetValue}
              />
            )
          })}

        </Row>
      </div>
    )
  }
}

const selector = formValueSelector(FORM_NAME_UUSI_HAKEMUS)

MuutospyyntoWizardTutkintokielet = connect(state => {
  const tutkintokielimuutoksetValue = selector(state, FIELD_ARRAY_NAMES.OPETUS_JA_TUTKINTOKIELET)
  const tutkinnotJaKoulutuksetValue = selector(state, FIELD_ARRAY_NAMES.TUTKINNOT_JA_KOULUTUKSET)

  return {
    tutkintokielimuutoksetValue,
    tutkinnotJaKoulutuksetValue
  }
})(MuutospyyntoWizardTutkintokielet)

export default reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  // validate,
})(MuutospyyntoWizardTutkintokielet)
