import _ from "lodash";
import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { COLORS } from "../../../../modules/styles";

const MenuItem = styled(NavLink)`
  color: ${COLORS.WHITE};
  box-sizing: border-box;
  border: 1px solid ${COLORS.DARK_GRAY};
  border-right: 1px solid ${COLORS.BORDER_GRAY};
  position: relative;
  cursor: default;
  background-color: ${COLORS.DARK_GRAY};

  &.active {
    background-color: ${COLORS.WHITE};
    color: ${COLORS.BLACK};
  }

  &:hover {
    background-color: ${COLORS.OIVA_TABLE_HEADER_HOVER_COLOR};
    cursor: pointer;
  }
  &.active:hover {
    background-color: ${COLORS.WHITE};
    cursor: default;
  }
`;

const ProfileMenu = props => {
  const { routes } = props;

  return (
    <nav>
      <ul className="flex flex-wrap">
        {_.map(routes, (item, i) =>
          item.authenticated ? (
            <li key={i} className={`mr-3 mb-3`}>
              <MenuItem
                id={item.id}
                to={item.path}
                exact={item.exact}
                className="inline-block border border-blue-500 rounded py-2 px-4 text-white no-underline">
                {item.text}
              </MenuItem>
            </li>
          ) : null
        )}
      </ul>
    </nav>
  );
};

export default ProfileMenu;
