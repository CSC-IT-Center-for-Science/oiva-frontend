import React, { Component } from 'react'
import styled from 'styled-components'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import { Route } from 'react-router-dom'

import JarjestajaBasicInfo from './JarjestajaBasicInfo'
import ProfileMenu from './ProfileMenu'
import JulkisetTiedot from './JulkisetTiedot'
import JarjestamislupaContainer from '../containers/JarjestamislupaContainer'
import HakemuksetJaPaatoksetContainer from "../Hakemukset/containers/HakemuksetJaPaatoksetContainer"
import Loading from '../../../../modules/Loading'
// import MuutospyyntoContainer from "../Hakemukset/Muutospyynto/containers/MuutospyyntoContainer"
// import MuutospyyntoWizard from '../Hakemukset/Muutospyynto/components/MuutospyyntoWizard'

import { COLORS } from "../../../../modules/styles"
import { ContentContainer, FullWidthWrapper } from '../../../../modules/elements'
import {ROLE_KAYTTAJA} from "../../../../modules/constants";
import _ from 'lodash'


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
        const tabNavRoutes = [
            {
                path: `${match.url}/jarjestamislupa`,
                text: 'Järjestämislupa',
                authenticated: true
            },
            {
                path: `${match.url}`,
                exact: true,
                text: 'Päätöshistoria',
                authenticated: true
            },
            {
                path: `${match.url}/hakemukset-ja-paatokset`,
                text: 'Hakemukset',
                authenticated: authenticated
            },
            {
                path: `${match.url}/hakemukset-ja-paatokset/uusi`,
                text: 'Uusi hakemus',
                authenticated: authenticated
            }
        ]


        return (
          <div>
            <ContentContainer>
              <BreadcrumbsItem to='/'>Etusivu</BreadcrumbsItem>
              <BreadcrumbsItem to='/jarjestajat'>Ammatillinen koulutus</BreadcrumbsItem>
              <BreadcrumbsItem to={breadcrumb}>{jarjestajaNimi}</BreadcrumbsItem>

              <JarjestajaBasicInfo jarjestaja={jarjestaja} />

              <Separator />

              <ProfileMenu routes={tabNavRoutes} />
            </ContentContainer>

            <FullWidthWrapper backgroundColor={COLORS.BG_GRAY}>
              <ContentContainer padding={'40px 15px 80px'} margin={'28px auto 0'}>
                <Route path={`${match.url}/jarjestamislupa`}  render={() => <JarjestamislupaContainer ytunnus={match.params.ytunnus} /> } />
                <Route path={`${match.url}`} exact render={() => <JulkisetTiedot lupadata={lupadata} />} />
                {(authenticated) ? (<Route path={`${match.path}/hakemukset-ja-paatokset`} exact render={(props) =>  <HakemuksetJaPaatoksetContainer {...props} />} />) : null }
              </ContentContainer>
            </FullWidthWrapper>
          </div>
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
