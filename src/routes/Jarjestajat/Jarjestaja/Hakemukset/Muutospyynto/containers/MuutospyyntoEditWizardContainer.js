import { connect } from 'react-redux'

import { fetchMuutosperustelut } from "../../../../../../modules/reducers/muutosperustelut"
import { fetchVankilat } from "../../../../../../modules/reducers/vankilat"
import { fetchELYkeskukset } from "../../../../../../modules/reducers/elykeskukset"
import { fetchLupa } from "../../../modules/lupa"
import { createMuutospyynto, saveMuutospyynto, fetchMuutospyynto, updateMuutospyynto } from "../modules/muutospyynto"
import { previewMuutospyynto } from "../modules/muutospyynto"
import { fetchKoulutusalat } from "../../../../../../modules/reducers/koulutusalat"
import { fetchKoulutuksetAll, fetchKoulutuksetMuut, fetchKoulutus } from "../../../../../../modules/reducers/koulutukset"
import { fetchPaatoskierrokset } from "../../../../../../modules/reducers/paatoskierrokset"
import { fetchMaaraystyypit } from "../../../../../../modules/reducers/maaraystyyppi"
import { fetchKohteet } from "../../../../../../modules/reducers/kohde"

import MuutospyyntoEditWizard from '../components/MuutospyyntoEditWizard'

const mapStateToProps = (state) => {
  return {
    muutosperustelut: state.muutosperustelut,
    vankilat: state.vankilat,
    ELYkeskukset: state.ELYkeskukset,
    lupa: state.lupa,
    koulutukset: state.koulutukset,
    paatoskierrokset: state.paatoskierrokset,
    muutospyynto: state.muutospyynto,
    maaraystyypit: state.maaraystyypit,
    kohteet: state.kohteet
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchMuutosperustelut: () => dispatch(fetchMuutosperustelut()),
    fetchVankilat: () => dispatch(fetchVankilat()),
    fetchELYkeskukset: () => dispatch(fetchELYkeskukset()),
    fetchLupa: (ytunnus, query) => dispatch(fetchLupa(ytunnus, query)),
    createMuutospyynto: (muutospyynto) => dispatch(createMuutospyynto(muutospyynto)),
    saveMuutospyynto: (muutospyynto) => dispatch(saveMuutospyynto(muutospyynto)),
    previewMuutospyynto: (muutospyynto) => dispatch(previewMuutospyynto(muutospyynto)),
    updateMuutospyynto: (muutospyynto) => dispatch(updateMuutospyynto(muutospyynto)),
    fetchMuutospyynto: (uuid) => dispatch(fetchMuutospyynto(uuid)),
    fetchKoulutusalat: () => dispatch(fetchKoulutusalat()),
    fetchKoulutuksetAll: () => dispatch(fetchKoulutuksetAll()),
    fetchKoulutuksetMuut: (koodisto) => dispatch(fetchKoulutuksetMuut(koodisto)),
    fetchKoulutus: (koodi) => dispatch(fetchKoulutus(koodi)),
    fetchPaatoskierrokset: () => dispatch(fetchPaatoskierrokset()),
    fetchMaaraystyypit: () => dispatch(fetchMaaraystyypit()),
    fetchKohteet: () => dispatch(fetchKohteet())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MuutospyyntoEditWizard)
