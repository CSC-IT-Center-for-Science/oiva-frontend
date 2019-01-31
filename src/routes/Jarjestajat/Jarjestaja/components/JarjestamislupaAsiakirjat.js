import _ from 'lodash'
import React, { Component } from 'react'
import Media from 'react-media'
import styled from 'styled-components'
import { Table, Thead, Tbody, Thn, Trn, ThButton } from "../../../../modules/Table"
import { MEDIA_QUERIES } from "../../../../modules/styles"
import { LUPA_TEKSTIT } from "../../../Jarjestajat/Jarjestaja/modules/constants"
import JarjestamislupaAsiakirjatItem from './JarjestamislupaAsiakirjatItem'
import Loading from '../../../../modules/Loading'
import { LUPA_EXCEPTIONS } from '../../modules/constants';

const WrapTable = styled.div`
   padding-bottom: 200px;
`
class JarjestamislupaAsiakirjat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      opened: 0
    };
  }

  componentWillMount() {
    const { jarjestajaOid } = this.props

    if (jarjestajaOid) {
      this.props.fetchLupaHistory(jarjestajaOid)
    }
  }

  setOpened = dnro => {
    this.setState({opened: dnro});
  }

  render() {
    const { fetched, isFetching, hasErrored, data } = this.props.lupaHistory
    if (fetched) {
      return (
        <WrapTable>
          <Media query={MEDIA_QUERIES.MOBILE} render={() =>
            <Table>
              <Tbody>
                {this.renderJarjestamislupaAsiatList(data)}
              </Tbody>
            </Table>
          }/>
          <Media query={MEDIA_QUERIES.TABLET_MIN} render={() =>
            <Table>
              <Thead>
              <Trn>
                <Thn flex="2">{LUPA_TEKSTIT.ASIAT.ASIATKIRJAT_TAULUKKO.ASIAKIRJA.FI}</Thn>
                <Thn flex="2">{LUPA_TEKSTIT.ASIAT.ASIATKIRJAT_TAULUKKO.TILA.FI}</Thn>
                <Thn flex="3">{LUPA_TEKSTIT.ASIAT.ASIATKIRJAT_TAULUKKO.LAATIJA.FI}</Thn>
                <Thn flex="2">{LUPA_TEKSTIT.ASIAT.ASIATKIRJAT_TAULUKKO.VALMIS.FI}</Thn>
                <ThButton></ThButton>
                <ThButton></ThButton>
              </Trn>
              </Thead>
              <Tbody>
                {this.renderJarjestamislupaAsiatList(data)}
              </Tbody>
            </Table>
          }/>
        </WrapTable>
      )
    } else if (isFetching) {
      return <Loading />
    } else if (hasErrored) {
      return <h2>{LUPA_EXCEPTIONS}</h2>
    } else {
      return null
    }
  }

  renderJarjestamislupaAsiatList = data => {
    data = _.orderBy(data, ['paatospvm'], ['desc']);
    return _.map(data, historyData => <JarjestamislupaAsiakirjatItem lupaHistoria={historyData} key={historyData.diaarinumero} setOpened={this.setOpened}/>)

  }
}

export default JarjestamislupaAsiakirjat
