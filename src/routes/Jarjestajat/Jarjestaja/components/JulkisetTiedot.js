import React from 'react'
import { LUPA_EXCEPTION_PATH } from "../../../../modules/constants"
import styled from 'styled-components'

import LupaHistoryContainer from '../containers/LupaHistoryContainer'
import CurrentLupa from './CurrentLupa'

import { InnerContentContainer, InnerContentWrapper  } from "../../../../modules/elements"
import { LUPA_LISAKOULUTTAJAT } from "../../modules/constants"

const LargeParagraph = styled.p`
  font-size: 20px;
  line-height: 24px;
  margin: 0;
`

const LupaInfoWrapper = styled.div`
  margin: 0 0 20px 0;
  
  h2 {
    font-weight: bold;
  }
`

const JulkisetTiedot = (props) => {
  const { lupadata } = props
  const { jarjestaja } = lupadata
  const { diaarinumero, jarjestajaOid } = lupadata
  let { alkupvm } = lupadata
  const jarjestajaNimi = jarjestaja.nimi.fi || jarjestaja.nimi.sv || ''
  const lupaException = LUPA_LISAKOULUTTAJAT[jarjestaja.ytunnus]

  if (lupaException) {
    alkupvm = lupaException.pvm
  }

  return (
    <InnerContentContainer>
      <InnerContentWrapper>
        <LupaInfoWrapper>
          <h2>Päätöshistoria</h2>
          <LargeParagraph>Viimeisin päätös</LargeParagraph>
        </LupaInfoWrapper>

        <CurrentLupa
          diaarinumero={diaarinumero}
          jarjestaja={jarjestajaNimi}
          voimassaolo={alkupvm}
          lupaExceptionUrl={lupaException ? `${LUPA_EXCEPTION_PATH}${lupaException.pdflink}` : null}
        />

        <LargeParagraph>Historiatiedot</LargeParagraph>

        <LupaHistoryContainer jarjestajaOid={jarjestajaOid} />
      </InnerContentWrapper>

    </InnerContentContainer>
  )
}

export default JulkisetTiedot
