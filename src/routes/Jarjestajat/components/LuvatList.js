import _ from 'lodash'
import React, { Component } from 'react'
import Media from 'react-media'

import LupaItem from './LupaItem'
import { Table, Thead, Tbody, Th, Tr } from "../../../modules/Table"
import { MEDIA_QUERIES } from "../../../modules/styles"
import styled from 'styled-components'
import { parseLocalizedField } from "../../../modules/helpers"
import { MdArrowUpward, MdArrowDownward } from 'react-icons/md';


const WrapTable = styled.div`
  width: 100%;
`

class LuvatList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortedBy: "jarjestaja",
      desc1: false,
      desc2: false,
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

    if ((this.state.sortedBy === "jarjestaja" && !this.state.desc1) || (this.state.sortedBy === "maakunta" && !this.state.desc2))
      return _.map(sorted, lupa => <LupaItem lupa={lupa} key={lupa.uuid} />)
    else
      return _.map(sorted.reverse(), lupa => <LupaItem lupa={lupa} key={lupa.uuid} />)
  }

  sort = col => {
    if (col==="jarjestaja") {
      if (this.state.sortedBy==="jarjestaja")
        this.setState( {desc1: !this.state.desc1});
      else { 
        this.setState( {sortedBy: "jarjestaja"});
      }

    } else {
      if (this.state.sortedBy==="maakunta")
        this.setState( {desc2: !this.state.desc2});
      else {
        this.setState( {sortedBy: "maakunta"});
      }
    }

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
                onClick={() =>  this.sort("jarjestaja")}
                >
                Koulutuksen järjestäjä
                { this.state.sortedBy === "jarjestaja" && !this.state.desc1 && <MdArrowUpward /> }
                { this.state.sortedBy === "jarjestaja" && this.state.desc1 && <MdArrowDownward />}
              </Th>
              <Th 
                onClick={() =>  this.sort("maakunta")}
                >
                Kotipaikan maakunta
                { this.state.sortedBy === "maakunta" && !this.state.desc2 && <MdArrowUpward />  }
                { this.state.sortedBy === "maakunta" && this.state.desc2 && <MdArrowDownward /> }
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
