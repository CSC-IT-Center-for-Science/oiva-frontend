import styled from "styled-components";

import { COLORS, MEDIA_QUERIES } from "./styles";

export const Table = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #d5d5d5;
  border-bottom: none;
  overflow-x: hidden;
`;

export const Thead = styled.div`
  display: flex;
  flex-direction: column;
  color: ${COLORS.WHITE};
  background: ${COLORS.OIVA_TABLE_BG_COLOR};

  div {
    font-size: 13px;
    position: relative;

    &:last-child {
      &:after {
        display: none;
      }
    }

    @media ${MEDIA_QUERIES.MOBILE} {
      font-size: 16px;
      padding: 10px;
    }
  }
`;

export const Tbody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Tr = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  border-bottom: 1px solid #d5d5d5;

  a {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: ${COLORS.BLACK};
  }

  color: ${COLORS.BLACK};

  @media ${MEDIA_QUERIES.MOBILE} {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px 0;

    a {
      flex-direction: column;
      align-items: flex-start;
      padding: 5px 0;
    }
  }

  &:hover {
    cursor: pointer;
    background: ${COLORS.OIVA_TABLE_HOVER_COLOR};
  }
`;

export const Trn = styled(Tr)`
  &:hover {
    cursor: default;
    background: transparent;
  }
`;
export const Th = styled.div`
  display: flex;
  width: ${props => (props.width ? props.width : "auto")};
  flex: ${props => (props.flex ? props.flex : 1)};
  padding: 10px 10px;
  align-items: ${props => (props.alignItems ? props.alignItems : "stretch")};
  color: ${COLORS.WHITE};

  img {
    margin-right: 5px;
  }

  &:hover {
    cursor: pointer;
    background: ${COLORS.OIVA_TABLE_HEADER_HOVER_COLOR};
  }

  @media ${MEDIA_QUERIES.MOBILE} {
    &.lupa-diaarinumero {
      padding-bottom: 4px;
    }

    &.lupa-jarjestaja {
      font-size: 18px;
      padding-bottom: 2px;
    }

    &.lupa-maakunta {
      padding-top: 2px;
    }
  }
`;
export const Thn = styled(Th)`
  &:hover {
    cursor: default;
    background: initial;
  }
`;

export const Thn0 = styled(Thn)`
  flex-grow: 0.5;
  min-width: 2em;
`;

export const Thn2 = styled(Thn)`
  flex-grow: 2;
`;

export const Td = styled.div`
  display: flex;
  flex: ${props => (props.flex ? props.flex : 1)};
  width: ${props => (props.width ? props.width : "auto")};
  padding: 10px 10px;
  align-items: ${props => (props.alignItems ? props.alignItems : "stretch")};
  img {
    margin-right: 5px;
  }

  @media ${MEDIA_QUERIES.MOBILE} {
    &.lupa-diaarinumero {
      padding-bottom: 4px;
    }

    &.lupa-jarjestaja {
      font-size: 18px;
      padding-bottom: 2px;
    }

    &.lupa-maakunta {
      padding-top: 2px;
    }
  }
`;

export const Td2 = styled(Td)`
  flex-grow: 2;
`;

export const ThButton = styled(Thn)`
  padding: 0;
  margin: 0;
  min-width: 82px;
  max-width: 82px;
  flex: 0;
`;

export const TdButton = styled(Td)`
  background: white;
  padding: 0;
  margin: 0;
  width: 82px;
  max-width: 82px;
`;
