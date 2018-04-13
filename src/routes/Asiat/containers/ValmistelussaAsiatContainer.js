import { connect } from 'react-redux'

import { fetchMuutospyynnotForEsittelija } from "routes/Asiat/modules/muutospyynnot"
import ValmistelussaAsiat from "../components/ValmistelussaAsiat";

const mapStateToProps = (state) => {
    return {
        muutospyynnot: state.muutospyynnot,
        lupa: state.lupa
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchMuutospyynnotForEsittelija: (esittelija, query) => dispatch(fetchMuutospyynnotForEsittelija(esittelija, query))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ValmistelussaAsiat)