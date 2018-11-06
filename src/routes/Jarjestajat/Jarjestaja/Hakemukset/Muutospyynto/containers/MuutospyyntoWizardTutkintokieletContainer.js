import { connect } from 'react-redux'

import { fetchKielet } from "../modules/kielet"

import MuutospyyntoWizardTutkintokielet from '../components/MuutospyyntoWizardTutkintokielet'

const mapStateToProps = (state) => {
  return {
    kielet: state.kielet,
    koulutukset: state.koulutukset
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchKielet: () => dispatch(fetchKielet())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MuutospyyntoWizardTutkintokielet)
