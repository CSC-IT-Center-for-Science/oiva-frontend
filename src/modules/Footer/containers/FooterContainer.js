import { connect } from 'react-redux'

import Footer from 'modules/Footer/components/Footer'

const mapStateToProps = (state) => {
  return { user: state.user.user }
}

export default connect(mapStateToProps, null, null, { pure: false })(Footer)
