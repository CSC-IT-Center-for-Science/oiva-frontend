import { connect } from 'react-redux'

import Perustelu from '../components/Perustelu'
import { fetchMuutosperustelut } from "../../../../../../modules/reducers/muutosperustelut"
import { fetchVankilat } from "../../../../../../modules/reducers/vankilat"
import { fetchELYkeskukset } from "../../../../../../modules/reducers/elykeskukset"

const mapStateToProps = (state) => {
  return {
    muutosperustelut: state.muutosperustelut,
    vankilat: state.vankilat,
    ELYkeskukset: state.ELYkeskukset,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMuutosperustelut: () => dispatch(fetchMuutosperustelut()),
    fetchVankilat: () => dispatch(fetchVankilat()),
    fetchELYkeskukset: () => dispatch(fetchELYkeskukset())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Perustelu)
