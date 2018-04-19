import React from 'react'
import styled from 'styled-components'

import { COLORS } from "../../../../modules/styles"
import arrowDown from 'static/images/arrow-down.svg'

export const Wrapper = styled.div`
  margin: 4px 0;
  background-color: ${COLORS.BG_GRAY};
  max-width: 725px;
`

export const Heading = styled.div`
  position: relative;
  z-index: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding:  10px 20px;
  
  &:hover {
    background-color: ${COLORS.BG_DARKER_GRAY};
  }
`

export const H3 = styled.h3`

`

export const Arrow = styled.img`
  margin-right: 20px;
  ${props => props.rotated ? `transform: rotate(90deg);` : null}
`

export const Span = styled.span`
  margin-right: 15px;
  color: ${props => props.color ? props.color : COLORS.BLACK};
`

export const SpanMuutos = styled.span`
 margin-left: auto;
 color: ${props => props.color ? props.color : COLORS.BLACK};
 font-size: 14px;
 position: relative;
 z-index: 2;
`

export const KoulutusalaListWrapper = styled.div`
  padding:  5px 20px 10px;
`

export const KoulutusTyyppiWrapper = styled.div`
  margin: 5px 0 20px;
  font-size: 15px;
  font-weight: bold;
`

export const TutkintoWrapper = styled.div`
  margin: 6px 0 6px 30px;
  font-size: 15px;
  display: flex;
  position: relative;
  align-items: center;
  
  &.is-removed {
    text-decoration: line-through;
    color: ${COLORS.OIVA_PURPLE};
  }
  
  &.is-added {
    color: ${COLORS.OIVA_PURPLE};
  }
  
  &.is-in-lupa {
    font-weight: bold;
  }
  
  &.is-removed {
    
  }
`

export const Koodi = styled.span`
  flex: 1;
`

export const Nimi = styled.span`
  flex: 6;
`

export const Kohdenumero = styled.span`
  font-size: 20px;
  position: absolute;
  left: -30px;
`

export const Otsikko = styled.h3`
  text-transform: uppercase;
  font-size: 20px;
`

export const ControlsWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

export const BottomWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const AddWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 3;
  overflow: hidden;
`

export const ScrollWrapper = styled.div`
  overflow: auto;
  max-height: 100%;
`

export const AddContent = styled.div`
  position: relative;
  padding: 30px;
  background-color: ${COLORS.WHITE};
  margin-top: 150px;
`
export const Row = styled.div`
  margin-bottom: 30px;
  margin-left: ${props => props.marginLeft ? props.marginLeft : 0};
`

export const Kohde = styled.div`
  margin-left: 30px;
  position: relative;
  padding: 0 0 26px;
  
  &:last-child {
    border-bottom: none;
  }
`

export const Separator = styled.div`
  &:after {
    display: block;
    content: '';
    width: 100%;
    height: 1px;
    background-color: ${COLORS.BORDER_GRAY};
    margin: 30px 0;
  }
`

export const Input = styled.input`
  font-size: 15px;
  padding: 8px 16px;
  width: 320px;
  margin: 10px 10px 10px 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
  }
`

export const SelectStyle = styled.div`
  margin: 10px 0;
  border: 1px solid #ccc;
  width: 320px;
  border-radius: 0;
  overflow: hidden;
  background: #F8F8F8 url(${arrowDown}) no-repeat 93% 50%;
  
  select {
    font-size: 15px;
    padding: 8px 16px;
    width: 130%;
    border: none;
    box-shadow: none;
    background: transparent;
    background-image: none;
    -webkit-appearance: none;
    
    &:focus {
      outline: none;
    }
  }
`

export const Checkbox = styled.div`
  width: 20px;
  position: relative;
  margin: 6px 10px;
  
  label {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    top: -3px;
    left: 0;
    background: white;
    border-radius: 0;
    border: 1px solid ${COLORS.OIVA_GREEN};
    
    &:hover {
      &:after {
        border-color: ${COLORS.OIVA_GREEN};
        opacity: 0.5;
      }
    }
    
    &:after {
      content: '';
      width: 9px;
      height: 5px;
      position: absolute;
      top: 4px;
      left: 4px;
      border: 3px solid #fcfff4;
      border-top: none;
      border-right: none;
      background: transparent;
      opacity: 0;
      transform: rotate(-45deg);
    }
   
  }
  input[type=checkbox] {
    visibility: hidden;
    
    &:checked + label {
      background: ${COLORS.OIVA_GREEN};
      
      &:hover {
        &:after {
          background: rgba(90, 138, 112, 0.0);
        }
      }
    }
    
    &:hover {
      background: rgba(90, 138, 112, 0.5);
    }
    
    &:checked + label:after {
      opacity: 1;
      background: ${COLORS.OIVA_GREEN};
      
      &:hover {
        background: rgba(90, 138, 112, 0.5);
      }
    }
    
    &:checked + label:hover {
      background: rgba(90, 138, 112, 0.5);
      
      &:after {
        border-color: white;
        opacity: 1;
      }
    }
  }
`
