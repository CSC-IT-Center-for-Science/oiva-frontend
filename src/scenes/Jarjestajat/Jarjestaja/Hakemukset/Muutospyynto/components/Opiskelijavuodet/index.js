import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Difference from "../../../../../../../components/02-organisms/Difference";

const Opiskelijavuodet = props => {
  return (
    <React.Fragment>
      <div className="pb-4">
        <Typography variant="h6">{props.mainTitle}</Typography>
      </div>
      <Difference
        defaultValue={props.initialValue}
        onChanges={props.onChanges}
        titles={props.titles}
        value={props.value}
      />
    </React.Fragment>
  );
};

Difference.defaultProps = {
  mainTitle: "Title",
  titles: ["[Title 1]", "[Title 2]", "[Title 3]"],
  value: 0
};

Difference.propTypes = {
  mainTitle: PropTypes.string,
  initialValue: PropTypes.number,
  onChanges: PropTypes.func.isRequired,
  titles: PropTypes.array,
  value: PropTypes.number
};

export default Opiskelijavuodet;
