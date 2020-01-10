import React, { Component } from 'react'
import Media from 'react-media'
import { Link } from 'react-router-dom'

import { Table, Thead, Tbody, Th, Tr } from "../../../modules/Table"
import { MEDIA_QUERIES, COLORS, FONT_STACK } from "../../../modules/styles"

import ReactTable from 'react-table'
import 'react-table/react-table.css'
import '../../../modules/Header/react-table-overrides.css'
import styled from 'styled-components'
import { parseLocalizedField } from "../../../modules/helpers"
import Moment from 'react-moment'
import { ASIAT } from "../modules/constants"

const TableHeader = styled.div`
    font-weight: normal;
    padding: 8px 18px;
    color: ${COLORS.WHITE};
    background: ${COLORS.OIVA_TABLE_BG_COLOR};
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
    border: 2px solid ${COLORS.OIVA_GREEN};
    text-align:center;
`

class ValmistelussaAsiatList extends Component {

    render() {
        const { muutospyynnot } = this.props

        const columns = [{
            Header: props => <TableHeader>{ASIAT.LISTAT.COLUMN_KOULUTUKSEN_JARJESTAJA.FI}</TableHeader>,
            accessor: 'jarjestaja.nimi.fi',
            width:200,
            Cell: props => <TableCell>{props.value}</TableCell>
        }, {
            Header: props => <TableHeader>{ASIAT.LISTAT.COLUMN_SAAPUNUT.FI}</TableHeader>,
            accessor: 'hakupvm',
            Cell: props => <TableCell><Moment format="D.M.YYYY">{props.value}</Moment></TableCell>
        }, {
            Header: props => <TableHeader>{ASIAT.LISTAT.COLUMN_HAKUKIERROS.FI}</TableHeader>,
            accessor: 'paatoskierros.alkupvm',
            Cell: props => <TableCell><Moment format="MM/YYYY">{props.value}</Moment></TableCell>
        }, {
            Header: props => <TableHeader>{ASIAT.LISTAT.COLUMN_ESITTELIJA.FI}</TableHeader>,
            accessor: 'paivittaja',
            Cell: props => <TableCell>{props.value}</TableCell>
        }, {
            Header: props => <TableHeader>{ASIAT.LISTAT.COLUMN_MAAKUNTA.FI}</TableHeader>,
            accessor: 'jarjestaja.maakuntaKoodi.metadata',
            Cell: props => <TableCell>{parseLocalizedField(props.value, 'FI', 'nimi')}</TableCell>
        }, {
            Header: props => <TableHeader>{ASIAT.LISTAT.COLUMN_TILA.FI}</TableHeader>,
            accessor: 'uuid',
            width:190,
            Cell: props => <TableCellLink><Link exact={true} uuid={props.value} to={{pathname: "/asiat/valmistelu/" + props.value, uuid: props.value}}>{ASIAT.LISTAT.COLUMN_VALMISTELUUN.FI} &#187;</Link></TableCellLink>
        }]


        if (muutospyynnot && muutospyynnot.length > 0) {
            return (
                <div>
                    <Media query={MEDIA_QUERIES.MOBILE} render={() =>
                        // TODO: mobile version
                        <ReactTable
                            defaultPageSize={5}
                            data={muutospyynnot}
                            columns={columns}
                            previousText={ASIAT.SIVUTUS.EDELLINEN.FI}
                            nextText={ASIAT.SIVUTUS.SEURAAVA.FI}
                            loadingText={ASIAT.SIVUTUS.LADATAAN.FI}
                            noDataText={ASIAT.SIVUTUS.EI_TIETOJA.FI}
                            pageText={ASIAT.SIVUTUS.SIVU.FI}
                            ofText={' / '}
                            rowsText={ASIAT.SIVUTUS.RIVI.FI}/>
                    }/>
                    <Media query={MEDIA_QUERIES.TABLET_MIN} render={() =>
                        <ReactTable
                            defaultPageSize={5}
                            data={muutospyynnot}
                            columns={columns}
                            previousText={ASIAT.SIVUTUS.EDELLINEN.FI}
                            nextText={ASIAT.SIVUTUS.SEURAAVA.FI}
                            loadingText={ASIAT.SIVUTUS.LADATAAN.FI}
                            noDataText={ASIAT.SIVUTUS.EI_TIETOJA.FI}
                            pageText={ASIAT.SIVUTUS.SIVU.FI}
                            ofText={' / '}
                            rowsText={ASIAT.SIVUTUS.RIVI.FI}/>
                    }/>
                </div>
            )
        } else {
            return (
                <div>{ASIAT.OTSIKOT.EI_MUUTOSPYYNTOJA}</div>
            )
        }
    }
}

export default ValmistelussaAsiatList