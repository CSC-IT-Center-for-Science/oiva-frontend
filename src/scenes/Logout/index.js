import { connect } from 'react-redux'

import { logoutUser } from 'services/users/reducer'
import Logout from './components/Logout'

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: () => dispatch(logoutUser())
  }
}

export default connect(null, mapDispatchToProps)(Logout)
