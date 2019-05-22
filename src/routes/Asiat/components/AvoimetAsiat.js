import React, { Component } from 'react'
import styled from 'styled-components'
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic'
import AvoimetAsiatList from './AvoimetAsiatList'
import { InnerContentContainer, InnerContentWrapper  } from "../../../modules/elements"
import { COLORS } from "../../../modules/styles"
import { ContentContainer, FullWidthWrapper } from '../../../modules/elements'
import { ROLE_ESITTELIJA } from '../../../modules/constants'
import { ASIAT } from "../modules/constants"


const Wrapper = styled.div`
  position: relative;
`

class AvoimetAsiat extends Component {

    componentWillMount() {
        this.props.fetchAvoimetAsiat()
    }

    render() {

        const { isFetching, fetched, hasErrored, data } = this.props.muutospyynnot

        // Sallittu vain esittelijöille
        if(sessionStorage.getItem('role')!==ROLE_ESITTELIJA) {
            return (
                <h2>{ASIAT.OTSIKOT.KIRJAUTUMISVIRHE.FI}</h2>
            )
        }

        if (fetched) {
            return (
                <FullWidthWrapper backgroundColor={COLORS.BG_GRAY}>
                    <ContentContainer padding={'40px 15px 80px'} margin={'28px auto 0'}>

                        <BreadcrumbsItem to='/'>{ASIAT.BREADCRUMBS.ETUSIVU.FI}</BreadcrumbsItem>
                        <BreadcrumbsItem to='/asiat'>{ASIAT.BREADCRUMBS.ASIAT.FI}</BreadcrumbsItem>

                        <InnerContentContainer>
                            <InnerContentWrapper>
                                <Wrapper>
                                    <h2>{ASIAT.OTSIKOT.AVOINNA_OLEVAT.FI}</h2>
                                    <AvoimetAsiatList muutospyynnot={data}/>
                                </Wrapper>
                            </InnerContentWrapper>
                        </InnerContentContainer>

                    </ContentContainer>
                </FullWidthWrapper>
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

export default AvoimetAsiat
