import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import * as R from "ramda";
import { withStyles } from "@material-ui/core";
import SimpleMenu from "../../SimpleMenu";

/**
 * StyledButton is used for creating buttons for sort actions.
 */
const StyledButton = withStyles({
  root: {
    border: 0,
    color: "white",
    width: "100%",
    justifyContent: "left",
    outline: "none",
    margin: "0.5rem"
  },
  label: {
    textTransform: "none"
  }
})(Button);

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
  children,
  columnIndex,
  isHeaderCell = false,
  isOnLastRow = false,
  onClick,
  orderOfBodyRows,
  properties = {},
  row,
  tableLevel = 0
}) => {
  const classNames = R.join(
    " ",
    R.without(["truncate"], properties.styleClasses || [])
  );

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

  return (
    <div
      key={`key-${Math.random()}`}
      role={isHeaderCell ? "columnheader" : "gridcell"}
      className={`${classNames} ${properties.table ? "w-full" : "flex"} ${
        isHeaderCell ? `bg-green-${tableLevel + 5}00 text-white` : "p-2"
      } relative items-center ${!isOnLastRow ? "border-b" : ""}`}>
      {properties.isSortable ? (
        <StyledButton
          aria-label="Sort"
          onClick={() => {
            sort();
          }}
          title={properties.sortingTooltip}>
          {properties.text && (
            <span className={properties.truncate ? "truncate" : ""}>
              {properties.text}
            </span>
          )}
          {orderOfBodyRows && columnIndex === orderOfBodyRows.columnIndex && (
            <React.Fragment>
              {orderOfBodyRows.order === "ascending" ? (
                <ArrowUpwardIcon fontSize="small" />
              ) : (
                <ArrowDownwardIcon fontSize="small" />
              )}
            </React.Fragment>
          )}
        </StyledButton>
      ) : (
        <React.Fragment>
          {(properties.text || properties.menu) && (
            <span
              className={`${properties.truncate ? "truncate" : ""} py-4 px-2 ${
                isHeaderCell ? "cursor-default" : ""
              }`}>
              {properties.text}
              {properties.menu && (
                <SimpleMenu
                  actions={menuActions}
                  id={properties.menu.id}></SimpleMenu>
              )}
            </span>
          )}
        </React.Fragment>
      )}
      {children}
    </div>
  );
};

TableCell.propTypes = {
  columnIndex: PropTypes.number,
  isHeaderCell: PropTypes.bool,
  isOnLastRow: PropTypes.bool,
  onClick: PropTypes.func,
  orderOfBodyRows: PropTypes.object,
  properties: PropTypes.object,
  row: PropTypes.object,
  tableLevel: PropTypes.number
};

export default TableCell;
