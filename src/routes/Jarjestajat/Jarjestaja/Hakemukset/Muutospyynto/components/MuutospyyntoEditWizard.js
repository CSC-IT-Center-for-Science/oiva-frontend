import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Modal from 'react-modal'

import MuutospyyntoWizardMuutokset from './MuutospyyntoWizardMuutokset'
import MuutospyyntoWizardPerustelut from './MuutospyyntoWizardPerustelut'
import MuutospyyntoWizardTaloudelliset from './MuutospyyntoWizardTaloudelliset'
import MuutospyyntoWizardYhteenveto from './MuutospyyntoWizardYhteenveto'

import Loading from '../../../../../../modules/Loading'

import { ContentContainer, MessageWrapper } from "../../../../../../modules/elements"
import { WizardBackground, WizardTop, WizardWrapper, WizardHeader, WizardContent, Container } from "./MuutospyyntoWizardComponents"
import { COLORS } from "../../../../../../modules/styles"
import close from 'static/images/close-x.svg'
import { ROLE_KAYTTAJA } from "../../../../../../modules/constants";
import { modalStyles, ModalButton, ModalText, Content } from "./ModalComponents"
import { FORM_NAME_UUSI_HAKEMUS, HAKEMUS_VIRHE, HAKEMUS_VIESTI, HAKEMUS_OTSIKOT } from "../modules/uusiHakemusFormConstants"
import { loadFormData } from "../modules/muutospyyntoUtil"

Modal.setAppElement('#root')

const CloseButton = styled.img`
  height: 20px;
  cursor: pointer;
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

const Phase = ({ number, text, activePage, disabled, handleClick }) => {
  const isActive = Number(number) === Number(activePage)

  return (
    <PhaseStyle disabled={disabled} onClick={disabled ? null : () => handleClick(Number(number))}>
      <Circle active={isActive}>{number}</Circle>
      <Text active={isActive}>{text}</Text>
    </PhaseStyle>
  )
}

class MuutospyyntoEditWizard extends Component {
  constructor(props) {
    super(props)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.changePhase = this.changePhase.bind(this)
    this.preview = this.preview.bind(this)
    this.save = this.save.bind(this)
    this.update = this.update.bind(this)
    this.openCancelModal = this.openCancelModal.bind(this)
    this.afterOpenCancelModal = this.afterOpenCancelModal.bind(this)
    this.closeCancelModal = this.closeCancelModal.bind(this)
    this.state = {
      page: 1,
      visitedPages: [1],
      isCloseModalOpen: false,
      isErrorModalOpen: false,
    }
  }

  componentWillMount() {
    this.props.fetchMuutosperustelut()
    this.props.fetchMuutosperustelutOpiskelijavuodet()
    this.props.fetchVankilat()
    this.props.fetchELYkeskukset()
    const { ytunnus, uuid } = this.props.match.params
    this.props.fetchLupa(ytunnus, '?with=all')
    this.props.fetchPaatoskierrokset()
    this.props.fetchMaaraystyypit()
    this.props.fetchKohteet()
    this.props.fetchMuutospyynto(uuid)

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
    this.props.createMuutospyynto(data)
    // this.onCancel() // TODO: tehdään onDone-funktio
  }

  save = (event, data) => {
    if (event) {
      event.preventDefault()
    }

    console.log('save', data)
    let result = this.props.saveMuutospyynto(data).then(() => {
      if (!this.props.muutospyynto.save || this.props.muutospyynto.save.hasErrored)
        return (
          this.setState({ isErrorModalOpen: true })
        )
      }
    )
  }

  update(event, data) {
    if (event) {
      event.preventDefault()
    }

    console.log('update', data)
    this.props.updateMuutospyynto(data)
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

  closeErrorModal = () => {
    this.setState({ isErrorModalOpen: false })
  }
  
  render() {
    const { muutosperustelut, muutosperustelutOpiskelijavuodet, vankilat, ELYkeskukset, lupa, paatoskierrokset, muutospyynto, initialValues } = this.props
    const { page, visitedPages } = this.state

    // setTimeout(() => console.log(muutospyynto), 3000)

    if (sessionStorage.getItem('role') !== ROLE_KAYTTAJA) {
      return (
        <MessageWrapper><h3>{HAKEMUS_VIESTI.KIRJAUTUMINEN.FI}</h3></MessageWrapper>
      )
    }

    // TODO: organisaation oid pitää tarkastaa jotain muuta kautta kuin voimassaolevasta luvasta
    const { jarjestajaOid } = this.props.lupa.data
    if (sessionStorage.getItem('oid') !== jarjestajaOid) {
      return (
        <MessageWrapper><h3>{HAKEMUS_VIRHE.OIKEUS.FI}</h3></MessageWrapper>
      )
    }

    if (muutosperustelut.fetched && muutosperustelutOpiskelijavuodet.fetched && vankilat.fetched && ELYkeskukset.fetched && lupa.fetched && paatoskierrokset.fetched && muutospyynto.fetched) {
      return (
        <div>
          <WizardBackground />

          <WizardWrapper>
            <WizardTop>
              <Container padding="0 20px">
                <div>{HAKEMUS_OTSIKOT.UUSI_MUUTOSHAKEMUS.FI}</div>
                <CloseButton src={close} onClick={this.openCancelModal} />
              </Container>
            </WizardTop>

            <WizardHeader>
              <Container maxWidth="1085px" color={COLORS.BLACK}>
                <Phase number="1" text={HAKEMUS_OTSIKOT.MUUTOKSET.FI} activePage={page} handleClick={(number) => this.changePhase(number)} />
                <Phase number="2" text={HAKEMUS_OTSIKOT.PERUSTELUT.FI} activePage={page} disabled={visitedPages.indexOf(2) === -1} handleClick={(number) => this.changePhase(number)} />
                <Phase number="3" text={HAKEMUS_OTSIKOT.EDELLYTYKSET.FI} activePage={page} disabled={visitedPages.indexOf(3) === -1} handleClick={(number) => this.changePhase(number)} />
                <Phase number="4" text={HAKEMUS_OTSIKOT.YHTEENVETO.FI} activePage={page} disabled={visitedPages.indexOf(4) === -1} handleClick={(number) => this.changePhase(number)} />
              </Container>
            </WizardHeader>

            <ContentContainer maxWidth="1085px" margin="50px auto">
              <WizardContent>
                {page === 1 && (
                  <MuutospyyntoWizardMuutokset
                    previousPage={this.previousPage}
                    onSubmit={this.nextPage}
                    onCancel={this.onCancel}
                    save={this.save}
                    update={this.update}
                    lupa={lupa}
                    initialValues={initialValues}
                    fetchKoulutusalat={this.props.fetchKoulutusalat}
                    fetchKoulutustyypit={this.props.fetchKoulutustyypit}
                    fetchKoulutuksetAll={this.props.fetchKoulutuksetAll}
                    fetchKoulutuksetMuut={this.props.fetchKoulutuksetMuut}
                    fetchKoulutus={this.props.fetchKoulutus}
                  />
                )}
                {page === 2 && (
                  <MuutospyyntoWizardPerustelut
                    previousPage={this.previousPage}
                    onSubmit={this.nextPage}
                    onCancel={this.onCancel}
                    save={this.save}
                    muutosperustelut={this.props.muutosperustelut.data}
                    muutosperustelutOpiskelijavuodet={this.props.muutosperustelutOpiskelijavuodet.data}
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
                      initialValues={initialValues}
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

          <Modal
            isOpen={this.state.isCloseModalOpen}
            onAfterOpen={this.afterOpenCancelModal}
            onRequestClose={this.closeCancelModal}
            contentLabel={HAKEMUS_VIESTI.VARMISTUS_HEADER.FI}
            style={modalStyles}
          >
            <Content>
              <ModalText>{HAKEMUS_VIESTI.VARMISTUS.FI}</ModalText>
            </Content>
            <div>
              <ModalButton primary onClick={this.onCancel}>{HAKEMUS_VIESTI.KYLLA.FI}</ModalButton>
              <ModalButton onClick={this.closeCancelModal}>{HAKEMUS_VIESTI.EI.FI}</ModalButton>
            </div>
          </Modal>
          <Modal
            isOpen={this.state.isErrorModalOpen}
            onRequestClose={this.closeErrorlModal}
            style={modalStyles}
          >
            <Content>
              <ModalText>{HAKEMUS_VIESTI.TALLENNUS_ERROR.FI}</ModalText>
            </Content>
            <div>
              <ModalButton primary onClick={this.closeErrorModal}>{HAKEMUS_VIESTI.OK.FI}</ModalButton>
            </div>
          </Modal>
        </div>
      )
    } else if (muutosperustelut.isFetching || muutosperustelutOpiskelijavuodet.isFetching || vankilat.isFetching || ELYkeskukset.isFetching || lupa.isFetching || paatoskierrokset.isFetching || muutospyynto.isFetching) {
      return <Loading />
    } else if (muutosperustelut.hasErrored || muutosperustelutOpiskelijavuodet.hasErrored) {
      return <MessageWrapper><h3>{HAKEMUS_VIRHE.HEADER.FI}</h3>{HAKEMUS_VIRHE.PERUSTELU.FI}</MessageWrapper>
    } else if (vankilat.hasErrored) {
      return <MessageWrapper><h3>{HAKEMUS_VIRHE.HEADER.FI}</h3>{HAKEMUS_VIRHE.VANKILA.FI}</MessageWrapper>
    } else if (ELYkeskukset.hasErrored) {
      return <MessageWrapper><h3>{HAKEMUS_VIRHE.HEADER.FI}</h3>{HAKEMUS_VIRHE.ELY.FI}</MessageWrapper>
    } else if (paatoskierrokset.hasErrored) {
      return <MessageWrapper><h3>{HAKEMUS_VIRHE.HEADER.FI}</h3>{HAKEMUS_VIRHE.PAATOSKIERROS.FI}</MessageWrapper>
    } else if (muutospyynto.hasErrored) {
      return <MessageWrapper><h3>{HAKEMUS_VIRHE.HEADER.FI}</h3>{HAKEMUS_VIRHE.MUUTOSPYYNTO.FI}</MessageWrapper>
    } else if (lupa.hasErrored) {
      return <MessageWrapper><h3>{HAKEMUS_VIRHE.HEADER.FI}</h3>{HAKEMUS_VIRHE.LUVANLATAUS.FI}</MessageWrapper>
    } else {
      return null
    }

    
  }
}

MuutospyyntoEditWizard = reduxForm({
  form: FORM_NAME_UUSI_HAKEMUS,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize : true
})(MuutospyyntoEditWizard)

MuutospyyntoEditWizard = connect(state => {
  const { data } = state.muutospyynto

  let formVals = undefined
  if (state.form && state.form.uusiHakemus && state.form.uusiHakemus.values) {
    formVals = state.form.uusiHakemus.values
  }

  let init = loadFormData(state, data, formVals)
  return {
    formValues: formVals,
    initialValues: init
  }
})(MuutospyyntoEditWizard)

export default withRouter(MuutospyyntoEditWizard)
