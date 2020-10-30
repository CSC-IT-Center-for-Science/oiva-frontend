import React from "react";
import Chip from "@material-ui/core/Chip";

// https://material-ui.com/components/chips/

const Pill = props => {
  return <Chip {...props} />;
};

Pill.defaultProps = {
  variant: "outlined"
};

export default Pill;
