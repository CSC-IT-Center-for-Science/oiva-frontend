import _ from 'lodash'
import React, { Component } from 'react'
import Media from 'react-media'

import LupaItem from './LupaItem'
import { Table, Thead, Tbody, Th, Tr } from "../../../modules/Table"
import { MEDIA_QUERIES } from "../../../modules/styles"
import styled from 'styled-components'
import { parseLocalizedField } from "../../../modules/helpers"

const WrapTable = styled.div`
  padding-bottom: 200px;
  widht: 100%;
`

class LuvatList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortedBy: "jarjestaja"
    };
  }

  renderPermits() {
    const sorted = _.sortBy(this.props.luvat, (lupa) => {
      if (this.state.sortedBy === "maakunta")
          return parseLocalizedField(lupa.jarjestaja.maakuntaKoodi.metadata)
      else if (lupa.jarjestaja)
          return lupa.jarjestaja.nimi.fi || lupa.jarjestaja.nimi.sv
      return null
    })

    return _.map(sorted, lupa => <LupaItem lupa={lupa} key={lupa.uuid} />)
  }

  render() {
    return (
      <WrapTable>
        <Media query={MEDIA_QUERIES.MOBILE} render={() =>
          <Table>
            <Thead>
            <Tr>
              <Th>Voimassa olevat luvat</Th>
            </Tr>
            </Thead>
            <Tbody>
              {this.renderPermits()}
            </Tbody>
          </Table>
        }/>
        <Media query={MEDIA_QUERIES.TABLET_MIN} render={() =>
          <Table>
            <Thead>
            <Tr>
              <Th flex="4" 
                onClick={() => this.setState({sortedBy: 'jarjestaja'})}
                >
                Koulutuksen järjestäjä
                { this.state.sortedBy === "jarjestaja" && " ^" }
              </Th>
              <Th onClick={() => this.setState({sortedBy: 'maakunta'})}
                >
                Kotipaikan maakunta
                { this.state.sortedBy === "maakunta" && " ^" }
              </Th>
            </Tr>
            </Thead>
            <Tbody>
              {this.renderPermits()}
            </Tbody>
          </Table>
        }/>
      </WrapTable>
    )
  }
}

export default LuvatList
