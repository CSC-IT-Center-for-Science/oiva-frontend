import React from "react";
import { PropTypes } from "prop-types";

const SivupohjaA = ({ children }) => {
  return (
    <div className="mx-auto max-w-213 mt-24 md:mt-12 mb-16 px-12 md:px-5">
      {children}
    </div>
  );
};

SivupohjaA.propTypes = {
  children: PropTypes.object
};

export default SivupohjaA;
