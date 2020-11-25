import React from "react";
import PropTypes from "prop-types";

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
      {fullTitle && <h2 className="pt-8 pb-4">{fullTitle}</h2>}
      <div className="pb-4">{children}</div>
    </div>
  );
};

Section.propTypes = {
  code: PropTypes.number,
  title: PropTypes.string
};

export default Section;
