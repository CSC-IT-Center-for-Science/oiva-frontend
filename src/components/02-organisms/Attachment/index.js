import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FaPlus } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md"
import { COLORS, TRANSITIONS } from "../Attachments/styles";

const FileInput = styled.div`
  color: ${props =>
    props.disabled
      ? COLORS.WHITE
      : props.color
      ? props.textColor
      : COLORS.OIVA_GREEN};
  background-color: ${props => 
    props.styles.backgroundColor ? props.styles.backgroundColor : props.disabled
      ? COLORS.LIGHT_GRAY
      : props.bgColor
      ? props.bgColor
      : COLORS.WHITE};
  border: ${props => props.styles.border ? props.styles.border : '1px solid'}
    ${props =>
      props.disabled
        ? COLORS.LIGHT_GRAY
        : props.bgColor
        ? props.bgColor
        : COLORS.OIVA_GREEN};
  margin: 0.5em 0;
  font-size: ${props => props.styles.fontSize ? props.styles.fontSize : '0.9em'};
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
      margin: ${props => props.styles.svgMargin ? props.styles.svgMargin : '0.2em 0.2em 0.3em 0'};
      cursor: pointer
    }
  }
  &:hover {
    color: ${props =>
      props.styles.disableHover ? '' : props.disabled
        ? COLORS.WHITE
        : props.bgColor
        ? props.bgColor
        : COLORS.WHITE};
    background-color: ${props =>
      props.styles.disableHover ? '' : props.disabled
        ? COLORS.LIGHT_GRAY
        : props.textColor
        ? props.textColor
        : COLORS.OIVA_GREEN};
    ${props => (props.disabled ? "cursor: not-allowed;" : null)}
    cursor: pointer;
  }
  input[type="file"],
  input[type=file]::-webkit-file-upload-button {
    opacity: 0;
    cursor: pointer;
    width: 100%;
  }
`;

const Attachment = React.memo(props => {
  return (
    <React.Fragment>
      <FileInput styles={props.styles}>
        <div className="flex flex-row">
          {props.styles.circleIcon ?
            <MdAddCircleOutline size={props.styles.iconSize ? props.styles.iconSize : 14}/> :
            <FaPlus size={props.styles.iconSize ? props.styles.iconSize : 14}/>}
            <span className={props.styles.normalCase ? "justify-center" : "uppercase justify-center"}>
              &nbsp;{props.messages.attachmentAdd}
            </span>
        </div>
        <input
          id={props.id}
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
  id: PropTypes.string,
  messages: PropTypes.object,
  name: PropTypes.string,
  setAttachment: PropTypes.func,
  styles: PropTypes.object
};

Attachment.defaultProps = {
  styles: {}
};

export default Attachment;
