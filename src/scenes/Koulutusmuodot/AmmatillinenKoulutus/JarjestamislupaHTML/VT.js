import React from 'react'
import styled from 'styled-components'

const VTWrapper = styled.div`
  margin: 6px 0 0 0;
`

const Nimi = styled.p`
  margin-left: 30px;
`

const VT = (props) => {
  const { nimi, koodi } = props
  return (
    <VTWrapper>
      <Nimi>{koodi ? koodi + ' ' : null}{nimi}</Nimi>
    </VTWrapper>
  )
}

export default VT