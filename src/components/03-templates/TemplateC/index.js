import React from "react";
import PropTypes from "prop-types";

import "./template-c.css";

const TemplateC = ({ children, items }) => {
  return (
    <div className="template-c-container">
      <div className="align-self-end p-4">
        {items[0]} - {items[1]}
      </div>
      <div className="justify-self-end align-self-center p-4">{items[2]}</div>
      {/* <div className="item-2 pl-4">
        <div className="flex">
          <div className="flex flex-col pr-4 border-r">
            <div>{items[2]}</div>
            <div>{items[3]}</div>
          </div>
          <div className="align-self-center pl-4">{children}</div>
        </div>
      </div> */}
      <div className="p-4">{children}</div>
    </div>
  );
};

TemplateC.propTypes = {
  items: PropTypes.array
};

export default TemplateC;
