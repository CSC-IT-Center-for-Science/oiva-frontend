import { connect } from 'react-redux'

import { fetchAvoimetAsiat } from "routes/Asiat/modules/asiat"
import AvoimetAsiat from '../components/AvoimetAsiat'

const mapStateToProps = (state) => {
    return {
        muutospyynnot: state.muutospyynnot,
        lupa: state.lupa
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAvoimetAsiat: () => dispatch(fetchAvoimetAsiat())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvoimetAsiat)