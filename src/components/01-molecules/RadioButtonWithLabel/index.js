import React from "react";
import PropTypes from "prop-types";
import Radio from "@material-ui/core/Radio";
import { makeStyles } from "@material-ui/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Check from "@material-ui/icons/CheckBoxOutlined";

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
      {!props.isReadOnly ? (
        <FormGroup row>
          <FormControlLabel
            id={`label-${props.payload.anchor}`}
            htmlFor={props.payload.anchor}
            classes={{
              label: styles.label
            }}
            disabled={props.isDisabled}
            control={
              <GreenRadio
                id={props.payload.anchor}
                data-anchor={props.payload.anchor}
                checked={props.isChecked}
                value={props.value}
                onChange={handleChanges}
              />
            }
            label={props.children}
          />
        </FormGroup>
      ) : (
        props.isChecked && (
          <div className="flex flex-row text-base mb-2">
            <Check />
            <span className="my-auto">{props.children}</span>
          </div>
        )
      )}
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
