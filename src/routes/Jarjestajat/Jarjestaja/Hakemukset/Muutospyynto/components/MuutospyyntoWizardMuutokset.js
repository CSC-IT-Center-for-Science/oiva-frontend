import React, { Component } from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'

import MuutospyyntoWizardTutkinnot from './MuutospyyntoWizardTutkinnot'
import MuutospyyntoWizardOpetuskieletContainer from '../containers/MuutospyyntoWizardOpetuskieletContainer'
import MuutospyyntoWizardTutkintokieletContainer from '../containers/MuutospyyntoWizardTutkintokieletContainer'
import MuutospyyntoWizardToimialueContainer from '../containers/MuutospyyntoWizardToimialueContainer'
import MuutospyyntoWizardOpiskelijavuodet from './MuutospyyntoWizardOpiskelijavuodet'
import MuutospyyntoWizardMuutContainer from '../containers/MuutospyyntoWizardMuutContainer'
import { Button, SubtleButton, Kohde, WizardBottom, Container } from "./MuutospyyntoWizardComponents"
import styled from 'styled-components'
import { FORM_NAME_UUSI_HAKEMUS } from "../modules/uusiHakemusFormConstants"
import { hasFormChanges } from "../modules/muutospyyntoUtil"
import { MUUT_KEYS } from "../modules/constants"

const Otsikko = styled.div`
  display: flex;
  align-items: baseline;
`

class MuutospyyntoWizardMuutokset extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: false
    }
  }

  componentWillMount() {
    // MuutospyyntoWIzardTutkinnot ja MuutospyyntoWizardTutkintokielet tarvitsevat listan tutkinnoista
    if (!this.props.koulutusalat.fetched && !this.props.koulutusalat.hasErrored) {
      this.props.fetchKoulutusalat()
        .then(() => {
          if (this.props.koulutusalat.fetched && !this.props.koulutusalat.hasErrored) {
            this.props.fetchKoulutuksetAll()
            this.props.fetchKoulutuksetMuut(MUUT_KEYS.KULJETTAJAKOULUTUS)
            this.props.fetchKoulutuksetMuut(MUUT_KEYS.OIVA_TYOVOIMAKOULUTUS)
            this.props.fetchKoulutuksetMuut(MUUT_KEYS.AMMATILLISEEN_TEHTAVAAN_VALMISTAVA_KOULUTUS)
            this.props.fetchKoulutus("999901")
            this.props.fetchKoulutus("999903")
          }
        })
    }
  }

  render() {
    const {
      onSubmit,
      save,
//      update,
      lupa,
      formValues
    } = this.props

    return (
      <div>

        <Otsikko>Seuraavat kohdat on jaoteltu ammatillisten tutkintojen ja koulutuksen järjestämisluvan rakenteen
          mukaisesti. Hakijan tulee täyttää alla olevat kohdat vain siltä osin, mihin tutkintojen ja koulutuksen
          järjestämislupaan haetaan muutosta. Tarkemmat ohjeistukset sekä pykäläviittaukset ammatillisen koulutuksen
          lakiin (531/2017) on esitetty kohdittain.</Otsikko>

        <form onSubmit={onSubmit}>
          <MuutospyyntoWizardTutkinnot
            lupa={lupa}
          />

          <Kohde>
            <MuutospyyntoWizardOpetuskieletContainer
              lupa={lupa}
            />

            <MuutospyyntoWizardTutkintokieletContainer
              lupa={lupa}
            />
          </Kohde>

          <Kohde>
            <MuutospyyntoWizardToimialueContainer
              lupa={lupa}
            />
          </Kohde>

          <Kohde>
            <MuutospyyntoWizardOpiskelijavuodet
              lupa={lupa}
            />
          </Kohde>

          <Kohde>
            <MuutospyyntoWizardMuutContainer
              lupa={lupa}
            />
          </Kohde>

          <WizardBottom>
            <Container maxWidth="1085px" padding="15px">
              <Button className="previous button-left button-hidden">Edellinen</Button>
              <div>
                {/*{update !== undefined*/}
                  {/*? <SubtleButton disabled={!hasFormChanges(formValues)} onClick={(e) => update(e, formValues)}>Päivitä luonnos</SubtleButton>*/}
                  {/*: <SubtleButton disabled={!hasFormChanges(formValues)} onClick={(e) => save(e, formValues)}>Tallenna luonnos</SubtleButton>*/}
                {/*}*/}
                <SubtleButton disabled={!hasFormChanges(formValues)} onClick={(e) => save(e, formValues)}>Tallenna luonnos</SubtleButton>
              </div>
              <Button type="submit" className="next button-right">Seuraava</Button>
            </Container>
          </WizardBottom>
        </form>
      </div>
    )

  }
}

MuutospyyntoWizardMuutokset = reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize : true
})(MuutospyyntoWizardMuutokset)

export default connect(state => {
  let formVals = undefined
  if (state.form && state.form.uusiHakemus && state.form.uusiHakemus.values) {
    formVals = state.form.uusiHakemus.values
  }

  return {
    formValues: formVals,
    koulutusalat: state.koulutusalat
  }
})(MuutospyyntoWizardMuutokset)
