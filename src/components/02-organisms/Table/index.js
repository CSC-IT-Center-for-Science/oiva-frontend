import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "./TableRow/index";
import TableCell from "./TableCell/index";
import { sortObjectsByProperty } from "../../../utils/common";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import MaterialUITable from "@material-ui/core/Table";
import { makeStyles } from "@material-ui/core/styles";
import {
  addIndex,
  assocPath,
  findIndex,
  is,
  map,
  path,
  prop,
  propEq,
  reverse,
  sort
} from "ramda";

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

const defaultValues = {
  level: 0,
  sortedBy: {},
  structure: []
};

/**
 *
 * @param {object} props - Properties object.
 * @param {object} props.structure - Structure of the table.
 * @param {level} props.level - Level of unnested table is 0.
 * @param {object} props.sortedBy - Default sorting configuration.
 * @param {number} props.sortedBy.columnIndex - Column index.
 * @param {string} props.order - Valid values: asc, desc.
 */
const Table = ({
  structure = defaultValues.structure,
  level = defaultValues.level,
  sortedBy = defaultValues.sortedBy
}) => {
  const classes = useStyles();

  const [sortingHistory, setSortingHistory] = useState({});

  // This is for sorting the rows.
  const orderSwap = {
    asc: "desc",
    desc: "asc"
  };

  /**
   * The rows of the tbody section are sorted according to this.
   * Here you can see the default settings.
   **/

  const [orderOfBodyRows, setOrderOfBodyRows] = useState({
    columnIndex: is(Number, sortedBy.columnIndex) ? sortedBy.columnIndex : 0,
    order: sortedBy.order || "asc"
  });

  /**
   * Sorting function.
   */
  const sortedStructure = useMemo(() => {
    setSortingHistory(prevValue => ({
      ...prevValue,
      [orderOfBodyRows.columnIndex]: orderOfBodyRows.order
    }));
    const indexOfTbody = findIndex(propEq("role", "tbody"), structure);
    if (indexOfTbody >= 0) {
      const rowsPath = [indexOfTbody, "rowGroups", 0, "rows"];
      // ASC sorting is happening here.
      const sorted = sort((a, b) => {
        return sortObjectsByProperty(a, b, [
          "cells",
          orderOfBodyRows.columnIndex,
          "text"
        ]);
      }, path(rowsPath, structure) || []);
      // If user wants to sort by descending order the sorted array will be reversed.
      const updatedStructure = assocPath(
        rowsPath,
        orderOfBodyRows.order === "asc" ? sorted : reverse(sorted),
        structure
      );
      return updatedStructure;
    }
    return structure;
  }, [orderOfBodyRows, structure]);

  /**
   * There are rows in the table's structure object. One of those rows are
   * passed to this function as a parameter and its callback function will
   * be called.
   * @param {string} action - Identifier for the executed action.
   * @param {object} row - Includes cells and other row related data.
   */
  function onRowClick(action, row) {
    if (row.onClick) {
      /**
       * User can define actions in table's structure object. Actions are
       * used later to run the correct operations for the action related row.
       * Handling actions happens outside of the Table component.
       **/
      row.onClick(row, action);
    }
  }

  /**
   *
   * @param {string} action - Custom text string.
   * @param {object} properties - Contains cell related properties.
   * @param {number} properties.columnIndex - Index of the clicked column.
   * @param {object} properties.row - Row that contains the clicked cell.
   */
  function onCellClick(action, { columnIndex, row }) {
    // Sort action is handled inside the Table component.
    if (action === "sort") {
      setOrderOfBodyRows(prevState => {
        let order = prop(prevState.order, orderSwap);
        if (prevState.columnIndex !== columnIndex) {
          order = sortingHistory[columnIndex] || "asc";
        }
        return { columnIndex: columnIndex, order };
      });
    } else {
      /**
       * Cell related actions are expanded to row level. This can change
       * later if cell click related callbacks are needed.
       **/
      onRowClick(action, row);
    }
  }

  /**
   * Forms the table rows and nested Table components.
   * @param {object} part - Object of the structure array.
   * @param {string} part.role - E.g. thead, tbody...
   * @param {array} part.rowGroups - Array of rowgroup objects.
   * @param {array} rows - Array of row objects.
   */
  const getRowsToRender = (part, rows = []) => {
    const ParentOfRow = part.role === "thead" ? TableHead : TableBody;
    const jsx = (
      <ParentOfRow key={Math.random()}>
        {addIndex(map)((row, iii) => {
          return (
            <TableRow
              key={`row-${iii}`}
              row={row}
              onClick={onRowClick}
              tableLevel={level}
            >
              {addIndex(map)((cell, iiii) => {
                return (
                  <TableCell
                    columnIndex={iiii}
                    isHeaderCell={part.role === "thead"}
                    key={`cell-${iiii}`}
                    onClick={onCellClick}
                    orderOfBodyRows={orderOfBodyRows}
                    properties={cell}
                    row={row}
                  />
                );
              }, row.cells || [])}
            </TableRow>
          );
        }, rows)}
      </ParentOfRow>
    );
    return jsx;
  };

  /**
   * Starting point of table creation. Structure will be walked through and table's
   * different parts will be created.
   */
  const table = addIndex(map)((part, i) => {
    return (
      <React.Fragment key={i}>
        {map(rowGroup => {
          return getRowsToRender(part, rowGroup.rows);
        }, part.rowGroups || [])}
      </React.Fragment>
    );
  }, sortedStructure);

  // The table will is rendered.
  return (
    <TableContainer component={Paper}>
      <MaterialUITable className={classes.table} aria-label="simple table">
        {table}
      </MaterialUITable>
    </TableContainer>
  );
};

Table.propTypes = {
  level: PropTypes.number,
  sortedBy: PropTypes.object,
  // Defines the structure of table.
  structure: PropTypes.array.isRequired
};

export default Table;
