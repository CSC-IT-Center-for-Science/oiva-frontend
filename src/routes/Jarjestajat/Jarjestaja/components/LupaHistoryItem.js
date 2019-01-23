import React from 'react'
import Moment from 'react-moment'
import styled from 'styled-components'
import Media from 'react-media'

import { MEDIA_QUERIES } from "../../../../modules/styles"

import { API_BASE_URL } from "../../../../modules/constants"
import { Td, Tr } from "../../../../modules/Table"

const LupaText = styled.span`
  margin: 10px;
  
  @media ${MEDIA_QUERIES.MOBILE} {
    display: flex;
    flex-direction: column;
  }
`

const TextPartial = styled.span`
  margin-right: 10px;
`

const LupaHistoryItem = (props) => {
  const { filename, diaarinumero, voimassaoloalkupvm, voimassaololoppupvm, paatospvm } = props.lupaHistoria

  return (
    <a href={`${API_BASE_URL}/pebble/resources/liitteet/lupahistoria/${filename}`} target="_blank">
      <Media query={MEDIA_QUERIES.MOBILE} render={() =>
          <Tr>
            <LupaText>
              <TextPartial>Diaarinumero: {diaarinumero}</TextPartial>
              <TextPartial>
                Päätös tehty:&nbsp;
                <Moment format="DD.MM.YYYY">{paatospvm}</Moment>
              </TextPartial>
              {voimassaoloalkupvm === "2018-01-01" && voimassaololoppupvm === "2018-01-01"
                ? <TextPartial>Kumottu: <Moment format="DD.MM.YYYY">{voimassaololoppupvm}</Moment></TextPartial>
                : (
                  <TextPartial>Voimassa:&nbsp;
                    <Moment format="DD.MM.YYYY">{voimassaoloalkupvm}</Moment>
                    &nbsp;-&nbsp;
                    <Moment format="DD.MM.YYYY">{voimassaololoppupvm}</Moment>
                  </TextPartial>)
              }
            </LupaText>
          </Tr>
        } />
        <Media query={MEDIA_QUERIES.TABLET_MIN} render={() =>
          <div>
              {voimassaoloalkupvm === voimassaololoppupvm
              ?
                <Tr>
                  <Td>{diaarinumero}</Td>
                  <Td>
                    <Moment format="DD.MM.YYYY">{paatospvm}</Moment>
                  </Td>
                  <Td></Td>
                  <Td></Td>
                  <Td><Moment format="DD.MM.YYYY">{voimassaololoppupvm}</Moment></Td>
                </Tr>
              :
                <Tr>
                  <Td>{diaarinumero}</Td>
                  <Td>
                    <Moment format="DD.MM.YYYY">{paatospvm}</Moment>
                  </Td>
                  <Td>
                    <Moment format="DD.MM.YYYY">{voimassaoloalkupvm}</Moment>
                  </Td>
                  <Td>
                    <Moment format="DD.MM.YYYY">{voimassaololoppupvm}</Moment>
                  </Td>
                  <Td></Td>
                </Tr>
              }
            </div>
        } />
    </a>
  )
}



export default LupaHistoryItem
