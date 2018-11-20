import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import { withRouter, Link } from 'react-router-dom'

import Koulutusala from './Koulutusala'
import MuuMaarays from './MuuMaarays'

import { KOHTEET } from '../modules/constants'
import { COLORS, FONT_STACK } from "../../../../modules/styles"
import { TUTKINTO_TEKSTIT, LUPA_TEKSTIT } from "../modules/constants"
import Tutkintokieli from "./Tutkintokieli";


const SectionWrapper = styled.div`
  margin-left: 30px;
  position: relative;
  border-bottom: 1px solid ${COLORS.BORDER_GRAY};
  padding: 0 0 26px;
  
  &:last-child {
    border-bottom: none;
  }
`

const Otsikko = styled.div`
  font-size: 16px;
`

const Kohde1 = styled.span`
  font-size: 20px;
  position: absolute;
  left: -30px;
  margin-top:19px;
`

const Span = styled.span`
  font-size: 20px;
  position: absolute;
  left: -30px;
`

const H3 = styled.h3`
  text-transform: uppercase;
  font-size: 20px;
`

const Capitalized = styled.p`
  text-transform: capitalize;
  margin-left: 30px;
`

const Bold = styled.span`
  font-family: ${FONT_STACK.GOTHAM_NARROW_BOLD};
`

const Tietoa = styled.div`
  font-size: 15px;
  margin-bottom: 30px;
  margin-left:20px;
`

const Tutkinnot = styled.div`
  margin-bottom: 30px;
`

const MuutMaaraykset = styled.div`
  margin-bottom: 30px;
`

const OpiskelijavuosiRajoitukset = styled.div`
  margin-left: 30px;
  margin-top: 20px;
`

const KohdeKuvaus = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`

class LupaSection extends Component {



  render() {
    const { kohde, diaarinumero, ytunnus } = this.props

    // const { isRemoving } = this.state

    if (kohde) {
      const { tunniste, heading, headingNumber } = kohde

      // Logiikka eri kohteille
      switch (tunniste) {

        // Kohde 1: Tutkinnot
        case KOHTEET.TUTKINNOT: {
          const { maaraykset, muutMaaraykset } = kohde


          return (
            <SectionWrapper>

              <Otsikko>{TUTKINTO_TEKSTIT.otsikkoKaikkiLuvat.FI}</Otsikko>

              <Kohde1>{`${headingNumber}.`}</Kohde1>
              <H3>{heading}</H3>
              <div>
                <Tutkinnot>
                  {_.map(maaraykset, (ala, i) => <Koulutusala key={i} {...ala} />)}
                </Tutkinnot>
                <Tietoa>
                    {TUTKINTO_TEKSTIT.otsikkoTaydentava.FI}
                </Tietoa>
                <MuutMaaraykset>
                  {_.map(muutMaaraykset, (poikkeus, i) => <MuuMaarays key={i} {...poikkeus} />)}
                </MuutMaaraykset>
              </div>
            </SectionWrapper>
          )
        }

        // Kohde 2: Opetuskieli
        case KOHTEET.KIELI: {
          const { kohdeKuvaus, kohdeArvot, tutkinnotjakieletEn, tutkinnotjakieletSv, tutkinnotjakieletFi, tutkinnotjakieletRu } = kohde

            return (
            <SectionWrapper>
              <Span>{`${headingNumber}.`}</Span><H3>{heading}</H3>
              <p>{kohdeKuvaus}</p>
              {_.map(kohdeArvot, (arvo, i) => <Capitalized key={i}>{_.capitalize(arvo.label)}</Capitalized>)}
              <div>
                <Tutkinnot>
                    {(tutkinnotjakieletEn.length > 1) ? LUPA_TEKSTIT.KIELI.LISA_ENGLANTI_MONIKKO.FI : null }
                    {(tutkinnotjakieletEn.length === 1) ? LUPA_TEKSTIT.KIELI.LISA_ENGLANTI_YKSIKKO.FI : null }
                    {_.map(tutkinnotjakieletEn, (obj, i) => <Tutkintokieli key={i} {...obj} />)}

                    {(tutkinnotjakieletSv.length > 1) ? LUPA_TEKSTIT.KIELI.LISA_RUOTSI_MONIKKO.FI : null }
                    {(tutkinnotjakieletSv.length === 1) ? LUPA_TEKSTIT.KIELI.LISA_RUOTSI_YKSIKKO.FI : null }
                    {_.map(tutkinnotjakieletSv, (obj, i) => <Tutkintokieli key={i} {...obj} />)}

                    {(tutkinnotjakieletFi.length > 1) ? LUPA_TEKSTIT.KIELI.LISA_SUOMI_MONIKKO.FI : null }
                    {(tutkinnotjakieletFi.length === 1) ? LUPA_TEKSTIT.KIELI.LISA_SUOMI_YKSIKKO.FI : null }
                    {_.map(tutkinnotjakieletFi, (obj, i) => <Tutkintokieli key={i} {...obj} />)}

                    {(tutkinnotjakieletRu.length > 1) ? LUPA_TEKSTIT.KIELI.LISA_VENAJA_MONIKKO.FI : null }
                    {(tutkinnotjakieletRu.length === 1) ? LUPA_TEKSTIT.KIELI.LISA_VENAJA_YKSIKKO.FI : null }
                    {_.map(tutkinnotjakieletRu, (obj, i) => <Tutkintokieli key={i} {...obj} />)}
                </Tutkinnot>
              </div>

            </SectionWrapper>
          )
        }

        // Kohde 3: Toiminta-alueet
        case KOHTEET.TOIMIALUE: {
          const { kohdeKuvaus, maakunnat, kunnat } = kohde

          return (
            <SectionWrapper>
              <Span>{`${headingNumber}.`}</Span><H3>{heading}</H3>
              <p>{kohdeKuvaus}</p>
              {_.map(maakunnat, (maakunta, i) => <Capitalized key={i}>{maakunta.arvo}</Capitalized>)}
              {_.map(kunnat, (kunta, i) => <Capitalized key={i}>{kunta.arvo}</Capitalized>)}
            </SectionWrapper>
          )
        }

        // Kohde 4: Opiskelijavuodet
        case KOHTEET.OPISKELIJAVUODET: {
          const { opiskelijavuodet, rajoitukset, kohdeKuvaus, eiMaaraysta } = kohde
          return (
            <SectionWrapper>
              <Span>{`${headingNumber}.`}</Span><H3>{heading}</H3>
              {_.map(opiskelijavuodet, (obj, i) => {
                const { arvo } = obj
                return <span key={i}>{LUPA_TEKSTIT.OPISKELIJAVUODET.VAHIMMAISMAARA.FI}&nbsp;{arvo}</span>
              })}
              <KohdeKuvaus>{(ytunnus === '0244767-4') ? LUPA_TEKSTIT.OPISKELIJAVUODET.VALTIO.FI : kohdeKuvaus}</KohdeKuvaus>
              {_.map(rajoitukset, (obj, i) => {
                const { tyyppi, arvo } = obj
                return <OpiskelijavuosiRajoitukset key={i}>{tyyppi}&nbsp;{LUPA_TEKSTIT.OPISKELIJAVUODET.ENINTAAN.FI} {arvo} {LUPA_TEKSTIT.OPISKELIJAVUODET.OPISKELIJAVUOTTA.FI}</OpiskelijavuosiRajoitukset>
              })}
            </SectionWrapper>
          )
        }

        // Kohde 5: Muut määräykset
        case KOHTEET.MUUT: {
          const { muut, vaativat, vankilat, kokeilut } = kohde

          return (
            <SectionWrapper>
              <Span>{`${headingNumber}.`}</Span><H3>{heading}</H3>
              {_.map(muut, (muu, i) => {
                const { tyyppi, kuvaus } = muu
                return (
                  <div key={i}>
                    <h4><Bold>{tyyppi}</Bold></h4>
                    <p>{kuvaus}</p>
                  </div>
                )
              })}

              {(vaativat.length > 0) ? <h4><Bold>{vaativat[0].tyyppi}</Bold></h4> : null}
              {_.map(vaativat, (vaativa, i) => {
                    const { kuvaus } = vaativa
                    return (
                        <div key={i}>
                          <p>{kuvaus}</p>
                        </div>
                    )
              })}
              {(kokeilut.length > 0) ? <h4><Bold>{kokeilut[0].tyyppi}</Bold></h4> : null}
                {_.map(kokeilut, (kokeilu, i) => {
                    const { kuvaus } = kokeilu
                    return (
                        <div key={i}>
                          <p>{kuvaus}</p>
                        </div>
                    )
                })}
              {(vankilat.length > 0) ? <h4><Bold>{vankilat[0].tyyppi}</Bold></h4> : null}
                {_.map(vankilat, (vankila, i) => {
                    const { kuvaus } = vankila
                    return (
                        <div key={i}>
                          <p>{kuvaus}</p>
                        </div>
                    )
                })}

                {(kokeilut.length === 0 && vankilat.length === 0 && vaativat.length === 0 && muut.length === 0)
                    ? <p>{LUPA_TEKSTIT.MUUT.EI_MAARAYKSIA.FI}</p> : null}

            </SectionWrapper>
          )
        }

        default: {
          return (
            <SectionWrapper>
              <Span>{`${headingNumber}.`}</Span><H3>{heading}</H3>
            </SectionWrapper>
          )
        }
      }

    } else {
      return <SectionWrapper><H3>Ei kohdetietoja</H3></SectionWrapper>
    }


  }
}

export default withRouter(LupaSection)
