import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { COLORS, FONT_STACK, MEDIA_QUERIES } from 'modules/styles'

const LinkItemUpper = styled(NavLink)`
  text-decoration: none;
  color: ${COLORS.BLACK};
  text-transform: none;
  font-family: ${FONT_STACK.ARIAL};
  margin-top:10px;
  margin-bottom:10px;
    
  a:visited {
    color: white;
  }

  &:hover {
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
    border-right: 1px solid ${COLORS.OIVA_MENU_BG_COLOR};
    margin-right:10px;
    padding-right:10px;
  }
  
  @media ${MEDIA_QUERIES.MOBILE} {
    font-size: 16px;
  }
`

export default LinkItemUpper
