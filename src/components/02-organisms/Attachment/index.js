import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { injectIntl } from "react-intl";
import { COLORS, TRANSITIONS } from "../../../modules/styles";
import { HAKEMUS_OTSIKOT } from "../../../locales/uusiHakemusFormConstants";
import { FaPlus } from "react-icons/fa";

const FileInput = styled.div`
  color: ${props =>
    props.disabled
      ? COLORS.WHITE
      : props.color
      ? props.textColor
      : COLORS.OIVA_GREEN};
  background-color: ${props =>
    props.disabled
      ? COLORS.LIGHT_GRAY
      : props.bgColor
      ? props.bgColor
      : COLORS.WHITE};
  border: 1px solid
    ${props =>
      props.disabled
        ? COLORS.LIGHT_GRAY
        : props.bgColor
        ? props.bgColor
        : COLORS.OIVA_GREEN};
  margin: 0.5em 0;
  font-size: 0.9em;
  transition: ${TRANSITIONS.EASE_IN_OUT_QUICK};
  width: 10em;
  cursor: pointer;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 0.2em;
  div {
    position: absolute;
    text-align: center;
    white-space: nowrap;
    margin: 0 auto;
    cursor: pointer;
    svg {
      margin: 0.2em 0.2em 0.3em 0;
    }
  }
  &:hover {
    color: ${props =>
      props.disabled
        ? COLORS.WHITE
        : props.bgColor
        ? props.bgColor
        : COLORS.WHITE};
    background-color: ${props =>
      props.disabled
        ? COLORS.LIGHT_GRAY
        : props.textColor
        ? props.textColor
        : COLORS.OIVA_GREEN};
    ${props => (props.disabled ? "cursor: not-allowed;" : null)}
    cursor: pointer;
  }

  input[type="file"] {
    opacity: 0;
    cursor: pointer;
    width: 100%;
  }
`;

const Attachment = React.memo(props => {
  return (
    <React.Fragment>
      <FileInput>
        <div className="flex flex-row uppercase">
          <FaPlus /> {HAKEMUS_OTSIKOT.LISAA_LIITE.FI}...
        </div>
        <input
          name={props.name}
          type="file"
          defaultValue=""
          onChange={e => {
            props.setAttachment(e);
            e.target.value = null;
            e.stopPropagation();
          }}
        />
      </FileInput>
    </React.Fragment>
  );
});

Attachment.propTypes = {
  name: PropTypes.string,
  setAttachment: PropTypes.func
};

export default injectIntl(Attachment);
