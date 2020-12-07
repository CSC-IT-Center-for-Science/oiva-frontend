import React from "react";
import PropTypes from "prop-types";
import Radio from "@material-ui/core/Radio";
import { makeStyles } from "@material-ui/core/styles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Check from "@material-ui/icons/CheckBoxOutlined";
import { isEqual } from "lodash";

const RadioButtonWithLabel = React.memo(
  props => {
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
      props.onChanges(
        {
          forChangeObject: props.forChangeObject,
          fullAnchor: props.fullAnchor
        },
        { isChecked: !props.isChecked }
      );
    };

    return (
      <React.Fragment>
        {!props.isReadOnly ? (
          <FormGroup row>
            <FormControlLabel
              classes={{
                label: styles.label
              }}
              disabled={props.isDisabled}
              control={
                <GreenRadio
                  id={props.id}
                  data-anchor={props.id}
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
              {props.isPreviewModeOn ? (
                <ul className="list-disc leading-none">
                  <li>{props.children}</li>
                </ul>
              ) : (
                <React.Fragment>
                  <Check />
                  <span className="my-auto">{props.children}</span>
                </React.Fragment>
              )}
            </div>
          )
        )}
      </React.Fragment>
    );
  },
  (cp, np) => {
    return (
      isEqual(cp.isChecked, np.isChecked) &&
      isEqual(cp.isPreviewModeOn, np.isPreviewModeOn) &&
      isEqual(cp.isReadOnly, np.isReadOnly) &&
      isEqual(cp.labelStyles, np.labelStyles)
    );
  }
);

RadioButtonWithLabel.propTypes = {
  forChangeObject: PropTypes.object,
  fullAnchor: PropTypes.string,
  id: PropTypes.string,
  isChecked: PropTypes.bool,
  isPreviewModeOn: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  name: PropTypes.string,
  onChanges: PropTypes.func,
  labelStyles: PropTypes.object,
  value: PropTypes.string
};

export default RadioButtonWithLabel;
