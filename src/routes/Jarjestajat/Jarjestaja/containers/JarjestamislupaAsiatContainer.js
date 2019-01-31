import { connect } from 'react-redux'

import { fetchLupaHistory } from '../modules/history'
import JarjestamislupaAsiatList from '../components/JarjestamislupaAsiatList'


const mapStateToProps = (state) => {
  return { lupaHistory: state.lupaHistory }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLupaHistory: (oid) => dispatch(fetchLupaHistory(oid))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JarjestamislupaAsiatList)