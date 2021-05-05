import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

const defaultProps = {
  code: "",
  title: ""
};

const Section = ({
  children,
  code = defaultProps.code,
  title = defaultProps.title
}) => {
  const fullTitle = `${code ? `${code}. ` : ""}${title}`;
  return (
    <div>
      {fullTitle && (
        <Typography component="h2" variant="h2" className="pt-8">
          {fullTitle}
        </Typography>
      )}
      <div className="pb-4">{children}</div>
    </div>
  );
};

Section.propTypes = {
  code: PropTypes.number,
  title: PropTypes.string
};

export default Section;
