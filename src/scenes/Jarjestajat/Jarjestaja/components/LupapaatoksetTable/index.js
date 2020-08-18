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
import common from "../../../../../i18n/definitions/common";
import Attachment from "@material-ui/icons/Attachment";
import { map, addIndex } from "ramda";
import { useIntl } from "react-intl";
import moment from "moment";
import { API_BASE_URL } from "modules/constants";

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
export default function LupapaatoksetTable({ data }) {
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
      label: intl.formatMessage(common.paatoskirje)
    },
    {
      id: "jarjestamislupa",
      label: intl.formatMessage(common.lupaTitle)
    },
    {
      id: "kumottu",
      label: intl.formatMessage(common.lupaHistoriaKumottuDateHeading)
    }
  ];

  const rows = map(
    ({
      diaarinumero,
      filename,
      kumottu,
      paatospvm,
      uuid,
      voimassaoloalkupvm,
      voimassaololoppupvm
    }) => {
      return {
        diaarinumero,
        paatospvm,
        voimassaoloalkupvm,
        voimassaololoppupvm,
        urls: {
          jarjestamislupa: `${API_BASE_URL}/pdf/historia/${uuid}`
        },
        paatoskirje: "[linkki tähän, kun tieto saatavilla]",
        jarjestamislupa: `${filename} (PDF ${Math.round(
          Math.random() * 100
        )} KB)`,
        kumottu
      };
    },
    data
  );

  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("diaarinumero");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
                      key={row.diaarinumero}>
                      <TableCell
                        component="td"
                        id={labelId}
                        scope="row"
                        className={classes.firstCol}>
                        {row.diaarinumero}
                      </TableCell>
                      <TableCell align="left">
                        {moment(row.paatospvm).format("DD.MM.YYYY")}
                      </TableCell>
                      <TableCell align="left">
                        {moment(row.voimassaoloalkupvm).format("DD.MM.YYYY")}
                      </TableCell>
                      <TableCell align="left">
                        {moment(row.voimassaololoppupvm).format("DD.MM.YYYY")}
                      </TableCell>
                      <TableCell align="left">
                        <Attachment />
                        <span className="ml-2">{row.paatoskirje}</span>
                      </TableCell>
                      <TableCell align="left">
                        <Attachment />
                        <a
                          href={row.urls.jarjestamislupa}
                          className="ml-2 underline">
                          {row.jarjestamislupa}
                        </a>
                      </TableCell>
                      <TableCell align="left">{row.kumottu}</TableCell>
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
