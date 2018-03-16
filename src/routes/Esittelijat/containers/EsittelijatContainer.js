import { connect } from 'react-redux'

import { fetchMuutospyynnotForEsittelija } from "routes/Esittelijat/modules/muutospyynnot"
import Esittelijat from '../components/Esittelijat'

const mapStateToProps = (state) => {
    return {
        muutospyynnot: state.muutospyynnot,
        lupa: state.lupa,
        user: state.user.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchMuutospyynnotForEsittelija: (esittelija, query) => dispatch(fetchMuutospyynnotForEsittelija(esittelija, query))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Esittelijat)