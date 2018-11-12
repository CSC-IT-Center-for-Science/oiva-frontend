import React, { Component } from 'react'
import Media from 'react-media'
import Moment from 'react-moment'
import { withRouter, Link } from 'react-router-dom'

import { MEDIA_QUERIES, COLORS, FONT_STACK } from "../../../../../modules/styles"

import ReactTable from 'react-table'
import 'react-table/react-table.css'
import '../../../../../modules/Header/react-table-overrides.css'
import styled from 'styled-components'

const TableHeader = styled.div`
    font-weight: normal;
    padding: 8px 18px;
    color: ${COLORS.WHITE};
    background: ${COLORS.OIVA_GREEN};
    font-family: ${FONT_STACK.GOTHAM_NARROW};
    font-size: 13px;
    position: relative;
    text-align: left;
    margin:0px;
`

const TableCell = styled.div`
    font-weight: normal;
    padding: 10px 20px;
    white-space: normal;
`
const TableCellLink = styled.div`
    font-weight: normal;
    padding: 10px 20px;
    white-space: normal;
    color:#5A8A70;
`


class MuutospyynnotList extends Component {

  render() {
    const { muutospyynnot } = this.props

    const columns = [{
        Header: props => <TableHeader>Tila</TableHeader>,
        accessor: 'tila',
        Cell: props => <TableCell>{props.value}</TableCell>
      }, {
        Header: props => <TableHeader>Valmistelija</TableHeader>,
        accessor: 'luoja',
        Cell: props => <TableCell>{props.value}</TableCell>
      }, {
        Header: props => <TableHeader>Aloitettu</TableHeader>,
        accessor: 'luontipvm',
        Cell: props => <TableCell><Moment format="DD.MM.YYYY">{props.value}</Moment></TableCell> // Custom cell components!
      }, {
        Header: props => <TableHeader>Muokattu</TableHeader>,
        accessor: 'paivityspvm',
        Cell: props => <TableCell><Moment format="DD.MM.YYYY">{props.value}</Moment></TableCell> // Custom cell components!
      }, {
        Header: props => <TableHeader>Hakupvm</TableHeader>,
        accessor: 'hakupvm',
        Cell: props => <TableCell><Moment format="DD.MM.YYYY">{props.value}</Moment></TableCell> // Custom cell components!
      },
      {
        Header: props => <TableHeader>Avaa</TableHeader>,
        accessor: 'uuid',
        Cell: props => <TableCellLink><Link uuid={props.value} to={{pathname: "hakemukset-ja-paatokset/" + props.value, uuid: props.value}}>avaa ></Link></TableCellLink> // Custom cell components!
      }
    ]

    if (muutospyynnot && muutospyynnot.length > 0) {
      return (

          // TODO: mobile version of react table
        <div>
          <Media query={MEDIA_QUERIES.MOBILE} render={() =>
              <ReactTable
                  defaultPageSize={5}
                  data={muutospyynnot}
                  previousText={'Edellinen'}
                  nextText={'Seuraava'}
                  loadingText={'Ladataan...'}
                  noDataText={'Tietoja ei löytynyt'}
                  pageText={'Sivu'}
                  ofText={' / '}
                  rowsText={'riviä'}
                  columns={columns}/>
          }/>
          <Media query={MEDIA_QUERIES.TABLET_MIN} render={() =>
              <ReactTable
                  defaultPageSize={5}
                  data={muutospyynnot}
                  previousText={'Edellinen'}
                  nextText={'Seuraava'}
                  loadingText={'Ladataan...'}
                  noDataText={'Tietoja ei löytynyt'}
                  pageText={'Sivu'}
                  ofText={' / '}
                  rowsText={'riviä'}
                  columns={columns}/>
          }/>
        </div>
      )
    } else {
      return (
        <div>Ei muutospyyntöjä</div>
      )
    }
  }
}

export default MuutospyynnotList