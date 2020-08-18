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
import common from "../../i18n/definitions/common";
import { map, addIndex, find, propEq, head, values, toUpper } from "ramda";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";

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
function JarjestajaluetteloHead(props) {
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

JarjestajaluetteloHead.propTypes = {
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
 * Main component: Jarjestajaluettelo
 *
 * @param {array} param0 - Base data for table construction.
 */
export default function Jarjestajaluettelo({ luvat }) {
  const intl = useIntl();
  const navigate = useNavigate();
  const headCells = [
    {
      id: "nimi",
      label: intl.formatMessage(common.jarjestaja)
    },
    {
      id: "maakunta",
      label: intl.formatMessage(common.homeCounty)
    }
  ];

  const rows = map(({ jarjestaja }) => {
    const localeUpper = toUpper(intl.locale);
    return {
      nimi: jarjestaja.nimi[intl.locale] || head(values(jarjestaja.nimi)),
      maakunta: (
        find(propEq("kieli", localeUpper), jarjestaja.maakuntaKoodi.metadata) ||
        {}
      ).nimi,
      ytunnus: jarjestaja.ytunnus
    };
  }, luvat);

  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("nimi");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = ytunnus => {
    navigate(`${ytunnus}/jarjestamislupa`);
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
    <div className="mx-auto w-full sm:w-3/4 mb-16">
      <h1>{intl.formatMessage(common.ammatillisenKoulutuksenJarjestajat)}</h1>
      <p className="my-4">
        {intl.formatMessage(common.voimassaOlevatJarjestamisluvat, {
          amount: luvat.length
        })}
      </p>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby={intl.formatMessage(common.jarjestajaluettelo)}
              size={dense ? "small" : "medium"}
              aria-label={intl.formatMessage(common.jarjestajaluettelo)}>
              <JarjestajaluetteloHead
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
                    return (
                      <TableRow
                        hover
                        onClick={() => handleClick(row.ytunnus)}
                        tabIndex={0}
                        key={`row-${index}`}
                        className="cursor-pointer">
                        <TableCell
                          component="td"
                          id={row.nimi}
                          scope="row"
                          className={classes.firstCol}>
                          {row.nimi}
                        </TableCell>
                        <TableCell id={row.maakunta} align="left">
                          {row.maakunta}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={2} />
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
    </div>
  );
}
