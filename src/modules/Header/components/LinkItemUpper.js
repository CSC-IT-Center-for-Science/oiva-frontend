import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { COLORS, FONT_STACK, MEDIA_QUERIES } from 'modules/styles'

const LinkItemUpper = styled(NavLink)`
  text-decoration: none;
  color: ${COLORS.BLACK};
  text-transform: none;
  font-size: 11.5px;
  font-family: ${FONT_STACK.ARIAL};
  line-height: 18px;
  margin-bottom:10px;
  white-space: nowrap;
    
  a:visited {
    color: ${COLORS.WHITE};
  }

  &:hover {
    background-color: ${COLORS.WHITE};
    color: ${COLORS.BLACK};
    text-decoration:underline;
  }

  &.active {
    color: ${COLORS.BLACK};
    background: white;
  }
  &.pull-right {
    margin-left: auto;
  }
  
  &.has-separator {
    border-right: 1px solid ${COLORS.OIVA_MEDIUM_GREEN};
    margin-right:10px;
    padding-right:10px;
    height: 100%;
  }
  
  @media ${MEDIA_QUERIES.MOBILE} {
    font-size: 14px;
  }
`

export default LinkItemUpper
