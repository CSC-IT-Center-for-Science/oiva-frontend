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
  const { filename, diaarinumero, voimassaoloalkupvm, voimassaololoppupvm, paatospvm, uuid, kumottupvm } = props.lupaHistoria
  let path = `/pebble/resources/liitteet/lupahistoria/${filename}`;
  if(voimassaololoppupvm.split("-").join("") > "20181230") {
    path = `/pdf/${uuid}`;
  }

  const showValidityDates = !kumottupvm || kumottupvm >= voimassaoloalkupvm;

  return (
    <a href={`${API_BASE_URL}${path}`} target="_blank">
      <Media query={MEDIA_QUERIES.MOBILE} render={() =>
          <Tr>
              <LupaText>
                  <TextPartial>Diaarinumero: {diaarinumero}</TextPartial>
                  <TextPartial>
                      Päätös tehty:&nbsp;
                      <Moment format="DD.MM.YYYY">{paatospvm}</Moment>
                  </TextPartial>
                  {showValidityDates
                      ? <TextPartial>Voimassa:&nbsp;
                            <Moment format="DD.MM.YYYY">{voimassaoloalkupvm}</Moment>
                            &nbsp;-&nbsp;
                            <Moment format="DD.MM.YYYY">{voimassaololoppupvm}</Moment>
                        </TextPartial>
                      : <TextPartial>Kumottu: <Moment format="DD.MM.YYYY">{kumottupvm}</Moment></TextPartial> }
              </LupaText>
          </Tr>
        } />
        <Media query={MEDIA_QUERIES.TABLET_MIN} render={() =>
          <div>
            <Tr>
              <Td>{diaarinumero}</Td>
              <Td>
                <Moment format="DD.MM.YYYY">{paatospvm}</Moment>
              </Td>
              <Td>
                  { showValidityDates && <Moment format="DD.MM.YYYY">{voimassaoloalkupvm}</Moment> }
              </Td>
              <Td>
                  { showValidityDates && <Moment format="DD.MM.YYYY">{voimassaololoppupvm}</Moment> }
              </Td>
              <Td>
                  { !showValidityDates && <Moment format="DD.MM.YYYY">{kumottupvm}</Moment> }
              </Td>
            </Tr>
            </div>
        } />
    </a>
  )
}



export default LupaHistoryItem
