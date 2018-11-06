import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { COLORS, FONT_STACK, MEDIA_QUERIES } from 'modules/styles'

const LinkItemUpper = styled(NavLink)`
  padding: 5px 5px;
  text-decoration: none;
  color: ${COLORS.BLACK};
  text-transform: none;
  margin-left: 0px;
  font-size: 11.5px;
  font-family: ${FONT_STACK.ARIAL};
  line-height: 18px;
  margin-top:10px;
  margin-bottom:10px;
    
  a:visited {
    color: white;
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
    border-right: 1px solid ${COLORS.OIVA_MENU_BG_COLOR};
    margin-right:10px;
    padding-right:10px;
  }
  
  @media ${MEDIA_QUERIES.MOBILE} {
    font-size: 16px;
  }
`

export default LinkItemUpper
