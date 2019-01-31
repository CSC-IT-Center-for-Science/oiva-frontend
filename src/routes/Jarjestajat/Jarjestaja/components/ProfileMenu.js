import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { COLORS } from "../../../../modules/styles"

const MenuBar = styled.div`
  display: flex;
  background-color: ${COLORS.DARK_GRAY};
  width: 100%;
`

const MenuItem = styled(NavLink)`
  color: ${COLORS.WHITE};
  padding: 13px 26px;
  box-sizing: border-box;
  border: 1px solid ${COLORS.DARK_GRAY};
  border-right: 1px solid ${COLORS.BORDER_GRAY};
  position: relative;
  cursor: default;
  
  &.active {
    background-color: ${COLORS.WHITE};
    color: ${COLORS.BLACK};
    border-left: 1px solid transparent;
  }
  
  &:hover {
    background-color: ${COLORS.OIVA_TABLE_HEADER_HOVER_COLOR};
    border-left: 1px solid transparent;
    cursor: pointer;
  }
  &.active:hover {
    background-color: ${COLORS.WHITE};
    cursor: default;
  }
  
  &:first-child {
    &:hover, &.active {
      border-left: 1px solid ${COLORS.DARK_GRAY};
    }
  }
  
  &:last-child {
    border-right: none;
  }
`

const ProfileMenu = (props) => {

  const { routes } = props

  return (
    <MenuBar>
      {_.map(routes, (item, i) => (item.authenticated) ? <MenuItem key={i} to={item.path} exact={item.exact}>{item.text}</MenuItem> : null)}
    </MenuBar>
  )
}

export default ProfileMenu
