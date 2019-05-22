import styled from 'styled-components'

import { COLORS } from 'modules/styles'

const HeaderBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: ${COLORS.WHITE};
  color: ${COLORS.WHITE};
  width: 100%;
`

export default HeaderBar
