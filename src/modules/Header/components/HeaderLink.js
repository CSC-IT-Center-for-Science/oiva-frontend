import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { COLORS } from 'modules/styles'

const HeaderLink = styled(Link)`
  padding: 15px 20px;
  text-decoration: none;
  color: white;
  text-transform: none;
  line-height: 18px;

  a:visited {
    color: white;
  }

  &:hover {
    text-decoration: underline;
  }

  &.active {
    color: ${COLORS.WHITE};
    background: white;
  }

  &.text-small {
    font-size: 14px;
    text-transform: none;
  }
`

export default HeaderLink
