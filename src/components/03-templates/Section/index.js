import React from "react";
import PropTypes from "prop-types";

const Section = React.memo(props => {
  return (
    <div className="flex">
      {props.code && (
        <div className="w-8 sm:w-16">
          <h2 className="py-8">{props.code}.</h2>
        </div>
      )}
      <div className="w-full">
        {props.title && (
          <h2 className="py-8">
            <span>{props.title}</span>
          </h2>
        )}
        <div className="pb-4">{props.children}</div>
      </div>
    </div>
  );
});

Section.propTypes = {
  code: PropTypes.number,
  title: PropTypes.string
};

export default Section;
