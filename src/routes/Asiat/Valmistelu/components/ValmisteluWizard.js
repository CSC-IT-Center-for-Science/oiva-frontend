import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'

import ValmisteluWizardTiedot from './ValmisteluWizardTiedot'
import ValmisteluWizardMuutokset from './ValmisteluWizardMuutokset'

import Loading from '../../../../modules/Loading'

import { ContentContainer } from "../../../../modules/elements"
import {
  WizardBackground,
  WizardTop,
  WizardWrapper,
  ValmisteluHeader,
  WizardContent,
  Container
} from "./ValmisteluComponents"
import { COLORS } from "../../../../modules/styles"
import close from 'static/images/close-x.svg'
import { ROLE_ESITTELIJA } from "../../../../modules/constants";
import { modalStyles, ModalButton, ModalText, Content } from "./ModalComponents"
import { VALMISTELU_WIZARD_TEKSTIT } from "../../modules/constants"
import { loadValmisteluData } from "../modules/valmisteluUtils"
import { MUUT_KEYS } from "../../../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/constants"

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

const Phase = ({number, text, activePage, disabled, handleClick}) => {
  const isActive = Number(number) === Number(activePage)

  return (
    <PhaseStyle disabled={disabled} onClick={disabled ? null : () => handleClick(Number(number))}>
      <Circle active={isActive}>{number}</Circle>
      <Text active={isActive}>{text}</Text>
    </PhaseStyle>
  )
}

class ValmisteluWizard extends Component {
  constructor(props) {
    super(props)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.changePhase = this.changePhase.bind(this)
    this.preview = this.preview.bind(this)
    this.openCancelModal = this.openCancelModal.bind(this)
    this.afterOpenCancelModal = this.afterOpenCancelModal.bind(this)
    this.closeCancelModal = this.closeCancelModal.bind(this)
    this.state = {
      page: 2,
      visitedPages: [1, 2],
      isCloseModalOpen: false
    }
  }

  componentWillMount() {
    this.props.fetchMuutosperustelut()
    const {uuid} = this.props.match.params
    console.log('UUID: ' + uuid)
    this.props.fetchMuutospyynto(uuid).then(() => {
      console.log('muutospyynto: ' + JSON.stringify(this.props.muutospyynto.data))

      const {lupaUuid} = this.props.muutospyynto.data
      console.log('Lupa UUID: ' + lupaUuid)

      this.props.fetchLupa(lupaUuid, '?with=all')

    })
    this.props.fetchPaatoskierrokset()
    this.props.fetchKohteet()

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

  nextPage() {
    const next = this.state.page + 1
    let visited = this.state.visitedPages

    if (visited.indexOf(next) === -1) {
      visited.push(next)
      this.setState({page: next, visitedPages: visited})
    } else {
      this.setState({page: next})
    }
  }

  previousPage() {
    this.setState({page: this.state.page - 1})
  }

  onCancel(event) {
    if (event) {
      event.preventDefault()
    }
    const url = `/asiat`
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
    //this.props.savePaatos(data)
  }

  preview(event, data) {
    event.preventDefault()
    this.props.previewMuutospyynto(data).then(() => {

      var binaryData = [];
      binaryData.push(this.props.muutospyynto.pdf.data);
      const data = window.URL.createObjectURL(new Blob(binaryData, {type: "application/pdf"}))
      //const data =  window.URL.createObjectURL(response.data)
      var link = document.createElement('a');
      link.href = data;
      link.download = "file.pdf";
      link.click();
      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        return window.URL.revokeObjectURL(data), 100
      })

    })
  }

  changePhase(number) {
    this.setState({page: number})
  }

  openCancelModal(e) {
    e.preventDefault()
    this.setState({isCloseModalOpen: true})
  }

  afterOpenCancelModal() {
  }

  closeCancelModal() {
    this.setState({isCloseModalOpen: false})
  }

  render() {
    const {muutosperustelut, lupa, paatoskierrokset} = this.props
    const {page, visitedPages} = this.state

    // check the rights - TODO
    /*
    let authenticated = false;
    if(sessionStorage.getItem('role')===ROLE_ESITTELIJA) {
        authenticated = true;
    }
    */

    // Sallittu vain esittelijöille
    if (sessionStorage.getItem('role') !== ROLE_ESITTELIJA) {
      return (
        <h2>Käsittely vaatii kirjautumisen.</h2>
      )
    }

    if (muutosperustelut.fetched && lupa.fetched && paatoskierrokset.fetched) {

      const {diaarinumero} = this.props.lupa.data
      let url = `/api/pdf/${diaarinumero}`

      return (
        <div>
          <WizardBackground/>

          <WizardWrapper>
            <WizardTop>
              <Container padding="0 20px">
                <div>{VALMISTELU_WIZARD_TEKSTIT.OTSIKOT.PAATOKSEN_VALMISTELU.FI}</div>
                <CloseButton src={close} onClick={this.openCancelModal}/>
              </Container>
            </WizardTop>
            <ValmisteluHeader>
              <Container maxWidth="1085px" color={COLORS.BLACK}>
                <Phase number="1" text="Päätöksen tiedot" activePage={page}
                       handleClick={(number) => this.changePhase(number)}/>
                <Phase number="2" text="Muutokset ja perustelut" activePage={page}
                       disabled={visitedPages.indexOf(2) === -1} handleClick={(number) => this.changePhase(number)}/>
                <a href={url}>Voimassaoleva lupa</a>
                <Link to="/asiat/valmistelu/esikatselu">Esikatselu</Link>
              </Container>
            </ValmisteluHeader>

            <ContentContainer maxWidth="1085px" margin="50px auto">
              <WizardContent>
                {page === 1 && (
                  <ValmisteluWizardTiedot
                    previousPage={this.previousPage}
                    onSubmit={this.nextPage}
                    onCancel={this.onCancel}
                    lupa={lupa}
                    save={this.save}

                  />
                )}
                {page === 2 && (
                  <ValmisteluWizardMuutokset
                    previousPage={this.previousPage}
                    onSubmit={this.nextPage}
                    onCancel={this.onCancel}
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
            contentLabel="Poistu päätöksen teosta"
            style={modalStyles}
          >
            <Content>
              <ModalText>Oletko varma, että haluat poistua asian valmistelusta? Tekemiäsi muutoksia ei
                tallenneta.</ModalText>
            </Content>
            <div>
              <ModalButton primary onClick={this.onCancel}>Kyllä</ModalButton>
              <ModalButton onClick={this.closeCancelModal}>Ei</ModalButton>
            </div>
          </Modal>
        </div>
      )
    } else if (muutosperustelut.isFetching || lupa.isFetching || paatoskierrokset.isFetching) {
      return <Loading/>
    } else if (muutosperustelut.hasErrored) {
      return <div>Muutospyyntöä ei voida tehdä. Muutosperusteluita ladattaessa tapahtui virhe.</div>
    } else if (paatoskierrokset.hasErrored) {
      return <div>Muutospyyntöä ei voida tehdä. Päätoskierroksia ladattaessa tapahtui virhe.</div>
    } else if (lupa.hasErrored) {
      return <div>Muutospyyntöä ei voida tehdä. Lupaa haettaessa tapahtui virhe.</div>
    } else {
      return null
    }
  }
}

ValmisteluWizard = reduxForm({
  form: 'uusiPaatos',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  enableReinitialize: true
})(ValmisteluWizard)

ValmisteluWizard = connect(state => {
  const { data } = state.muutospyynto

  console.log(data)

  return {
    initialValues: loadValmisteluData(state, data)
  }
})(ValmisteluWizard)

export default withRouter(ValmisteluWizard)
