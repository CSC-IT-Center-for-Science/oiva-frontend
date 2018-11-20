import { connect } from 'react-redux'

import Perustelu from '../components/Perustelu'
import { fetchMuutosperustelut } from "../../../../../../modules/reducers/muutosperustelut"
import { fetchVankilat } from "../../../../../../modules/reducers/vankilat"

const mapStateToProps = (state) => {
  return {
    muutosperustelut: state.muutosperustelut,
    vankilat: state.vankilat
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMuutosperustelut: () => dispatch(fetchMuutosperustelut()),
    fetchVankilat: () => dispatch(fetchVankilat())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Perustelu)
