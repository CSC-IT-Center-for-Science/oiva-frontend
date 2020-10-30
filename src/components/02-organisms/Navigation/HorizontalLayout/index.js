import React from "react";
import PropTypes from "prop-types";

const HorizontalLayout = ({ items }) => {
  return <React.Fragment>{items}</React.Fragment>;
};

HorizontalLayout.propTypes = {
  items: PropTypes.array
};

export default HorizontalLayout;
