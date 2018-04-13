import React, { Component } from 'react'
import styled from 'styled-components'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import { Route } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import AvoimetAsiatContainer from '../containers/AvoimetAsiatContainer'
import ValmistelussaAsiatContainer from '../containers/ValmistelussaAsiatContainer'
import PaatetytAsiatContainer from '../containers/PaatetytAsiatContainer'
import AsiatMenu from './AsiatMenu'

import { COLORS, BackgroundImage } from "../../../modules/styles"
import { ContentContainer, FullWidthWrapper } from '../../../modules/elements'
import {ROLE_ESITTELIJA} from "../../../modules/constants";


class Asiat extends Component {
    componentWillMount() {
        this.props.fetchMuutospyynnotForEsittelija("oiva-sanni")
    }

    render() {
        const { match, muutospyynnot } = this.props


        if (match.params) {

            const breadcrumb = `/asiat/${match.params.id}`

            // check the rights
            let authenticated = false;
            if(sessionStorage.getItem('role')===ROLE_ESITTELIJA) {
                authenticated = true;
            }

            // Alanavigaation tabivalikon routet
            const tabNavRoutes = [
                {
                    path: `${match.url}`,
                    exact: true,
                    text: {'fi':'Avoinna olevat asiat','sv':'Avoinna olevat asiat på svenska'},
                    authenticated: true
                },
                {
                    path: `${match.url}/valmistelussa-olevat-asiat`,
                    text: {'fi':'Valmistelussa olevat asiat','sv':'Valmistelussa olevat asiat på svenska'},
                    authenticated: authenticated
                },
                {
                    path: `${match.url}/paatetyt-asiat`,
                    text: {'fi':'Päätetyt asiat','sv':'Päätetyt asiat på svenska'},
                    authenticated: authenticated
                }
            ]


            return (
                <div>
                    <ContentContainer padding={'20px auto 0px auto'} margin={'38px auto 0px auto'}>
                        <Helmet>
                            <title>Oiva | Asiat</title>
                        </Helmet>
                        <BackgroundImage />
                        <BreadcrumbsItem to='/'>Etusivu</BreadcrumbsItem>
                        <BreadcrumbsItem to='/asiat'>Asiat</BreadcrumbsItem>
                        <AsiatMenu routes={tabNavRoutes} />
                    </ContentContainer>

                    <FullWidthWrapper backgroundColor={COLORS.BG_GRAY}>
                        <ContentContainer padding={'10px 0px 40px'} margin={'0px auto 0'}>

                            {(authenticated) ? (<Route path={`${match.url}`} exact render={() => <AvoimetAsiatContainer />} />) : null }
                            {(authenticated) ? (<Route path={`${match.url}/valmistelussa-olevat-asiat`}  render={() => <ValmistelussaAsiatContainer />} />) : null }
                            {(authenticated) ? (<Route path={`${match.url}/paatetyt-asiat`} render={() => <PaatetytAsiatContainer />} />) : null }

                        </ContentContainer>
                    </FullWidthWrapper>
                </div>
            )
        } else {
            return null
        }
    }
}

export default Asiat
