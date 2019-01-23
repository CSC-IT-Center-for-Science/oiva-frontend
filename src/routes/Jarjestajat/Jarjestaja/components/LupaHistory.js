import _ from 'lodash'
import React, { Component } from 'react'
import Media from 'react-media'
import styled from 'styled-components'
import { Table, Thead, Tbody, Thn, Tr } from "../../../../modules/Table"
import { MEDIA_QUERIES } from "../../../../modules/styles"

import LupaHistoryItem from './LupaHistoryItem'
import Loading from '../../../../modules/Loading'

const WrapTable = styled.div`
   padding-bottom: 200px;
`

class LupaHistory extends Component {
  componentWillMount() {
    const { jarjestajaOid } = this.props

    if (jarjestajaOid) {
      this.props.fetchLupaHistory(jarjestajaOid)
    }
  }

  render() {
    const { fetched, isFetching, hasErrored, data } = this.props.lupaHistory

    if (fetched) {
      return (
        <WrapTable>
          <Media query={MEDIA_QUERIES.MOBILE} render={() =>
            <Table>
              <Tbody>
                {this.renderLupaHistoryList(data)}
              </Tbody>
            </Table>
          }/>
          <Media query={MEDIA_QUERIES.TABLET_MIN} render={() =>
            <Table>
              <Thead>
              <Tr>
                <Thn>Diaarinumero</Thn>
                <Thn>Päätöspvm</Thn>
                <Thn>Voimaantulopvm</Thn>
                <Thn>Päättymispvm</Thn>
                <Thn>Kumottu</Thn>
              </Tr>
              </Thead>
              <Tbody>
                {this.renderLupaHistoryList(data)}
              </Tbody>
            </Table>
          }/>
        </WrapTable>
      )
    } else if (isFetching) {
      return <Loading />
    } else if (hasErrored) {
      return <h2>Lupahistoriaa ladattaessa tapahtui virhe</h2>
    } else {
      return null
    }
  }

  renderLupaHistoryList(data) {
    data = _.orderBy(data, ['paatospvm'], ['desc']);
    return _.map(data, historyData => <LupaHistoryItem lupaHistoria={historyData} key={historyData.diaarinumero} />)

  }
}

export default LupaHistory
