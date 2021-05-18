import React from "react";
import PropTypes from "prop-types";
import MaterialUITableRow from "@material-ui/core/TableRow";

/**
 * TableRow component. Used by the Table component.
 * @param {object} props - Properties object.
 * @param {object} props.children - TableRow content.
 * @param {function} props.onClick - Callback function on row click.
 * @param {object} props.row - Object that contains row related data.
 * @param {number} props.tableLevel - Indicates the deepness of nesting.
 */
const TableRow = ({ children, onClick, row, tableLevel = 0 }) => {
  const { isClickable = true, isHoverable = true } = row;
  function onRowClick(action = "click") {
    if (onClick) {
      onClick(action, row, tableLevel);
    } else {
      console.warn("onClick handler function is missing!");
    }
  }

  const hoverBgClass = isHoverable
    ? `hover:bg-gray-${tableLevel + 1}00 cursor-pointer`
    : "";

  return (
    <MaterialUITableRow
      className={`${hoverBgClass} flex`}
      hover={isHoverable}
      key={`key-${Math.random()}`}
      onClick={() => {
        return isClickable ? onRowClick() : false;
      }}
      onKeyDown={e => {
        if (e.key === "Enter") {
          return isClickable ? onRowClick() : false;
        }
      }}
      tabIndex={0}>
      {children}
    </MaterialUITableRow>
  );
};

TableRow.propTypes = {
  children: PropTypes.array,
  onClick: PropTypes.func,
  row: PropTypes.object,
  tableLevel: PropTypes.number
};

export default TableRow;
