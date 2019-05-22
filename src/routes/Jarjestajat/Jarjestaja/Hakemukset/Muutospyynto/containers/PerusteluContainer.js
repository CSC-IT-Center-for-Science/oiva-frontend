import { connect } from 'react-redux'

import Perustelu from '../components/Perustelu'
import { fetchMuutosperustelut } from "../../../../../../modules/reducers/muutosperustelut"
import { fetchMuutosperustelutOpiskelijavuodet } from "../../../../../../modules/reducers/muutosperustelutOpiskelijavuodet"
import { fetchVankilat } from "../../../../../../modules/reducers/vankilat"
import { fetchELYkeskukset } from "../../../../../../modules/reducers/elykeskukset"

const mapStateToProps = (state) => {
  return {
    muutosperustelut: state.muutosperustelut,
    muutosperustelutOpiskelijavuodet: state.muutosperustelutOpiskelijavuodet,
    vankilat: state.vankilat,
    ELYkeskukset: state.ELYkeskukset,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMuutosperustelut: () => dispatch(fetchMuutosperustelut()),
    fetchMuutosperustelutOpiskelijavuodet: () => dispatch(fetchMuutosperustelutOpiskelijavuodet()),
    fetchVankilat: () => dispatch(fetchVankilat()),
    fetchELYkeskukset: () => dispatch(fetchELYkeskukset())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Perustelu)
