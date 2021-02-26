import React from "react";
import PropTypes from "prop-types";

const HtmlContent = ({ content }) => {
  return (
    <span
      className="htmlContent"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

HtmlContent.propTypes = {
  content: PropTypes.string
};

export default HtmlContent;
