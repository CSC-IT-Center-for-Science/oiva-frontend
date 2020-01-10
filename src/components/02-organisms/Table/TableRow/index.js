import React from "react";
import PropTypes from "prop-types";

/**
 * TableRow component. Used by the Table component.
 * @param {object} props - Properties object.
 * @param {object} props.children - TableRow content.
 * @param {function} props.onClick - Callback function on row click.
 * @param {object} props.row - Object that contains row related data.
 * @param {number} props.tableLevel - Indicates the deepness of nesting.
 */
const TableRow = ({ children, onClick, row, tableLevel = 0 }) => {
  function onRowClick(action = "click") {
    if (onClick) {
      onClick(action, row, tableLevel);
    }
  }

  return (
    <div
      key={`key-${Math.random()}`}
      role="row"
      className={`hover:bg-gray-${tableLevel + 1}00 cursor-pointer flex`}
      onClick={() => {
        onRowClick();
      }}>
      {children}
    </div>
  );
};

TableRow.propTypes = {
  onClick: PropTypes.func,
  row: PropTypes.object,
  tableLevel: PropTypes.number
};

export default TableRow;
