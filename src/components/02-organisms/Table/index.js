import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import TableCell from "./TableCell";
import TableRow from "./TableRow";
import RowGroup from "./RowGroup";
import { sortObjectsByProperty } from "../../../utils/common";
import * as R from "ramda";

/**
 *
 * @param {object} props - Properties object.
 * @param {object} props.structure - Structure of the table.
 * @param {level} props.level - Level of unnested table is 0.
 * @param {object} props.sortedBy - Default sorting configuration.
 * @param {number} props.sortedBy.columnIndex - Column index.
 * @param {string} props.order - Valid values: ascending, descending.
 */
const Table = ({ structure, level = 0, sortedBy = {} }) => {
  const [sortingHistory, setSortingHistory] = useState({});

  // This is for sorting the rows.
  const orderSwap = {
    ascending: "descending",
    descending: "ascending"
  };

  /**
   * The rows of the tbody section are sorted according to this.
   * Here you can see the default settings.
   **/

  const [orderOfBodyRows, setOrderOfBodyRows] = useState({
    columnIndex: R.is(Number, sortedBy.columnIndex) ? sortedBy.columnIndex : 0,
    order: sortedBy.order || "ascending"
  });

  /**
   * Sorting function.
   */
  const sortedStructure = useMemo(() => {
    setSortingHistory(prevValue => ({
      ...prevValue,
      [orderOfBodyRows.columnIndex]: orderOfBodyRows.order
    }));
    const indexOfTbody = R.findIndex(R.propEq("role", "tbody"), structure);
    if (indexOfTbody >= 0) {
      const rowsPath = [indexOfTbody, "rowGroups", 0, "rows"];
      // ASC sorting is happening here.
      const sorted = R.sort((a, b) => {
        return sortObjectsByProperty(a, b, [
          "cells",
          orderOfBodyRows.columnIndex,
          "text"
        ]);
      }, R.path(rowsPath, structure) || []);
      // If user wants to sort by descending order the sorted array will be reversed.
      const updatedStructure = R.assocPath(
        rowsPath,
        orderOfBodyRows.order === "ascending" ? sorted : R.reverse(sorted),
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
        let order = R.prop(prevState.order, orderSwap);
        if (prevState.columnIndex !== columnIndex) {
          order = sortingHistory[columnIndex] || "ascending";
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
    const jsx = R.addIndex(R.map)((row, iii) => {
      return (
        <React.Fragment key={iii}>
          <TableRow
            key={`row-${iii}`}
            row={row}
            onClick={onRowClick}
            tableLevel={level}>
            {R.addIndex(R.map)((cell, iiii) => {
              return (
                <TableCell
                  columnIndex={iiii}
                  isHeaderCell={part.role === "thead"}
                  isOnLastRow={iii === rows.length - 1}
                  key={`cell-${iiii}`}
                  onClick={onCellClick}
                  orderOfBodyRows={orderOfBodyRows}
                  properties={cell}
                  row={row}
                  tableLevel={level}>
                  {cell.table && (
                    // Nested table is created here.
                    <Table level={level + 1} structure={cell.table}></Table>
                  )}
                </TableCell>
              );
            }, row.cells || [])}
          </TableRow>
          {/* Row object can contain "sub rows" that will always be shown under their
          parent row - even if the table is sorted. This is especially useful what
          comes to creating nested tables. */}
          {row.rows && getRowsToRender(part, row.rows)}
        </React.Fragment>
      );
    }, rows);
    return jsx;
  };

  /**
   * Starting point of table creation. Structure will be walked through and table's
   * different parts will be created.
   */
  const table = R.addIndex(R.map)((part, i) => {
    return (
      <React.Fragment key={i}>
        {R.addIndex(R.map)((rowGroup, ii) => {
          return (
            <RowGroup key={`rowGroup-${ii}`} tableLevel={level}>
              {getRowsToRender(part, rowGroup.rows)}
            </RowGroup>
          );
        }, part.rowGroups || [])}
      </React.Fragment>
    );
  }, sortedStructure);

  // The table will is rendered.
  return <div role="grid">{table}</div>;
};

Table.propTypes = {
  level: PropTypes.number,
  sortedBy: PropTypes.object,
  // Defines the structure of table.
  structure: PropTypes.array.isRequired
};

export default Table;
