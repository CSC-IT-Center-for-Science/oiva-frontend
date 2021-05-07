import React from "react";
import PropTypes from "prop-types";
import { path } from "ramda";

const LisatiedotHtmlLupa = ({ lisatietomaarays }) => {
  return (
    <p className="whitespace-pre-wrap">
      {path(["meta", "arvo"], lisatietomaarays)}
    </p>
  );
};

LisatiedotHtmlLupa.propTypes = {
  lisatietomaarays: PropTypes.object
};

export default LisatiedotHtmlLupa;
