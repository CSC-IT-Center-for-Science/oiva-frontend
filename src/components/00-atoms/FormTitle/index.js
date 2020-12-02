import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";

const defaultProps = {
  level: 2
};

const FormTitle = ({
  code,
  isPreviewModeOn,
  level = defaultProps.level,
  title
}) => {
  return (
    <div className={`${isPreviewModeOn ? "" : "px-4"}`}>
      <Typography component={`h${level}`} variant={`h${level}`}>
        {code ? `${code}. ` : ""}
        {title}
      </Typography>
    </div>
  );
};

FormTitle.propTypes = {
  code: PropTypes.string,
  isPreviewModeOn: PropTypes.bool,
  level: PropTypes.number,
  title: PropTypes.string
};

export default FormTitle;
