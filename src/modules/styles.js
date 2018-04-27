/**
 * Tässä tiedostossa:
 *
 * 1) Määritetään applikaatiolle globaalit tyylit
 * 2) Määritetään tyylielementtejä (värit jne.) joita käytetään komponenteissa
 * 3) Määritetään styled-components komponentteja, joita voidaan käyttää applikaatiossa
 */

import styled, { injectGlobal } from 'styled-components'

import background from 'static/images/palikat.png'

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
  BG_DARKER_GRAY: '#e6e6e6'
}

export const FONT_STACK = {
  GOTHAM_NARROW: `"Gotham Narrow", Helvetica, Arial, sans-serif`,
  GOTHAM_NARROW_BOLD: `"Gotham Narrow Bold", Helvetica, Arial, sans-serif`,
  OPEN_SANS_REGULAR: `"Open Sans", Helvetica, Arial, sans-serif`,
  OPEN_SANS_SEMIBOLD: `"Open Sans", Helvetica, Arial, sans-serif`,
  PT_SANS_NARROW: `"PT Sans Narrow", "Open Sans", Helvetica, Arial, sans-serif`,
  SOURCE_SANS: `"Source Sans", "Open Sans", Helvetica, Arial, sans-serif`
}

export const APP_WIDTH = 1030

// Media query breakpointit
export const MEDIA_QUERIES = {
  MOBILE: 'only screen and (min-width: 360px) and (max-width: 767px)',
  TABLET: 'only screen and (min-width: 768px) and (max-width: 1023px)',
  TABLET_MIN: 'only screen and (min-width: 768px)',
  DESKTOP_NORMAL: 'only screen and (min-width: 1024px) and (max-width: 1279px)',
  DESKTOP_LARGE: 'only screen and (min-width: 1280px)'
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
    background: ${COLORS.OIVA_GREEN};
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
