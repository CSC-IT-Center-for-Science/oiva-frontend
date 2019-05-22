import { connect } from 'react-redux'

import { fetchMaakuntakunnat } from "../../../../../../modules/reducers/maakuntakunnat"

import MuutospyyntoWizardToimialue from '../components/MuutospyyntoWizardToimialue'

const mapStateToProps = (state) => {
  return {
    maakuntakunnat: state.maakuntakunnat
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchMaakuntakunnat: () => dispatch(fetchMaakuntakunnat())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MuutospyyntoWizardToimialue)
