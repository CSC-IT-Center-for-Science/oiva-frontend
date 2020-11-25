import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import common from "i18n/definitions/common";
import GetApp from "@material-ui/icons/GetApp";
import { map, addIndex, prepend, find, concat, isEmpty } from "ramda";
import { useIntl } from "react-intl";
import moment from "moment";
import { API_BASE_URL } from "modules/constants";
import { koulutustyypitMap } from "../../../../utils/constants";

/**
 * Function defines how to sort table rows.
 *
 * @param {object} rowA - Object that includes data of a single row.
 * @param {object} rowB - Object that includes data of a single row.
 * @param {string} orderBy - property of a row object (above).
 */
function descendingComparator(rowA, rowB, orderBy) {
  if (rowB[orderBy] < rowA[orderBy]) {
    return -1;
  }
  if (rowB[orderBy] > rowA[orderBy]) {
    return 1;
  }
  return 0;
}

/**
 * Comparator function for sorting the table ascending or descending.
 *
 * @param {string} order - Value is asc or desc.
 * @param {string} orderBy  - Column property name.
 */
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * Main function of table sorting.
 *
 * @param {array} array - Array of table rows.
 * @param {func} comparator - Comparator function.
 */
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

/**
 * Table's head component.
 *
 * @param {object} props - Object including different properties.
 */
function LupapaatoksetTableHead(props) {
  const { classes, headCells, order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className={classes.headRow}>
        {addIndex(map)(
          (headCell, index) => (
            <TableCell
              key={headCell.id}
              align={"left"}
              sortDirection={orderBy === headCell.id ? order : false}
              className={index === 0 ? classes.firstCol : ""}>
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}>
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ),
          headCells
        )}
      </TableRow>
    </TableHead>
  );
}

LupapaatoksetTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

/**
 * Table related styles.
 */
const useStyles = makeStyles(() => ({
  headRow: {
    height: "4.8125rem"
  },
  root: {
    width: "100%"
  },
  paper: {
    boxShadow: "none",
    width: "100%"
  },
  table: {
    minWidth: 750
  },
  firstCol: {
    paddingLeft: "1.875rem"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

/**
 * Main component: LupapaatoksetTable
 *
 * @param {array} param0 - Base data for table construction.
 */
export default function LupapaatoksetTable({
  koulutusmuoto,
  data,
  tulevatLuvat,
  voimassaOlevaLupa
}) {
  const intl = useIntl();
  const headCells = [
    {
      id: "diaarinumero",
      label: intl.formatMessage(common.lupaHistoriaDiaarinumeroHeading)
    },
    {
      id: "paatospvm",
      label: intl.formatMessage(common.lupaHistoriaPaatosDateHeading)
    },
    {
      id: "voimassaoloalkupvm",
      label: intl.formatMessage(common.lupaHistoriaStartDateHeading)
    },
    {
      id: "voimassaololoppupvm",
      label: intl.formatMessage(common.lupaHistoriaEndDateHeading)
    },
    {
      id: "paatoskirje",
      label: intl.formatMessage(common.paatoskirje),
      hidden: koulutusmuoto.koulutustyyppi === koulutustyypitMap.VAPAASIVISTYSTYO
    },
    {
      id: "jarjestamislupa",
      label: intl.formatMessage(koulutusmuoto.koulutustyyppi === koulutustyypitMap.VAPAASIVISTYSTYO ?
        common.yllapitamisLupaTitle : common.lupaTitle)
    },
    {
      id: "kumottu",
      label: intl.formatMessage(common.lupaHistoriaKumottuDateHeading),
      hidden: koulutusmuoto.koulutustyyppi === koulutustyypitMap.VAPAASIVISTYSTYO
    }
  ].filter(hc => !hc.hidden);

  const historicalRows = map(
    ({
      asianumero,
      diaarinumero,
      filename,
      kumottupvm,
      paatospvm,
      uuid,
      paatoskirje,
      voimassaoloalkupvm,
      voimassaololoppupvm
    }) => {
      return {
        diaarinumero: asianumero ? asianumero : diaarinumero,
        paatospvm,
        voimassaoloalkupvm,
        voimassaololoppupvm,
        urls: {
          jarjestamislupa: `${API_BASE_URL}/pdf/historia/${uuid}`,
          paatoskirje:
            paatoskirje && asianumero
              ? `${API_BASE_URL}/liitteet/${paatoskirje.uuid}/raw`
              : null
        },
        paatoskirje: paatoskirje && asianumero ? paatoskirje.nimi : null,
        jarjestamislupa: filename,
        kumottupvm
      };
    },
    data
  );

  /** Concatenate historical rows with present Lupa */
  const historicalRowsAndPresentRow = voimassaOlevaLupa
    ? prepend(getTableDataFromLupa(voimassaOlevaLupa, true), historicalRows)
    : historicalRows;

  /** Historical rows, present Lupa and future luvat concatenated */
  const rows = concat(
    map(tulevaLupa => getTableDataFromLupa(tulevaLupa), tulevatLuvat || []),
    historicalRowsAndPresentRow
  );

  function getTableDataFromLupa(lupa, voimassaoleva = false) {
    const paatoskirje = find(
      liite => liite.tyyppi === "paatosKirje",
      lupa.liitteet || []
    );
    return {
      diaarinumero: lupa.asianumero ? lupa.asianumero : lupa.diaarinumero,
      paatospvm: lupa.paatospvm,
      jarjestamislupa: lupa.asianumero ? lupa.asianumero : lupa.diaarinumero,
      urls: {
        jarjestamislupa: `${API_BASE_URL}/pdf/${lupa.uuid}`,
        paatoskirje:
          paatoskirje && lupa.asianumero
            ? `${API_BASE_URL}/liitteet/${paatoskirje.uuid}/raw`
            : null
      },
      paatoskirje: paatoskirje && lupa.asianumero ? paatoskirje.nimi : null,
      voimassaoloalkupvm: lupa.alkupvm,
      voimassaololoppupvm: lupa.loppupvm,
      voimassaoleva: voimassaoleva
        ? intl.formatMessage(common.voimassaoleva)
        : ""
    };
  }

  const classes = useStyles();
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("paatospvm");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [today] = React.useState(moment().startOf("day"));

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby={intl.formatMessage(common.lupapaatoksetTaulukko)}
            size={dense ? "small" : "medium"}
            aria-label={intl.formatMessage(common.lupapaatoksetTaulukko)}>
            <LupapaatoksetTableHead
              classes={classes}
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.diaarinumero)}
                      role="checkbox"
                      tabIndex={-1}
                      key={`row-${index}`}>
                      {headCells.some(hc => hc.id === "diaarinumero") && (
                        <TableCell
                          component="td"
                          id={labelId}
                          scope="row"
                          className={classes.firstCol}>
                          {row.diaarinumero}
                        </TableCell>
                      )}
                      {headCells.some(hc => hc.id === "paatospvm") && (
                        <TableCell align="left">
                          {row.paatospvm
                            ? moment(row.paatospvm).format("DD.MM.YYYY")
                            : null}
                        </TableCell>
                      )}
                      {headCells.some(hc => hc.id === "voimassaoloalkupvm") && (
                        <TableCell align="left">
                          {row.voimassaoloalkupvm
                            ? moment(row.voimassaoloalkupvm).format("DD.MM.YYYY")
                            : null}
                        </TableCell>
                      )}
                      {headCells.some(hc => hc.id === "voimassaololoppupvm") && (
                        <TableCell align="left">
                          {!isEmpty(row.voimassaoleva) && moment(row.voimassaoloalkupvm) <= today && moment(row.voimassaololoppupvm) >= today ? (
                            <span className="bg-green-250 p-2">
                            {row.voimassaoleva}
                          </span>
                          ) : (
                            row.voimassaololoppupvm && moment(row.voimassaololoppupvm).format("DD.MM.YYYY")
                          )}
                        </TableCell>
                      )}
                      {headCells.some(hc => hc.id === "paatoskirje") && (
                        <TableCell align="left">
                          {row.paatoskirje && <GetApp />}
                          {row.paatoskirje && (
                            <a
                              href={row.urls.paatoskirje}
                              className="ml-2 underline">
                              {intl.formatMessage(common.paatoskirjeDownload)}
                            </a>
                          )}
                        </TableCell>
                      )}
                      {headCells.some(hc => hc.id === "jarjestamislupa") && (
                        <TableCell align="left">
                          <GetApp />
                          <a
                            href={row.urls.jarjestamislupa}
                            className="ml-2 underline">
                            {intl.formatMessage(koulutusmuoto.koulutustyyppi === koulutustyypitMap.VAPAASIVISTYSTYO ?
                              common.yllapitamislupaDownload : common.jarjestamislupaDownload)}
                          </a>
                        </TableCell>
                      )}
                      {headCells.some(hc => hc.id === "kumottu") && (
                        <TableCell align="left">
                          {row.kumottupvm
                            ? moment(row.kumottupvm).format("DD.MM.YYYY")
                            : ""}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          labelDisplayedRows={({ from, to, count }) => {
            return `${intl.formatMessage(
              common.rows
            )} ${from} - ${to} / ${count}`;
          }}
          labelRowsPerPage={intl.formatMessage(common.rowsPerPage)}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
