import React from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

// https://stackoverflow.com/questions/28784050/react-how-to-compare-current-props-children-with-new-one

// Flattens all child elements into a single list
const flatten = (children, flat = []) => {
  flat = [...flat, ...React.Children.toArray(children)];

  if (children && children.props && children.props.children) {
    return flatten(children.props.children, flat);
  }

  return flat;
};

// Strips all circular references and internal fields
const simplify = children => {
  const flat = flatten(children);

  return flat.map(({ key, ref, type, props: { children, ...props } }) => ({
    key,
    ref,
    type,
    props
  }));
};

const defaultProps = {
  code: "",
  title: ""
};

const Section = React.memo(
  ({ children, code = defaultProps.code, title = defaultProps.title }) => {
    const fullTitle = `${code ? `${code}. ` : ""}${title}`;
    return (
      <div>
        {fullTitle && <h2 className="py-8">{fullTitle}</h2>}
        <div className="pb-4">{children}</div>
      </div>
    );
  },
  (cp, np) => {
    return isEqual(simplify(cp.children), simplify(np.children));
  }
);

Section.propTypes = {
  code: PropTypes.number,
  title: PropTypes.string
};

export default Section;
