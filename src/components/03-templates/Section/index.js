import React from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

// https://stackoverflow.com/questions/28784050/react-how-to-compare-current-props-children-with-new-one

// Flattens all child elements into a single list
const flatten = (children, flat = []) => {
  flat = [...flat, ...React.Children.toArray(children)];

  if (children.props && children.props.children) {
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

const Section = React.memo(
  props => {
    const fullTitle = `${props.code}${props.code ? ". " : ""}${props.title}`;
    return (
      <div>
        <h2 className="py-8">{fullTitle}</h2>
        <div className="pb-4">{props.children}</div>
      </div>
    );
  },
  (cp, np) => {
    // console.info(simplify(cp.children));
    // console.info(simplify(np.children));
    return isEqual(simplify(cp.children), simplify(np.children));
    // return isEqual(cp.children, np.children);
  }
);

Section.propTypes = {
  code: PropTypes.number,
  title: PropTypes.string
};

export default Section;
