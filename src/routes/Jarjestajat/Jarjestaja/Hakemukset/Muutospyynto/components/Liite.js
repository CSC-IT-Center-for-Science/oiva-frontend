import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS, TRANSITIONS } from "../../../../../../modules/styles"
import { FaPlus } from 'react-icons/fa';
import { HAKEMUS_OTSIKOT  } from "../modules/uusiHakemusFormConstants"

const LiiteTopArea = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const FileInput = styled.div`
  color: ${props => props.disabled ? COLORS.WHITE : props.color ? props.textColor : COLORS.OIVA_GREEN};
  background-color: ${props => props.disabled ? COLORS.LIGHT_GRAY : props.bgColor ? props.bgColor : COLORS.WHITE};
  border: 1px solid ${props => props.disabled ? COLORS.LIGHT_GRAY : props.bgColor ? props.bgColor : COLORS.OIVA_GREEN};
  margin: 10px 0;
  font-size: 14px;
  transition: ${TRANSITIONS.EASE_IN_OUT_QUICK};
  height: 36px;
  width: 200px;
  cursor: pointer;
  display: flex;
  justify-content: space-around;
  align-items: center;
  div {
    position: absolute;
    text-align: center;
    white-space: nowrap;
    margin: 0 auto;
    cursor: pointer;
    svg {
      margin: 0 0 -2px 0;
    }
  }
  &:hover {
    color: ${props => props.disabled ? COLORS.WHITE : props.bgColor ? props.bgColor : COLORS.WHITE};
    background-color: ${props => props.disabled ? COLORS.LIGHT_GRAY : props.textColor ? props.textColor : COLORS.OIVA_GREEN};
    ${props => props.disabled ? 'cursor: not-allowed;' : null}
    cursor: pointer;
  }
  
  input[type="file"] {
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 36px;
  }
`
class Liite extends Component {

  render() {
    return (
      <div>
        <LiiteTopArea>
          { this.props.helpText && this.props.helpText }
          { this.props.helpText && " " }
          { HAKEMUS_OTSIKOT.LIITE_OHJE.FI }
        </LiiteTopArea>
        <FileInput>
          <div><FaPlus /> {HAKEMUS_OTSIKOT.LISAA_LIITE.FI}...</div>
          <input
            type="file"
            defaultValue=""
            onChange={this.props.setAttachment}
          />
        </FileInput>
      </div>
    )
  }
}

export default Liite
