import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { reduxForm, formValueSelector } from 'redux-form'
import Moment from 'react-moment'

import validate from '../modules/validateWizard'
import { Row } from "./MuutospyyntoWizardComponents"
import { WizButton } from "./MuutospyyntoWizard"
import { COLORS } from "../../../../../../modules/styles"
import { parseLocalizedField } from "../../../../../../modules/helpers"

const Paatoskierros = ({ paatoskierros }) => (
  <div>
    {paatoskierros.meta.fi}&nbsp;
    (
      <Moment format="DD.MM.YYYY">{paatoskierros.alkupvm}</Moment>
      &nbsp;-&nbsp;
      <Moment format="DD.MM.YYYY">{paatoskierros.loppupvm}</Moment>
    )
  </div>
)

const Muutosperustelu = ({ muutosperustelu, muuperustelu }) => {
  const nimi = parseLocalizedField(muutosperustelu.metadata)

  return (
    <div>
      {nimi}
      {muuperustelu
        ? <span>:&nbsp;{muuperustelu}</span>
        : null
      }
    </div>
  )
}

let MuutospyyntoWizardYhteenveto = props => {
  const { handleSubmit, muutosperustelu, muuperustelu, paatoskierros, poistettavat, lisattavat, onCancel, paatoskierrokset, muutosperustelut } = props

  const paatoskierrosObj = _.find(paatoskierrokset.data, pkierros => {
    return String(pkierros.id) === String(paatoskierros)
  })

  const muutosperusteluObj = _.find(muutosperustelut.data, mperustelu => {
    return String(mperustelu.koodiArvo) === String(muutosperustelu)
  })

  return (
    <div>
      <h2>Yhteenveto</h2>

      <div>
        <h3>Päätöskierros</h3>
        {paatoskierrosObj
          ? <Paatoskierros paatoskierros={paatoskierrosObj} />
          : <div>Paatoskierroksen tietoja ei voitu ladata</div>
        }
      </div>

      <div>
        <h3>Muutoksen perustelu</h3>
        {muutosperusteluObj
          ? <Muutosperustelu muutosperustelu={muutosperusteluObj} muuperustelu={muuperustelu} />
          : <div>Muutosperustelun tietoja ei voitu ladata</div>
        }
      </div>

      <div>
        <h3>Lisättävät tutkinnot</h3>
        <div>
          {lisattavat
            ? lisattavat.map(tutkinto => <div key={tutkinto}>{tutkinto}</div>)
            : 'Ei lisättäviä tutkintoja'
          }
        </div>
      </div>

      <div>
        <h3>Poistettavat tutkinnot</h3>
        <div>
          {poistettavat
            ? poistettavat.map(tutkinto => <div key={tutkinto}>{tutkinto}</div>)
            : 'Ei poistettavia tutkintoja'
          }
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <WizButton type="submit" className="next">
          Tallenna
        </WizButton>
        <WizButton bgColor={COLORS.OIVA_RED} onClick={(e) => onCancel(e)}>Peruuta</WizButton>
      </form>
    </div>
  )
}

const selector = formValueSelector('uusi-hakemus')

MuutospyyntoWizardYhteenveto = connect(state => {
  const muutosperustelu = selector(state, 'muutosperustelu')
  const muuperustelu = selector(state, 'muuperustelu')
  const paatoskierros = selector(state, 'paatoskierros')
  const poistettavat = selector(state, 'poistettavat')
  const lisattavat = selector(state, 'lisattavat')

  return {
    muutosperustelu,
    muuperustelu,
    paatoskierros,
    poistettavat,
    lisattavat,
    muutosperustelut: state.muutosperustelut,
    paatoskierrokset: state.paatoskierrokset
  }
})(MuutospyyntoWizardYhteenveto)

export default reduxForm({
  form: 'uusi-hakemus',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate
})(MuutospyyntoWizardYhteenveto)
