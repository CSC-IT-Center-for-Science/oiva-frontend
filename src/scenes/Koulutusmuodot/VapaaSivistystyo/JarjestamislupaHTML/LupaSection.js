import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";

const LupaSection = props => {
  const { kohde } = props;

  if (kohde.heading && kohde.values && kohde.values.length > 0) {
    const { heading, values } = kohde;
    const elements = values.map((item,i) => (<p key={i}>{item}</p>));
    // TODO: Content inlined from 03-templates/Section and should be replaceable when it is imported to components
    return (
      <div className="flex">
        <div className="w-full">
          {heading && (
            <Typography component="h3" variant="h3">
              <span>{heading}</span>
            </Typography>
          )}
          <div className="pb-4">{elements}</div>
        </div>
      </div>
    )
  } else {
    return (<React.Fragment></React.Fragment>)
  }
};

LupaSection.propTypes = {
  kohde: PropTypes.object
}

export default LupaSection;
