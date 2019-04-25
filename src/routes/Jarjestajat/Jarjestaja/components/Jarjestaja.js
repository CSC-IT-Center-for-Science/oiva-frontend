import React, { Component } from 'react'
import styled from 'styled-components'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import { Route } from 'react-router-dom'

import JarjestajaBasicInfo from './JarjestajaBasicInfo'
import ProfileMenu from './ProfileMenu'
import JulkisetTiedot from './JulkisetTiedot'
import OmatTiedot from './OmatTiedot'
import JarjestamislupaAsiat from './Jarjestamislupa-asiat'
import JarjestamislupaContainer from '../containers/JarjestamislupaContainer'
import HakemuksetJaPaatoksetContainer from "../Hakemukset/containers/HakemuksetJaPaatoksetContainer"
import Loading from '../../../../modules/Loading'
import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants"
// import MuutospyyntoContainer from "../Hakemukset/Muutospyynto/containers/MuutospyyntoContainer"
// import MuutospyyntoWizard from '../Hakemukset/Muutospyynto/components/MuutospyyntoWizard'

import { COLORS } from "../../../../modules/styles"
import { ContentContainer, FullWidthWrapper, ContentWrapper } from '../../../../modules/elements'
import {ROLE_KAYTTAJA} from "../../../../modules/constants";

const Separator = styled.div`
  &:after {
    display: block;
    content: '';
    width: 100%;
    height: 1px;
    background-color: ${COLORS.BORDER_GRAY};
    margin: 30px 0;
  }
`

class Jarjestaja extends Component {
  componentWillMount() {
    const { ytunnus } = this.props.match.params
    this.props.fetchLupa(ytunnus, '?with=all')
    this.props.fetchMuutospyynnot(ytunnus)
  }

  render() {
    const { match, lupa, muutospyynnot } = this.props

    if (match.params) {

      if (lupa.fetched && muutospyynnot.fetched) {
        const lupadata = this.props.lupa.data
        const { jarjestaja } = lupadata
        const breadcrumb = `/jarjestajat/${match.params.id}`
        const jarjestajaNimi = jarjestaja.nimi.fi || jarjestaja.nimi.sv || ''

        // check the rights
        // TODO: organisaation oid pitää tarkastaa jotain muuta kautta kuin voimassaolevasta luvasta
        let authenticated = false;
        if(sessionStorage.getItem('role')===ROLE_KAYTTAJA && sessionStorage.getItem('oid')===jarjestaja.oid) {
            authenticated = true;
        }

        // Alanavigaation tabivalikon routet
        var tabNavRoutes = [];

        if (authenticated)
          tabNavRoutes = [
            {
              path: `${match.url}/omattiedot`,
              exact: true,
              text: LUPA_TEKSTIT.OMATTIEDOT.OTSIKKO.FI,
              authenticated: authenticated
            },
            {
              path: `${match.url}/jarjestamislupa`,
              exact: true,
              text: LUPA_TEKSTIT.LUPA.OTSIKKO_LYHYT.FI,
              authenticated: true
            },
            {
              path: `${match.url}`,
              exact: true,
              text: LUPA_TEKSTIT.PAATOKSET.OTSIKKO.FI,
              authenticated: true
            },
            {
              path: `${match.url}/jarjestamislupa-asia`,
              text: LUPA_TEKSTIT.ASIAT.OTSIKKO_LYHYT.FI,
              authenticated: authenticated
            },
            {
              path: `${match.url}/hakemukset-ja-paatokset/uusi`,
              text: LUPA_TEKSTIT.MUUT.UUSI_HAKEMUS_OTSIKKO.FI,
              authenticated: authenticated
            }
          ]
          else
            tabNavRoutes = [
              {
                path: `${match.url}/jarjestamislupa`,
                text: LUPA_TEKSTIT.LUPA.OTSIKKO_LYHYT.FI,
                authenticated: true
              },
              {
                path: `${match.url}`,
                exact: true,
                text: LUPA_TEKSTIT.PAATOKSET.OTSIKKO.FI,
                authenticated: true
              }
            ]


        return (
          <ContentWrapper>
            <ContentContainer>
              <BreadcrumbsItem to='/'>Etusivu</BreadcrumbsItem>
              <BreadcrumbsItem to='/jarjestajat'>Ammatillinen koulutus</BreadcrumbsItem>
              <BreadcrumbsItem to={breadcrumb}>{jarjestajaNimi}</BreadcrumbsItem>

              <JarjestajaBasicInfo jarjestaja={jarjestaja} />

              <Separator />

              <ProfileMenu routes={tabNavRoutes} />
            </ContentContainer>

            <FullWidthWrapper backgroundColor={COLORS.BG_GRAY}>
              { authenticated ? 
                <ContentContainer padding={'40px 15px 80px'} margin={'28px auto 0'}>
                  <Route path={`${match.path}/omattiedot`} exact render={(props) =>  <OmatTiedot {...props} />} />              
                  <Route path={`${match.url}/jarjestamislupa`} exact render={() => <JarjestamislupaContainer ytunnus={match.params.ytunnus} /> } />
                  <Route path={`${match.url}`} exact render={() => <JulkisetTiedot lupadata={lupadata} />} />
                  <Route path={`${match.url}/jarjestamislupa-asia`} exact render={() => <JarjestamislupaAsiat lupadata={lupadata} /> } />
                  <Route path={`${match.path}/hakemukset-ja-paatokset`} exact render={(props) =>  <HakemuksetJaPaatoksetContainer {...props} />} />
                </ContentContainer>
               :
                <ContentContainer padding={'40px 15px 80px'} margin={'28px auto 0'}>
                  <Route path={`${match.url}/jarjestamislupa`}  render={() => <JarjestamislupaContainer ytunnus={match.params.ytunnus} /> } />
                  <Route path={`${match.url}`} exact render={() => <JulkisetTiedot lupadata={lupadata} />} />
                </ContentContainer>
              }
            </FullWidthWrapper>
          </ContentWrapper>
        )
      } else if (lupa.isFetching || muutospyynnot.isFetching) {
        return <Loading />
      } else if (lupa.hasErrored) {
        return <h2>Luvan lataamisessa tapahtui virhe</h2>
      } else {
        return null
      }
    } else {
      return null
    }
  }
}

export default Jarjestaja
