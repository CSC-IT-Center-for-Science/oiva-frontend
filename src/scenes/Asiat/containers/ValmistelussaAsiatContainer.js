import { connect } from 'react-redux'

import { fetchValmistelussaAsiat } from "routes/Asiat/modules/asiat"
import ValmistelussaAsiat from "../components/ValmistelussaAsiat";

const mapStateToProps = (state) => {
    return {
        muutospyynnot: state.muutospyynnot,
        lupa: state.lupa
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchValmistelussaAsiat: () => dispatch(fetchValmistelussaAsiat())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValmistelussaAsiat)