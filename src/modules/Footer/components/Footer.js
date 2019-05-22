import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS, Leijona } from 'modules/styles'

const FooterBar = styled.div`
  background: ${COLORS.WHITE};
  color: ${COLORS.BLACK};
  border-top: 0.1rem solid ${COLORS.OIVA_MEDIUM_GREEN};
`

const FooterBarUpper = styled.div`
  background: ${COLORS.WHITE};
`

class Footer extends Component {

  render() {

    return (
      <FooterBar className="flex justify-between h-auto p-2 pl-8 c-b">
        <FooterBarUpper className="flex mx-auto w-full text-xs max-w-xl">
          <div className="hidden sm:inline">
            <Leijona/>
          </div>
          <div className="pl-6 py-6">
            {/* TODO: Lokalisointi julkisille näkymille */}
            <p className="my-2">OPETUS- JA KULTTUURIMINISTERIÖ</p>
            <p className="my-2">PL 29, 00023 VALTIONEUVOSTO</p>
            <p className="my-0">PUH. 029 533 0004, <a href="http://www.minedu.fi">WWW.MINEDU.FI</a></p>
          </div>
        </FooterBarUpper>
      </FooterBar>
    )
  }
}
export default Footer