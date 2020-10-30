import React from "react";
import PropTypes from "prop-types";

import "./template-a.css";

const HorizontalLayout = ({ children, items }) => {
  return (
    <div className="template-a-container py-4">
      <div className="align-self-end pr-4">{items[0]}</div>
      <div className="item-2 pl-4">
        <div className="flex">
          <div className="flex flex-col pr-4 border-r align-self-center">
            <div>{items[1]}</div>
            <div>{items[2]}</div>
          </div>
          <div className="align-self-center pl-4">{children}</div>
        </div>
      </div>
    </div>
  );
};

HorizontalLayout.propTypes = {
  items: PropTypes.array
};

export default HorizontalLayout;
