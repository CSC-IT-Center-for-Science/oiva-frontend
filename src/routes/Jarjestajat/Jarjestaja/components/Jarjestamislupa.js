import React, { Component } from 'react'
import styled from 'styled-components'
import Moment from 'react-moment'
import { withRouter } from 'react-router-dom'

import LupaSection from './LupaSection'

import { LUPA_SECTIONS } from "../modules/constants"
import { InnerContentContainer, InnerContentWrapper  } from "../../../../modules/elements"
import { COLORS } from "../../../../modules/styles"

import { LUPA_LISAKOULUTTAJAT } from "../../modules/constants"

const TopSectionWrapper = styled.div`
  padding: 5px 30px;
  margin: 0 -30px;
  border-bottom: 1px solid ${COLORS.BORDER_GRAY};
`

const H2 = styled.h2`
  margin: 0 30px 24px 30px;
`

const LupaDetailsWrapper = styled.div`
  margin: 45px auto;
`

const Row = styled.div`
  display: flex;
  align-items: flex-end;
  margin: 8px 0;
  
  a {
    display: flex;
    align-items: flex-end;
  }
`

class Jarjestamislupa extends Component {
  render() {
    const { jarjestajaYtunnus } = this.props.lupa.data
    const { kohteet } = this.props.lupa

    // Luvan poikkeuskäsittely erikoisluville (17kpl)
    const lupaException = LUPA_LISAKOULUTTAJAT[jarjestajaYtunnus]

    return (
      <InnerContentContainer>
        <InnerContentWrapper>

            {lupaException ?
              <TopSectionWrapper>
                <H2>Ajantasainen järjestämislupa</H2>
              </TopSectionWrapper>
              :
              <TopSectionWrapper>
                <H2>Ajantasainen järjestämislupa (<Moment format="DD.MM.YYYY"></Moment>)</H2>
              </TopSectionWrapper>
            }

          {lupaException ? '' :
            <LupaDetailsWrapper>
              {Object.keys(LUPA_SECTIONS).map((k, i) =>
                <LupaSection
                  kohde={kohteet[k]}
                  ytunnus={jarjestajaYtunnus}
                  key={i}
                />
              )}
            </LupaDetailsWrapper>
          }

        </InnerContentWrapper>
      </InnerContentContainer>
    )
  }
}

export default withRouter(Jarjestamislupa)
