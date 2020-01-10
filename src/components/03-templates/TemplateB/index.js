import React from "react";
import PropTypes from "prop-types";

const TemplateB = ({ items }) => {
  return <React.Fragment>{items}</React.Fragment>;
};

TemplateB.propTypes = {
  items: PropTypes.array
};

export default TemplateB;
