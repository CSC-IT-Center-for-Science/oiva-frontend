import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { COLORS, FONT_STACK, MEDIA_QUERIES } from 'modules/styles'

const LinkItem = styled(NavLink)`
  padding: 10px 10px;
  color: white;
  text-transform: none;
  margin-left: 0px;
  font-size: 15px;
  font-family: ${FONT_STACK.ARIAL};
  line-height: 26px;

  a:visited {
    color: white;
  }

  &:hover {
    background-color: ${COLORS.OIVA_MENU_HOVER_COLOR};
    color: ${COLORS.WHITE};
  }

  &.active {
    color: ${COLORS.WHITE};
    background: ${COLORS.OIVA_MENU_HOVER_COLOR};
  }

  &.text-small {
    font-size: 14px;
    text-transform: none;
  }

  &.pull-right {
    margin-left: auto;
  }
  
  &.has-separator {
    border-right: 1px solid rgba(255, 255, 255, 0.25);
  }
  
  @media ${MEDIA_QUERIES.MOBILE} {
    font-size: 14px;
  }
`

export default LinkItem
