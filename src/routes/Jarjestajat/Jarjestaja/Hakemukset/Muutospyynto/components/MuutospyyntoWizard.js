import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { withRouter, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Modal from 'react-modal'

import MuutospyyntoWizardMuutokset from './MuutospyyntoWizardMuutokset'
import MuutospyyntoWizardPerustelut from './MuutospyyntoWizardPerustelut'
import MuutospyyntoWizardTaloudelliset from './MuutospyyntoWizardTaloudelliset'
import MuutospyyntoWizardYhteenveto from './MuutospyyntoWizardYhteenveto'

import Loading from '../../../../../../modules/Loading'

import { ContentContainer, ContentWrapper } from "../../../../../../modules/elements"
import { WizardBackground, WizardTop, WizardWrapper, WizardHeader, WizardContent, Container, Button } from "./MuutospyyntoWizardComponents"
import { COLORS } from "../../../../../../modules/styles"
import close from 'static/images/close-x.svg'
import { ROLE_KAYTTAJA } from "../../../../../../modules/constants";
import { modalStyles, ModalButton, ModalText, Content } from "./ModalComponents"
import { FORM_NAME_UUSI_HAKEMUS } from "../modules/uusiHakemusFormConstants"
import { getJarjestajaData } from "../modules/muutospyyntoUtil"

import { MdInfo } from 'react-icons/md';


import Draggable from 'react-draggable';

Modal.setAppElement('#root')

const CloseButton = styled.img`
  height: 20px;
  cursor: pointer;
  padding: 4px;
`

const HelpButton = styled.div`
  height: 20px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  svg {
    height: 24px;
    width: 24px;
    margin-right: 8px;
  }
  &:hover {
    background: ${COLORS.OIVA_TABLE_HOVER_COLOR};
  }
`

const CloseHelpButton = styled.div`
  height: 20px;
  cursor: pointer;
  padding: 4px;
  &:hover {
    background: ${COLORS.OIVA_TABLE_HOVER_COLOR};
  }
`

const PhaseStyle = styled.div`
  display: flex;
  align-items: baseline;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`

const Circle = styled.div`
  background: ${props => props.active ? COLORS.OIVA_GREEN : COLORS.LIGHT_GRAY};
  color: ${COLORS.WHITE};
  height: 27px;
  width: 27px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`

const Text = styled.div`
  color: ${props => props.active ? COLORS.BLACK : 'rgb(96, 96, 96)'};
`

const HideFooter = styled.div`
  background-color: white;
  width: 100%;
  position: relative;
  bottom: -100px;
  height: 100px;
`
const Help = styled.div`
  background-color: #fffff0;
  border: 1px solid #afafa0;
  width: 20vw;
  min-width: 300px;
  position: fixed;
  top: 120px;
  min-height: 200px;
  max-height: 90vh;
  right: 20px;
  z-index: 100;
  opacity: 0.9;
  cursor: move;
  padding: 10px 20px;
  overflow-y: auto;
  overflow-x: wrap; 

  h3 {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    svg {
      margin-bottom: -2px;
      color: ${COLORS.DARK_GRAY};
    }
  }
`

const Phase = ({ number, text, activePage, disabled, handleClick }) => {
  const isActive = Number(number) === Number(activePage)

  return (
    <PhaseStyle disabled={disabled} onClick={disabled ? null : () => handleClick(Number(number))}>
      <Circle active={isActive}>{number}</Circle>
      <Text active={isActive}>{text}</Text>
    </PhaseStyle>
  )
}

class MuutospyyntoWizard extends Component {
  constructor(props) {
    super(props)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.changePhase = this.changePhase.bind(this)
    this.preview = this.preview.bind(this)
    this.save = this.save.bind(this)
    this.openCancelModal = this.openCancelModal.bind(this)
    this.afterOpenCancelModal = this.afterOpenCancelModal.bind(this)
    this.closeCancelModal = this.closeCancelModal.bind(this)
    this.state = {
      page: 1,
      visitedPages: [1],
      isCloseModalOpen: false,
      showHelp: false
    }
  }

  componentWillMount() {
    this.props.fetchMuutosperustelut()
    this.props.fetchVankilat()
    this.props.fetchELYkeskukset()
    const { ytunnus } = this.props.match.params
    this.props.fetchLupa(ytunnus, '?with=all')
    this.props.fetchPaatoskierrokset()
    this.props.fetchMaaraystyypit()
    this.props.fetchKohteet()
  }

  nextPage() {
    const next = this.state.page + 1
    let visited = this.state.visitedPages

    if (visited.indexOf(next) === -1) {
      visited.push(next)
      this.setState({ page: next, visitedPages: visited })
    } else {
      this.setState({ page: next })
    }
  }

  previousPage() {
    this.setState({ page: this.state.page - 1 })
  }

  onCancel(event) {
    if (event) {
      event.preventDefault()
    }
    const url = `/jarjestajat/${this.props.match.params.ytunnus}`
    this.props.history.push(url)
  }

  onSubmit(data) {


    // this.onCancel() // TODO: tehdään onDone-funktio
  }

  save(event, data) {
    if (event) {
      event.preventDefault()
    }

    console.log('save', data)
    this.props.saveMuutospyynto(data)
    const url = `/jarjestajat/${this.props.match.params.ytunnus}`
    this.props.saveMuutospyynto(data).then(() => {
       let uuid = this.props.muutospyynto.save.response.data
       let newurl = url + "/hakemukset-ja-paatokset/" + uuid
       this.props.history.push(newurl)
       })

  }

  preview(event, data) {
      event.preventDefault()
      this.props.previewMuutospyynto(data).then(() => {

          var binaryData = [];
          binaryData.push(this.props.muutospyynto.pdf.data);
          const data =  window.URL.createObjectURL(new Blob(binaryData, {type: "application/pdf"}))
          //const data =  window.URL.createObjectURL(response.data)
          var link = document.createElement('a');
          link.href = data;
          link.download="file.pdf";
          link.click();
          // For Firefox it is necessary to delay revoking the ObjectURL
          setTimeout(window.URL.revokeObjectURL(data), 100)

      })
  }

  changePhase(number) {
    this.setState({ page: number })
  }

  openCancelModal(e) {
    e.preventDefault()
    this.setState({ isCloseModalOpen: true })
  }

  afterOpenCancelModal() {
  }

  closeCancelModal() {
    this.setState({ isCloseModalOpen: false })
  }

  showHelp = (e) => {
    this.setState( {showHelp: !this.state.showHelp} );
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const { muutosperustelut, vankilat, ELYkeskukset, lupa, paatoskierrokset } = this.props
    const { page, visitedPages } = this.state

    if (sessionStorage.getItem('role') !== ROLE_KAYTTAJA) {
        return (
            <h2>Uuden hakemuksen tekeminen vaatii kirjautumisen palveluun.</h2>
        )
    }

    // TODO: organisaation oid pitää tarkastaa jotain muuta kautta kuin voimassaolevasta luvasta
    const { jarjestajaOid } = this.props.lupa.data
    if (sessionStorage.getItem('oid') !== jarjestajaOid) {
        return (
            <h2>Sinulla ei ole oikeuksia katsoa toisen organisaation hakemuksia.</h2>
        )
    }

    if (muutosperustelut.fetched && vankilat.fetched && ELYkeskukset.fetched && lupa.fetched && paatoskierrokset.fetched) {
      return (
        <ContentWrapper>
          <WizardBackground />

          <WizardWrapper>
            <WizardTop>
              <Container padding="0 20px">
                <div>Uusi muutoshakemus</div>
                <HelpButton onClick={ e => this.showHelp(e) }><MdInfo />Ohje</HelpButton>
                <CloseButton src={close} onClick={this.openCancelModal} />
              </Container>
            </WizardTop>

            <WizardHeader>
              <Container maxWidth="1085px" color={COLORS.BLACK}>
                <Phase number="1" text="Muutokset" activePage={page} handleClick={(number) => this.changePhase(number)} />
                <Phase number="2" text="Perustelut" activePage={page} disabled={visitedPages.indexOf(2) === -1} handleClick={(number) => this.changePhase(number)} />
                <Phase number="3" text="Taloudelliset edellytykset" activePage={page} disabled={visitedPages.indexOf(3) === -1} handleClick={(number) => this.changePhase(number)} />
                <Phase number="4" text="Yhteenveto" activePage={page} disabled={visitedPages.indexOf(4) === -1} handleClick={(number) => this.changePhase(number)} />
              </Container>
            </WizardHeader>

            <ContentContainer maxWidth="1085px" padding={this.state.showHelp ? "0 200px 0 0": "0"}>
              <WizardContent>
                {page === 1 && (
                  <MuutospyyntoWizardMuutokset
                    previousPage={this.previousPage}
                    onSubmit={this.nextPage}
                    onCancel={this.onCancel}
                    save={this.save}
                    lupa={lupa}
                    fetchKoulutusalat={this.props.fetchKoulutusalat}
                    fetchKoulutustyypit={this.props.fetchKoulutustyypit}
                    fetchKoulutuksetAll={this.props.fetchKoulutuksetAll}
                    fetchKoulutuksetMuut={this.props.fetchKoulutuksetMuut}
                    fetchKoulutus={this.props.fetchKoulutus}
                    showHelp={this.showHelp}                    
                  />
                )}
                {page === 2 && (
                  <MuutospyyntoWizardPerustelut
                    previousPage={this.previousPage}
                    onSubmit={this.nextPage}
                    onCancel={this.onCancel}
                    save={this.save}
                    muutosperustelut={this.props.muutosperustelut.data}
                    vankilat={this.props.vankilat.data}
                    ELYkeskukset={this.props.ELYkeskukset.data}
                  />
                )}
                {page === 3 && (
                  <MuutospyyntoWizardTaloudelliset
                    previousPage={this.previousPage}
                    onCancel={this.onCancel}
                    onSubmit={this.nextPage}
                    save={this.save}
                />
                )}
                {page === 4 && (
                  <MuutospyyntoWizardYhteenveto
                    previousPage={this.previousPage}
                    onCancel={this.onCancel}
                    onSubmit={this.onSubmit}
                    save={this.save}
                    preview={this.preview}
                    createMuutospyynto={this.props.createMuutospyynto}
                  />
                )}
              </WizardContent>
            </ContentContainer>
          </WizardWrapper>


          <Draggable
            handle=".handle"
            position={null}
            grid={[25, 25]}
            >

            <Help className="handle" hidden={!this.state.showHelp}>
              <h3>
                <span><MdInfo /> Ohje</span>
                <CloseHelpButton src={close} onClick={() => this.setState( {showHelp: false })}>
                   &#10005;
                </CloseHelpButton>
              </h3>
              <p>Seuraavat kohdat on jaoteltu ammatillisten tutkintojen ja koulutuksen järjestämisluvan rakenteen mukaisesti. Hakijan tulee täyttää alla olevat kohdat vain siltä osin, mihin tutkintojen ja koulutuksen järjestämislupaan haetaan muutosta. Tarkemmat ohjeistukset sekä pykäläviittaukset ammatillisen koulutuksen lakiin (531/2017) on esitetty kohdittain.</p>
              <p>Seuraavat kohdat on jaoteltu ammatillisten tutkintojen ja koulutuksen järjestämisluvan rakenteen mukaisesti. Hakijan tulee täyttää alla olevat kohdat vain siltä osin, mihin tutkintojen ja koulutuksen järjestämislupaan haetaan muutosta. Tarkemmat ohjeistukset sekä pykäläviittaukset ammatillisen koulutuksen lakiin (531/2017) on esitetty kohdittain.</p>
              <p>Seuraavat kohdat on jaoteltu ammatillisten tutkintojen ja koulutuksen järjestämisluvan rakenteen mukaisesti. Hakijan tulee täyttää alla olevat kohdat vain siltä osin, mihin tutkintojen ja koulutuksen järjestämislupaan haetaan muutosta. Tarkemmat ohjeistukset sekä pykäläviittaukset ammatillisen koulutuksen lakiin (531/2017) on esitetty kohdittain.</p>            
            </Help>

          </Draggable>

          <HideFooter />

          <Modal
            isOpen={this.state.isCloseModalOpen}
            onAfterOpen={this.afterOpenCancelModal}
            onRequestClose={this.closeCancelModal}
            contentLabel="Poistu muutoshakemuksen teosta"
            style={modalStyles}
          >
            <Content>
              <ModalText>Oletko varma, että haluat poistua muutoshakemuksen luonnista? Tekemiäsi muutoksia ei tallenneta.</ModalText>
            </Content>
            <div>
              <ModalButton primary onClick={this.onCancel}>Kyllä</ModalButton>
              <ModalButton onClick={this.closeCancelModal}>Ei</ModalButton>
            </div>
          </Modal>
        </ContentWrapper>
      )
    } else if (muutosperustelut.isFetching || vankilat.isFetching || ELYkeskukset.isFetching || lupa.isFetching || paatoskierrokset.isFetching) {
      return <Loading />
    } else if (muutosperustelut.hasErrored) {
      return <div>Muutospyyntöä ei voida tehdä. Muutosperusteluita ladattaessa tapahtui virhe.</div>
    } else if (vankilat.hasErrored) {
      return <div>Muutospyyntöä ei voida tehdä. Vankilalistausta ladattaessa tapahtui virhe.</div>
    } else if (ELYkeskukset.hasErrored) {
      return <div>Muutospyyntöä ei voida tehdä. ELY-keskuslistausta ladattaessa tapahtui virhe.</div>
    } else if (paatoskierrokset.hasErrored) {
      return <div>Muutospyyntöä ei voida tehdä. Päätoskierroksia ladattaessa tapahtui virhe.</div>
    } else if (lupa.hasErrored) {
      return <div>Muutospyyntöä ei voida tehdä. Lupaa haettaessa tapahtui virhe.</div>
    } else {
      return null
    }
  }
}

MuutospyyntoWizard = reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})(MuutospyyntoWizard)

MuutospyyntoWizard = connect(state => {
  return {
    initialValues: getJarjestajaData(state)
  }
})(MuutospyyntoWizard)

export default withRouter(MuutospyyntoWizard)
