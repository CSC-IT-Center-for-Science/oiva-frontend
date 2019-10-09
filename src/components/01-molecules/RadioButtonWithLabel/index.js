import React from "react";
import PropTypes from "prop-types";
import Radio from "@material-ui/core/Radio";
import { makeStyles } from "@material-ui/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

const RadioButtonWithLabel = React.memo(props => {
  const styles = makeStyles({
    label: props.labelStyles
  })();
  const GreenRadio = withStyles({
    root: {
      color: green[400],
      "&$checked": {
        color: green[600]
      }
    },
    checked: {}
  })(props => <Radio color="default" {...props} />);

  const handleChanges = () => {
    props.onChanges(props.payload, { isChecked: !props.isChecked });
  };

  return (
    <React.Fragment>
      {!props.isReadOnly || (props.isReadOnly && props.isChecked) ? (
        <FormGroup row>
          <FormControlLabel
            classes={{
              label: styles.label
            }}
            disabled={props.isDisabled || props.isReadOnly}
            control={
              <GreenRadio
                checked={props.isChecked}
                value={props.value}
                onChange={handleChanges}
              />
            }
            label={props.children}
          />
        </FormGroup>
      ) : null}
    </React.Fragment>
  );
});

RadioButtonWithLabel.propTypes = {
  isChecked: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  name: PropTypes.string,
  onChanges: PropTypes.func,
  payload: PropTypes.object,
  labelStyles: PropTypes.object,
  value: PropTypes.string
};

export default RadioButtonWithLabel;
