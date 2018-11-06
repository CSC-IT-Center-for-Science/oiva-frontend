import React from 'react'
import styled from 'styled-components'
import { parseLocalizedField, parsePostalCode } from "../../../../modules/helpers"

const OrganizerH1 = styled.h1`
  margin-bottom: 10px;
`

const LargeParagraph = styled.p`
  font-size: 20px;
  line-height: 24px;
  margin: 0;
`

const JarjestajaBasicInfo = (props) => {
  const { jarjestaja } = props
  const name = jarjestaja.nimi.fi || jarjestaja.nimi.sv || ''
  const ytunnus = jarjestaja.ytunnus
  const address = jarjestaja.kayntiosoite.osoite
  const postalCode = parsePostalCode(jarjestaja.kayntiosoite.postinumeroUri)
  const city = parseLocalizedField(jarjestaja.kuntaKoodi.metadata)

  return (
    <div>
      <OrganizerH1>{name}</OrganizerH1>
      <LargeParagraph>{ytunnus}</LargeParagraph>
      <LargeParagraph>{address}</LargeParagraph>
      <LargeParagraph>{postalCode} {city}</LargeParagraph>
    </div>
  )
}

export default JarjestajaBasicInfo
