import React from "react";
import PropTypes from "prop-types";
import { addIndex, map } from "ramda";

const TemplateD = ({ items }) => {
  return (
    <div className="flex flex-col">
      {addIndex(map)((item, index) => {
        return item;
      }, items)}
    </div>
  );
};

TemplateD.propTypes = {
  items: PropTypes.array
};

export default TemplateD;
