import React from 'react'
import styled from 'styled-components'

import { parseLocalizedField, parsePostalCode } from "../../../../../../modules/helpers"

const LargeParagraph = styled.p`
  font-size: 18px;
  line-height: 22px;
  margin: 0;
`

const OrganisaationTiedot = (props) => {
  const { jarjestaja } = props
  if (!jarjestaja) {
    return null
  }

  const name = jarjestaja.nimi.fi || jarjestaja.nimi.sv || ''
  const address = jarjestaja.kayntiosoite.osoite
  const postalCode = parsePostalCode(jarjestaja.kayntiosoite.postinumeroUri)
  const city = parseLocalizedField(jarjestaja.kuntaKoodi.metadata)

  return (
    <div>
      <h3>{name}</h3>
      <LargeParagraph>{address}</LargeParagraph>
      <LargeParagraph>{postalCode} {city}</LargeParagraph>
    </div>
  )
}

export default OrganisaationTiedot
