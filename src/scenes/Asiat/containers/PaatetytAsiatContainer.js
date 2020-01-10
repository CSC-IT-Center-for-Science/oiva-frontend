import { connect } from 'react-redux'

import { fetchPaatetytAsiat } from "routes/Asiat/modules/asiat"
import PaatetytAsiat from "../components/PaatetytAsiat";

const mapStateToProps = (state) => {
    return {
        muutospyynnot: state.muutospyynnot,
        lupa: state.lupa
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPaatetytAsiat: () => dispatch(fetchPaatetytAsiat())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaatetytAsiat)