import React from 'react'
import styled from 'styled-components'

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

  return (
    <div>
      <OrganizerH1>{name}</OrganizerH1>
      <LargeParagraph>{ytunnus}</LargeParagraph>
    </div>
  )
}

export default JarjestajaBasicInfo
