import React, { useMemo } from "react";
import MaterialUITableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import SimpleMenu from "../../SimpleMenu";
import PropTypes from "prop-types";
import * as R from "ramda";

/**
 * TableCell component. Used  by the Table component.
 * @param {object} props - Properties object.
 * @param {object} props.children - Dynamic content of the TableCell.
 * @param {number} props.columnIndex - Index of the cell on the current row.
 * @param {boolean} props.isHeaderCell - True if the cell is in thead section.
 * @param {boolean} props.isOnLastRow - True if the cell is on the last row of table.
 * @param {function} props.onClick - Will be called when the cell is clicked.
 * @param {array} props.orderOfBodyRows - Config object. Is used for showing sorting related info.
 * @param {object} props.properties - Config object. Defines cell related variables (see table structure).
 * @param {object} props.row - Row related data. The row contains the cell.
 * @param {number} props.tableLevel - Indicates the nesting level. For a flat table the value is 0.
 */
const TableCell = ({
  columnIndex,
  isHeaderCell,
  onClick,
  orderOfBodyRows,
  properties = {},
  row
}) => {

  function sort() {
    onClick("sort", { columnIndex, properties });
  }

  // Callback functions of menu actions are called with additional data.
  const menuActions = useMemo(() => {
    return properties.menu
      ? R.map(action => {
          return {
            ...action,
            onClick: () => {
              return onClick(action.id, {
                cell: properties,
                row
              });
            }
          };
        }, properties.menu.actions)
      : [];
  }, [onClick, properties, row]);

  return properties.isSortable ? (
    <MaterialUITableCell>
      {orderOfBodyRows && <TableSortLabel
        active={columnIndex === orderOfBodyRows.columnIndex}
        direction={orderOfBodyRows.order}
        onClick={sort}
      >
        {properties.text}
        {columnIndex === orderOfBodyRows.columnIndex ? (
          <span className="visuallyHidden">
            {orderOfBodyRows.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
          </span>
        ) : null}
      </TableSortLabel>}
    </MaterialUITableCell>
  ) :  (
    <MaterialUITableCell className={isHeaderCell ? "cursor-default" : ""}>
      {(properties.text || properties.menu) && (
        <span
          className={`${properties.truncate ? "truncate" : ""}`}>
          {properties.text}
          {properties.menu && (
            <SimpleMenu
              actions={menuActions}
              id={properties.menu.id}></SimpleMenu>
          )}
        </span>
      )}
    </MaterialUITableCell>
  )
};

TableCell.propTypes = {
  isHeaderCell: PropTypes.bool,
  columnIndex: PropTypes.number,
  onClick: PropTypes.func,
  orderOfBodyRows: PropTypes.object,
  properties: PropTypes.object,
  row: PropTypes.object
};

export default TableCell;
