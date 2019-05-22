/**
 * Tässä tiedostossa:
 *
 * 1) Määritetään applikaatiolle globaalit tyylit
 * 2) Määritetään tyylielementtejä (värit jne.) joita käytetään komponenteissa
 * 3) Määritetään styled-components komponentteja, joita voidaan käyttää applikaatiossa
 */

import styled, { injectGlobal } from 'styled-components'

import background from 'static/images/palikat.png'
import leijona from 'static/images/OKM_FiSve_LM_RGB_logot.png'

import 'static/fonts/OpenSans-Regular.ttf'
import 'static/fonts/OpenSans-SemiBold.ttf'
import 'static/fonts/GothamNarrow-Book.otf'
import 'static/fonts/GothamNarrow-Light.otf'

// Colors
export const COLORS = {
  OIVA_GREEN: '#5A8A70',
  OIVA_RED: '#cc3300',
  OIVA_PURPLE: '#9B26B6',
  DARK_GRAY: '#525252',
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#D8D8D8',
  BORDER_GRAY: '#DFDFDF',
  BG_GRAY: '#F5F5F5',
  BG_DARKER_GRAY: '#e6e6e6',
  ACTIVE_BLUE: '#E9F6FA',
  OIVA_OPAQUE_GREEN: 'rgba(90,138,112,0.4)',
  OIVA_DARK_GREEN: '#517c64',
  OIVA_MEDIUM_GREEN: '#70A489',
  OIVA_LIGHT_GREEN: '#eef3f0',
  OIVA_MENU_FONT_COLOR: '#EBF4F4',
  OIVA_HOVER_COLOR: '#98B8A7',
  OIVA_MENU_SELECTED_COLOR: '#A8C8B7',
  OIVA_TABLE_BG_COLOR: '#70A489',
  OIVA_TABLE_HOVER_COLOR: 'rgba(90,138,112,0.2)',
  OIVA_TABLE_HEADER_HOVER_COLOR: '#98B8A7'
}


export const FONT_STACK = {
  GOTHAM_NARROW: `"Gotham Narrow", Helvetica, Arial, sans-serif`,
  GOTHAM_NARROW_BOLD: `"Gotham Narrow Bold", Helvetica, Arial, sans-serif`,
  OPEN_SANS_REGULAR: `"Open Sans", Helvetica, Arial, sans-serif`,
  OPEN_SANS_SEMIBOLD: `"Open Sans", Helvetica, Arial, sans-serif`,
  PT_SANS_NARROW: `"PT Sans Narrow", "Open Sans", Helvetica, Arial, sans-serif`,
  SOURCE_SANS: `"Source Sans", "Open Sans", Helvetica, Arial, sans-serif`,
  ARIAL: `"Arial", "Open Sans", Helvetica, sans-serif`
}

export const APP_WIDTH = 1030

// Media query breakpointit
export const MEDIA_QUERIES = {
  MOBILE: 'only screen and (max-width: 767px)',
  TABLET: 'only screen and (min-width: 768px) and (max-width: 1023px)',
  TABLET_MIN: 'only screen and (min-width: 768px)',
  DESKTOP_NORMAL: 'only screen and (min-width: 1024px) and (max-width: 1279px)',
  DESKTOP_LARGE: 'only screen and (min-width: 1280px)'
}

export const TRANSITIONS = {
  EASE_IN_OUT_QUICK: 'all 0.05s ease-in-out'
}

// Globaalit tyylit
injectGlobal`
  body {
    margin: 0;
    font-family: ${FONT_STACK.GOTHAM_NARROW};
  } 
    
  table {
    border: 1px solid #D5D5D5;
  }
  
  thead {
    color: ${COLORS.WHITE};
    background: ${COLORS.OIVA_TABLE_BG_COLOR};
  }
  
  thead {
    th {
    }
  }
  
  tbody {
    tr {
      &:nth-child(even) {
        background: #F9F9F9;
      }
    }
  }

  th {
    font-weight: normal;
    padding: 6px 18px;
  }
  
  h1 {
    font-family: ${FONT_STACK.PT_SANS_NARROW};
    font-size: 40px;
  }
  
  h4 {
    margin: 18px 0 10px;
  }
  
  p {
    margin: 11px 0;
  }
  
  a {
    color: ${COLORS.OIVA_GREEN};
    text-decoration: none;
  }
  
  @media ${MEDIA_QUERIES.MOBILE} {
    h1 {
      font-size: 26px;
    }
  }
  
  div, p, span {
    &.is-removed {
      text-decoration: line-through;
      color: ${COLORS.OIVA_PURPLE};
    }
    
    &.is-added {
      color: ${COLORS.OIVA_PURPLE};
    }
    
    &.is-changed {
      color: ${COLORS.OIVA_PURPLE};
    }
    
    &.is-in-lupa {
      font-weight: bold;
    }
  }
  
  input[type="text"] {
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
  }
  
  input[type="number"] {
    font-size: 15px;
    padding: 8px 16px;
    width: 140px;
    margin: 10px 10px 10px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    
    &:focus {
      outline: none;
    }
  }
  
  .control {
    display: flex;
    position: relative;
    padding-left: 30px;
    margin-bottom: 5px;
    margin-right: 20px;
    padding-top: 3px;
    cursor: pointer;
    font-size: 16px;
  }
  .control input {
      position: absolute;
      z-index: -1;
      opacity: 0;
  }
  .control_indicator {
      position: absolute;
      top: -2px;
      left: 0;
      height: 24px;
      width: 24px;
      background: #ffffff;
      border: 1px solid #909090;
  }
  .control-radio .control_indicator {
      border-radius: 50%;
  }
  
  .control:hover input ~ .control_indicator,
  .control input:focus ~ .control_indicator {
      background: #ffffff;
  }
  
  .control input:checked ~ .control_indicator {
      background: #ffffff;
  }
  .control:hover input:not([disabled]):checked ~ .control_indicator,
  .control input:checked:focus ~ .control_indicator {
      background: #ffffff;
  }
  .control input:disabled ~ .control_indicator {
      background: #e6e6e6;
      opacity: 0.6;
      pointer-events: none;
  }
  .control_indicator:after {
      box-sizing: unset;
      content: '';
      position: absolute;
      display: none;
  }
  .control input:checked ~ .control_indicator:after {
      display: block;
  }
  .control-radio .control_indicator:after {
      left: 4px;
      top: 4px;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background: #5A8A70;
  }
  .control-radio input:disabled ~ .control_indicator:after {
      background: #7b7b7b;
  }
  
  .react-datepicker-popper {
    .react-datepicker {
      border-radius: 0;
      
      .react-datepicker__day--selected {
        background-color: ${COLORS.OIVA_GREEN};
      }
    }
  }
  
`

export const P = styled.p`
  font-weight: 100;
  font-size: 16px;
  line-height: 22px;
`

export const BackgroundImage = styled.div`
  height: 800px;
  width: 100vw;
  background: url(${background});
  background-size: cover;
  position: absolute;
  top: -450px;
  right: 0;
  opacity: 0.3;
  z-index: -1;
`

export const Leijona = styled.div`
  height: 110px;
  width: 300px;
  background: url(${leijona});
`