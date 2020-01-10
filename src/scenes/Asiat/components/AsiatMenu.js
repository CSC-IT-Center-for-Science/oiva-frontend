import _ from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import { COLORS } from "../../../modules/styles"

const MenuBar = styled.div`
  display: flex;
`

const MenuItem = styled(NavLink)`
  color: ${COLORS.OIVA_GREEN};
  padding: 8px 0px;
  margin: 0px 16px;
  box-sizing: border-box;
  position: relative;
  border-bottom: 5px solid ${COLORS.WHITE};
  
  &.active {
    background-color: ${COLORS.WHITE};
    color: ${COLORS.BLACK};
    border-bottom: 5px solid ${COLORS.OIVA_GREEN};
  }
  
  &:hover {
    background-color: ${COLORS.WHITE};
    color: ${COLORS.BLACK};
    border-bottom: 5px solid ${COLORS.OIVA_GREEN};
  }
 
`

const AsiatMenu = (props) => {

    const { routes } = props

    return (
        <MenuBar>
            {_.map(routes, (item, i) => (item.authenticated) ? <MenuItem key={i} to={item.path} exact={item.exact}>{item.text.fi}</MenuItem> : null)}
        </MenuBar>
    )
}

export default AsiatMenu
