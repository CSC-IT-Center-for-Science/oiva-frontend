import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

const defaultProps = {
  level: 2
};

const FormTitle = ({ code, level = defaultProps.level, title }) => {
  return (
    <div className="px-4" style={{ backgroundColor: "rgba(255,255,255,0.5" }}>
      <Typography component={`h${level}`} variant={`h${level}`}>
        {code ? `${code}. ` : ""}
        {title}
      </Typography>
    </div>
  );
};

FormTitle.propTypes = {
  code: PropTypes.string,
  level: PropTypes.number,
  title: PropTypes.string
};

export default FormTitle;
