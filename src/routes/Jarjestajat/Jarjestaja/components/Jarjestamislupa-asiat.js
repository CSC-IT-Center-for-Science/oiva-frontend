import React from 'react'
import styled from 'styled-components'

import JarjestamislupaAsiatContainer from '../containers/JarjestamislupaAsiatContainer'
import { InnerContentContainer } from "../../../../modules/elements"

const LupaInnerContentWrapper = styled.div`
  margin: 40px 50px;
`

const JarjestamislupaAsiat = (props) => {
  const { lupadata } = props
  const { jarjestajaOid } = lupadata

  return (
    <InnerContentContainer>
      <LupaInnerContentWrapper>

        <JarjestamislupaAsiatContainer jarjestajaOid={jarjestajaOid} />

      </LupaInnerContentWrapper>

    </InnerContentContainer>
  )
}

export default JarjestamislupaAsiat
