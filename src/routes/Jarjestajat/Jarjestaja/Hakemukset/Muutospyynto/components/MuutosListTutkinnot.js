import React, { Component } from 'react'
import styled from 'styled-components'
import _ from 'lodash'

import Muutos from './Muutos'
import MuutosYhteenveto from './MuutosYhteenveto'
import { COMPONENT_TYPES } from "../modules/uusiHakemusFormConstants"
import { TUTKINNOT_SECTIONS, KIELET_SECTIONS } from "../../../modules/constants"
import { FIELD_ARRAY_NAMES} from "../modules/uusiHakemusFormConstants"
import { getKoulutusalaByKoodiarvo, getKoulutustyyppiByKoodiarvo, getTutkintoNimiByKoodiarvo } from "../modules/koulutusUtil"
import { parseLocalizedField } from "../../../../../../modules/helpers"

const MuutosListWrapper = styled.div`
`

const MuutosWrapper = styled.div`
  margin-left: 30px;
  flex-shrink: 0;
`

const MuutosAla = styled.div`
    margin: 10px 0 5px 0;
    width: 100%;
    font-weight: bold;
`

const MuutosTyyppi = styled.div`
    margin: 10px 0 5px 0;
    width: 100%;
    font-weight: bold;
    font-size: 90%;
    padding-left: 10px;
`

const Heading = styled.h4`
  margin: 18px 0;
`

const SubHeading = styled.h4`
  margin: 10px 0;
`

const components = {
  [COMPONENT_TYPES.MUUTOS]: Muutos,
  [COMPONENT_TYPES.MUUTOS_YHTEENVETO]: MuutosYhteenveto
}

class MuutosListTutkinnot extends Component {
  render() {

    var { muutokset, nimi } = this.props
    const { kategoria, fields, headingNumber, heading } = this.props
    const { length } = fields
    let { componentType } = this.props

    if (!componentType) {
      componentType = COMPONENT_TYPES.MUUTOS
    }

    _.forEach(muutokset, (m, index) => {
      m.indeksi = index
    })

    var opetuskielet = _.filter(muutokset, (m) => {
      return m.koodisto === "oppilaitoksenopetuskieli"
    })
    opetuskielet = _.sortBy(opetuskielet, (k) => { return k.koodiarvo })

    var tutkinnot = _.filter(muutokset, (m) => {
      return (m.koodisto === "koulutus" || m.koodisto === "osaamisala" || m.koodisto === "kieli") && (m.koodiarvo !== "999901" && m.koodiarvo !== "999903")
    })
    tutkinnot = tutkinnot.sort((a, b) => {
      // Apumuuttujat osaamisalojen järjestämiseen
      a.aakkostusNimi = a.nimi
      b.aakkostusNimi = b.nimi
      if ("parentId" in a) {
        a.aakkostusNimi = getTutkintoNimiByKoodiarvo(a.parentId)
      }
      if ("parentId" in b) {
        b.aakkostusNimi = getTutkintoNimiByKoodiarvo(b.parentId)
      }

      if (a.meta.koulutusala < b.meta.koulutusala) { return -1 }
      else if (a.meta.koulutusala > b.meta.koulutusala) { return 1 }
      else if (a.meta.koulutustyyppi < b.meta.koulutustyyppi) { return -1 }
      else if (a.meta.koulutustyyppi > b.meta.koulutustyyppi) { return 1 }
      else if ("parentId" in a && a.parentId === b.koodiarvo) { return 1 }
      else if ("parentId" in b && b.parentId === a.koodiarvo) { return -1 }
      else if (a.aakkostusNimi < b.aakkostusNimi) { return -1 }
      else if (a.aakkostusNimi > b.aakkostusNimi) { return 1 }
      return 0
    })

    var poikkeukset = _.filter(muutokset, (m) => {
      return m.koodisto === "koulutus" && (m.koodiarvo === "999901" || m.koodiarvo === "999903")
    })
    poikkeukset = _.sortBy(poikkeukset, (p) => { return p.koodiarvo })

    var valmistavat = _.filter(muutokset, (m) => {
      return m.koodisto === "ammatilliseentehtavaanvalmistavakoulutus"
    })
    valmistavat = _.sortBy(valmistavat, (v) => { return v.koodiarvo })

    var tyovoimat = _.filter(muutokset, (m) => {
      return m.koodisto === "oivatyovoimakoulutus"
    })
    tyovoimat = _.sortBy(tyovoimat, (t) => { return t.koodiarvo })

    var kuljettajat = _.filter(muutokset, (m) => {
      return m.koodisto === "kuljettajakoulutus"
    })
    kuljettajat = _.sortBy(kuljettajat, (k) => { return k.koodiarvo })

    // apumuuttujia väliotsikoiden paikkojen havaitsemiseen
    var koulutusalaA = undefined
    var koulutusalaB = undefined
    var koulutustyyppiA = undefined
    var koulutustyyppiB = undefined

    return (
      <MuutosListWrapper>
        {length > 0 &&
        <Heading>{`${headingNumber}. ${heading}`}</Heading>
        }
        { opetuskielet.length !== 0 &&
          <div>
            <SubHeading>{ KIELET_SECTIONS.OPETUSKIELET }</SubHeading>
            {opetuskielet.map((field, index) => {
              const muutos = fields.get(field.indeksi)
              const { koodiarvo, koodisto } = muutos
              const identifier = `muutoscomponent-${koodisto}-${koodiarvo}-${index}`

              return (
                <MuutosWrapper key={identifier}>
                  <MuutosComponent
                    key={index}
                    muutos={muutos}
                    muutokset={muutokset}
                    fields={fields}
                    kategoria={kategoria}
                    componentType={componentType}
                  />
                </MuutosWrapper>
              )
            })}
          </div>
        }
        { tutkinnot.length !== 0 &&
          <div>
            <SubHeading>
              { nimi === FIELD_ARRAY_NAMES.TUTKINNOT_JA_KOULUTUKSET
                ? TUTKINNOT_SECTIONS.TUTKINNOT
                : nimi === FIELD_ARRAY_NAMES.OPETUS_JA_TUTKINTOKIELET
                  ? KIELET_SECTIONS.TUTKINTOKIELET
                  : ""
              }
            </SubHeading>
            {tutkinnot.map((field, index) => {
              koulutusalaA = koulutusalaB
              koulutustyyppiA = koulutustyyppiB

              const muutos = fields.get(field.indeksi)
              const { koodiarvo, koodisto, meta } = muutos
              const { koulutusala, koulutustyyppi } = meta
              koulutusalaB = koulutusala
              koulutustyyppiB = koulutustyyppi

              const identifier = `muutoscomponent-${koodisto}-${koodiarvo}-${index}`
              var koulutusalanNimiSuomeksi = undefined
              var koulutustyypinNimiSuomeksi = undefined

              if (koulutusala) {
                  koulutusalanNimiSuomeksi = parseLocalizedField(getKoulutusalaByKoodiarvo(koulutusala).metadata)
                  koulutustyypinNimiSuomeksi = parseLocalizedField(getKoulutustyyppiByKoodiarvo(koulutustyyppi).metadata)
              }

              return (
                <MuutosWrapper key={identifier}>
                  { koulutusala && koulutusala !== koulutusalaA && <MuutosAla>{ koulutusalanNimiSuomeksi }</MuutosAla> }
                  { koulutusala && koulutustyyppi && (koulutusala !== koulutusalaA || koulutustyyppi !== koulutustyyppiA) && <MuutosTyyppi>{ koulutustyypinNimiSuomeksi }</MuutosTyyppi> }
                  <MuutosComponent
                    key={index}
                    muutos={muutos}
                    muutokset={muutokset}
                    fields={fields}
                    kategoria={kategoria}
                    componentType={componentType}
                  />
                </MuutosWrapper>
              )
            })}
          </div>
        }
        { poikkeukset.length !== 0 &&
          <div>
            <SubHeading>{ TUTKINNOT_SECTIONS.POIKKEUKSET }</SubHeading>
            {poikkeukset.map((field, index) => {
              const muutos = fields.get(field.indeksi)
              const { koodiarvo, koodisto } = muutos
              const identifier = `muutoscomponent-${koodisto}-${koodiarvo}-${index}`

              return (
                <MuutosWrapper key={identifier}>
                  <MuutosComponent
                    key={index}
                    muutos={muutos}
                    muutokset={muutokset}
                    fields={fields}
                    kategoria={kategoria}
                    componentType={componentType}
                  />
                </MuutosWrapper>
              )
            })}
          </div>
        }
        { valmistavat.length !== 0 &&
          <div>
            <SubHeading>{ TUTKINNOT_SECTIONS.VALMISTAVAT }</SubHeading>
            {valmistavat.map((field, index) => {
              const muutos = fields.get(field.indeksi)
              const { koodiarvo, koodisto } = muutos
              const identifier = `muutoscomponent-${koodisto}-${koodiarvo}-${index}`

              return (
                <MuutosWrapper key={identifier}>
                  <MuutosComponent
                    key={index}
                    muutos={muutos}
                    muutokset={muutokset}
                    fields={fields}
                    kategoria={kategoria}
                    componentType={componentType}
                  />
                </MuutosWrapper>
              )
            })}
        </div>
        }
        { tyovoimat.length !== 0 &&
          <div>
            <SubHeading>{ TUTKINNOT_SECTIONS.TYOVOIMAT }</SubHeading>
            {tyovoimat.map((field, index) => {
              const muutos = fields.get(field.indeksi)
              const { koodiarvo, koodisto } = muutos
              const identifier = `muutoscomponent-${koodisto}-${koodiarvo}-${index}`

              return (
                <MuutosWrapper key={identifier}>
                  <MuutosComponent
                    key={index}
                    muutos={muutos}
                    muutokset={muutokset}
                    fields={fields}
                    kategoria={kategoria}
                    componentType={componentType}
                  />
                </MuutosWrapper>
              )
            })}
          </div>
        }
        { kuljettajat.length !== 0 &&
          <div>
            <SubHeading>{ TUTKINNOT_SECTIONS.KULJETTAJAT }</SubHeading>
            {kuljettajat.map((field, index) => {
              const muutos = fields.get(field.indeksi)
              const { koodiarvo, koodisto, sisaltaa_merkityksen } = muutos
              const identifier = `muutoscomponent-${koodisto}-${koodiarvo}-${index}`

              return (
                <MuutosWrapper key={identifier}>
                  <MuutosComponent
                    key={index}
                    muutos={muutos}
                    muutokset={muutokset}
                    fields={fields}
                    kategoria={kategoria}
                    sisaltaa_merkityksen={sisaltaa_merkityksen}
                    componentType={componentType}
                  />
                   {/* <Liitteet {...this.props} fields={muutos} paikka="kuljettaja" isListOnly={true}/>     */}
                </MuutosWrapper>
              )
            })}
          </div>
        }
      </MuutosListWrapper>
    )
  }
}

const MuutosComponent = (props) => {
  const MuutosSubComponent = components[props.componentType]
  return (
    <MuutosSubComponent {...props} />
  )
}

export default MuutosListTutkinnot
