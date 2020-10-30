import React from "react";
import PropTypes from "prop-types";
import { addIndex, map } from "ramda";

const VerticalLayout = ({ items }) => {
  return (
    <div className="flex flex-col">
      {addIndex(map)((item, index) => {
        return item;
      }, items)}
    </div>
  );
};

VerticalLayout.propTypes = {
  items: PropTypes.array
};

export default VerticalLayout;
