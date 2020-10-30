import React from "react";
import PropTypes from "prop-types";

import "./template-c.css";

const VerticalLayout = ({ children, items }) => {
  return (
    <div className="template-c-container">
      <div className="align-self-end p-4">{items[0]}</div>
      <div className="justify-self-end align-self-center p-4">{items[1]}</div>
      <div className="p-4">{children}</div>
    </div>
  );
};

VerticalLayout.propTypes = {
  items: PropTypes.array
};

export default VerticalLayout;
