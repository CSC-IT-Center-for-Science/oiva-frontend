import React, { Component } from 'react'
import styled from 'styled-components'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import ValmistelussaAsiatList from "./ValmistelussaAsiatList";

import { InnerContentContainer, InnerContentWrapper  } from "../../../modules/elements"
import { COLORS, BackgroundImage } from "../../../modules/styles"
import { ContentContainer, FullWidthWrapper, ContentWrapper } from '../../../modules/elements'
import { ROLE_ESITTELIJA } from '../../../modules/constants'
import AsiatMenu from './AsiatMenu'
import { Helmet } from 'react-helmet'
import { ASIAT } from "../modules/constants"


const Wrapper = styled.div`
  position: relative;
`

class ValmistelussaAsiat extends Component {

    componentWillMount() {
        this.props.fetchValmistelussaAsiat()
    }

    render() {
        const { match } = this.props
        const { isFetching, fetched, hasErrored, data } = this.props.muutospyynnot

        // check the rights
        let authenticated = false;
        if(sessionStorage.getItem('role')===ROLE_ESITTELIJA) {
            authenticated = true;
        }

        // Sallittu vain esittelijöille
        if(!authenticated) {
            return (
                <h2>{ASIAT.OTSIKOT.KIRJAUTUMISVIRHE.FI}</h2>
            )
        }

        // Alanavigaation tabivalikon routet
        const tabNavRoutes = [
            {
                path: `/asiat`,
                exact: true,
                text: {'fi':'Avoinna olevat asiat','sv':'Avoinna olevat asiat på svenska'},
                authenticated: true
            },
            {
                path: `${match.url}`,
                text: {'fi':'Valmistelussa olevat asiat','sv':'Valmistelussa olevat asiat på svenska'},
                authenticated: authenticated
            },
            {
                path: `paatetyt-asiat`,
                text: {'fi':'Päätetyt asiat','sv':'Päätetyt asiat på svenska'},
                authenticated: authenticated
            }
        ]

        if (fetched) {
            return (
                <ContentWrapper>
                    <ContentContainer padding={'20px auto 0px auto'} margin={'38px auto 0px auto'}>
                        <Helmet>
                            <title>Oiva | Asiat</title>
                        </Helmet>
                        <BackgroundImage />
                        <BreadcrumbsItem to='/'>{ASIAT.BREADCRUMBS.ETUSIVU.FI}</BreadcrumbsItem>
                        <BreadcrumbsItem to='/asiat'>{ASIAT.BREADCRUMBS.ASIAT.FI}</BreadcrumbsItem>
                        <AsiatMenu routes={tabNavRoutes} />
                    </ContentContainer>

                    <FullWidthWrapper backgroundColor={COLORS.BG_GRAY}>
                        <ContentContainer padding={'40px 15px 80px'} margin={'28px auto 0'}>
                            <InnerContentContainer>
                                <InnerContentWrapper>
                                    <Wrapper>
                                        <h2>{ASIAT.OTSIKOT.VALMISTELUSSA_OLEVAT.FI}</h2>
                                        <ValmistelussaAsiatList muutospyynnot={data}/>
                                    </Wrapper>
                                </InnerContentWrapper>
                            </InnerContentContainer>
                        </ContentContainer>
                    </FullWidthWrapper>
                </ContentWrapper>
            )
        } else if (isFetching) {
            return (
                <h2>{ASIAT.SIVUTUS.LADATAAN.FI}</h2>
            )
        } else if (hasErrored) {
            return (
                <h2>{ASIAT.OTSIKOT.LATAUS_VIRHE_PAATETYT.FI}</h2>
            )
        } else {
            return (
                <h2>{ASIAT.OTSIKOT.HAKU_VIRHE_PAATETYT.FI}</h2>
            )
        }


    }
}

export default ValmistelussaAsiat
