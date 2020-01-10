import styled from "styled-components";
import { COLORS, TRANSITIONS } from "../../../../../../modules/styles";

export const modalStyles = {
  overlay: {
    zIndex: 3
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "50px 70px",
    borderRadius: 0,
    boxShadow: "0px 0px 40px -1px rgba(86,86,86,0.25)",
    boxSizing: "border-box",
    maxWidth: "670px"
  }
};

export const Content = styled.div`
  margin-bottom: 40px;
`;

export const ModalText = styled.p`
  margin: 0 auto 10px;
  font-size: 18px;
`;

export const ModalButton = styled.button`
  color: ${props =>
    props.disabled
      ? COLORS.WHITE
      : props.primary
      ? COLORS.WHITE
      : COLORS.OIVA_GREEN};
  background-color: ${props =>
    props.disabled
      ? COLORS.LIGHT_GRAY
      : props.primary
      ? COLORS.OIVA_GREEN
      : COLORS.WHITE};
  border: 1px solid
    ${props => (props.disabled ? COLORS.LIGHT_GRAY : COLORS.OIVA_GREEN)};
  cursor: pointer;
  display: inline-block;
  position: relative;
  height: 36px;
  min-width: 125px;
  vertical-align: middle;
  text-align: center;
  border-radius: 0;
  font-size: 14px;
  transition: ${TRANSITIONS.EASE_IN_OUT_QUICK};
  margin-right: 15px;
  padding: 0 15px;

  &.button-danger {
    color: ${COLORS.WHITE};
    background-color: ${COLORS.OIVA_RED};
    border: 1px solid ${COLORS.OIVA_RED};
  }

  &:hover {
    color: ${COLORS.WHITE};
    background-color: ${COLORS.OIVA_DARK_GREEN};
    border: 1px solid ${COLORS.OIVA_DARK_GREEN};
    ${props => (props.disabled ? "cursor: not-allowed;" : null)}
  }
`;
