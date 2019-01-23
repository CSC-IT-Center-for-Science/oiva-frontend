import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import Moment from 'react-moment'
import { withRouter } from 'react-router-dom'
// import dateFormat from 'dateformat'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'

import TutkinnotMuutosContainer from '../containers/TutkinnotMuutosContainer'

import { InnerContentContainer, InnerContentWrapper, ContentContainer, FullWidthWrapper } from "../../../../../../modules/elements"
// import Button from '../../../../../../modules/Button'
import { COLORS } from "../../../../../../modules/styles"

import pdfIcon from 'static/images/icon-pdf-small.png'
import { API_BASE_URL } from "../../../../../../modules/constants"
import {ROLE_KAYTTAJA} from "../../../../../../modules/constants";

const TopSectionWrapper = styled.div`
  margin: -30px -28px;
  padding: 15px 60px 30px;
  border-bottom: 1px solid ${COLORS.BORDER_GRAY};
  position: relative;
`

const MuutosDetailsWrapper = styled.div`
  margin: 45px auto;
`

const Row = styled.div`
  display: flex;
  align-items: flex-end;
  margin: 8px 0;
  
  a {
    display: flex;
    align-items: flex-end;
  }
`

class Muutospyynto extends Component {
  constructor(props) {
    super(props)
    this.goBack = this.props.history.goBack.bind(this)
  }
  componentWillMount() {
    const { muutospyynnot } = this.props

    const { ytunnus } = this.props.match.params
    this.props.fetchLupa(ytunnus, '?with=all')

    if (muutospyynnot && muutospyynnot.fetched === false) {
      const { jarjestajaYtunnus } = this.props.lupa.data
      this.props.fetchMuutospyynnot(jarjestajaYtunnus)
    }
  }

  checkByDiaarinumero(diaarinumero) {
    return _.find(this.props.muutospyynnot.data, muutospyynto => {
      return muutospyynto.diaarinumero === diaarinumero
    })
  }

  handleOkClick() {
    this.props.createMuutospyynto(this.getMuutospyyntoBody())
  }

  handleCancelClick() {
    this.goBack()
  }

  getMuutospyyntoBody() {
    // const now = dateFormat(new Date(), "yyyy-mm-dd")
    const { jarjestajaYtunnus, id } = this.props.lupa.data

    return {
      jarjestajaYtunnus,
      lupaId: id,
      paatoskierrosId: 19, // TODO: muutetaan myöhemmin
      muutosperustelukoodiarvo: 1, // TODO: muutetaan myöhemmin
      tila: "LUONNOS",
      UUID: ""
    }
  }

  render() {
    // TODO: Tehdään stateen luvan sijasta muutospyynto, johon haetaan luvan tiedot getByDiaarinumero
    // Diaarimumero match:sta
    const { lupa } = this.props

    if(sessionStorage.getItem('role')!==ROLE_KAYTTAJA) {
        return (
            <h2>Uuden hakemuksen tekeminen vaatii kirjautumisen palveluun.</h2>
        )
    }

    if (lupa.hasErrored) {
      return (
        <div>Error</div>
      )
    } else if (lupa.isFetching) {
      return (
        <div>Ladataan . . .</div>
      )
    } else if (lupa.fetched) {
      const { diaarinumero } = this.props.match.params
      const { alkupvm, paatospvm, meta, jarjestajaYtunnus, jarjestaja } = this.props.lupa.data
      const { kohteet } = this.props.lupa
      const { esittelija } = meta
      const jarjestajaNimi = jarjestaja.nimi.fi || jarjestaja.nimi.sv || ''
      // const jarjestajaBreadcrumb = `/jarjestajat/${this.props.match.params.ytunnus}`
      // const muutoksetBreadcrumb = `/jarjestajat/${this.props.match.params.ytunnus}/hakemukset-ja-paatokset`

      if (this.checkByDiaarinumero(diaarinumero) !== undefined) {

      }

      return (
        <FullWidthWrapper backgroundColor={COLORS.BG_GRAY}>
          <ContentContainer padding="60px 15px">
            <BreadcrumbsItem to='/'>Etusivu</BreadcrumbsItem>
            <BreadcrumbsItem to='/jarjestajat'>Koulutuksen järjestäjät</BreadcrumbsItem>
            <BreadcrumbsItem to={`/jarjestajat/${this.props.match.params.ytunnus}`}>{jarjestajaNimi}</BreadcrumbsItem>
            <BreadcrumbsItem to={`/jarjestajat/${this.props.match.params.ytunnus}/hakemukset-ja-paatokset`}>Hakemukset ja päätökset</BreadcrumbsItem>
            <BreadcrumbsItem to={`/jarjestajat/${this.props.match.params.ytunnus}/hakemukset-ja-paatokset/muutos`}>Muutospyyntö</BreadcrumbsItem>

            <InnerContentContainer>
              <InnerContentWrapper>
                <TopSectionWrapper>
                  <h2>Muutospyyntö</h2>
                  <Row>Diaarinumero:&nbsp;{diaarinumero}</Row>
                  <Row>Päätös:&nbsp;<a href={`${API_BASE_URL}/pdf/${diaarinumero}`} target="_blank"><img src={pdfIcon} alt="Järjestämislupa PDF-muodossa"/><Moment format="MM.DD.YYYY">{paatospvm}</Moment></a></Row>
                  <Row>Voimassaolo:&nbsp;<Moment format="MM.DD.YYYY">{alkupvm}</Moment>&nbsp;alkaen</Row>
                  <Row>Esittelijä:&nbsp;{esittelija ? esittelija :  '-'}</Row>
                </TopSectionWrapper>

                <MuutosDetailsWrapper>
                  <TutkinnotMuutosContainer
                    kohde={kohteet[1]}
                    diaarinumero={diaarinumero}
                    ytunnus={jarjestajaYtunnus}
                  />
                  {/*{Object.keys(LUPA_SECTIONS).map((k, i) => <LupaSectionContainer kohde={kohteet[k]} diaarinumero={diaarinumero} ytunnus={jarjestajaYtunnus} showControls={true} key={i} />)}*/}
                </MuutosDetailsWrapper>
              </InnerContentWrapper>
            </InnerContentContainer>
          </ContentContainer>
        </FullWidthWrapper>
      )
    } else {
      return null
    }
  }
}

export default withRouter(Muutospyynto)
