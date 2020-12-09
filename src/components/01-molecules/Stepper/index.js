import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import StepLabel from "@material-ui/core/StepLabel";
import Completed from "@material-ui/icons/CheckCircleRounded";
import Incomplete from "@material-ui/icons/ErrorOutlined";
import Normal from "@material-ui/icons/Lens";

/**
 * @module Components/01-molecules
 */

/**
 * Stepper with states, links
 * Parameters:
 *  activeStep
 *  handleStepChange
 *  stepProps: { title: string, isCompleted: boolean, isFailed: boolean}
 * @example
 *  <StepperNavigation activeStep={1} stepProps=[{title: "Phase 3", isCompleted: true}] handleStepChange={handleStepChange} />
 */

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    "& .MuiStepLabel-label ": {
      fontFamily: "inherit",
      fontWeight: "500",
      color: "#1d804c",
      letterSpacing: "0.15px" // to prevent text move when bolding
    },
    "& .MuiStepLabel-label:hover": {
      color: "#104e2d !important"
    },
    "& .Mui-error": {
      color: "#1d804c !important"
    },
    "& .Mui-error:hover": {
      color: "#104e2d !important"
    },
    "& .MuiStepLabel-active": {
      color: "#333333 !important",
      fontWeight: "600",
      letterSpacing: "0" // to prevent text move when bolding
    },
    "& .MuiButtonBase-root": {
      marginTop: "-28px"
    },
    "& .MuiButtonBase-root:hover": {
      "& span.MuiStepLabel-label": {
        color: "#104e2d !important"
      }
    },
    "& .MuiStepper-vertical ": {
      margin: "12px 12px 0 12px"
    }
  }
}));

const iconStyles = makeStyles({
  root: {
    display: "flex",
    height: 22,
    alignItems: "center",
    color: "#a2a4a3"
  },
  active: {
    color: "#1d804c"
  },
  completed: {
    color: "#1d804c",
    zIndex: 1,
    fontSize: 30
  },
  error: {
    color: "#e5c317",
    zIndex: 1,
    fontSize: 30
  }
});

function StepIcons(props) {
  const classes = iconStyles();
  const { active, completed, error, icon } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.error]: error,
        [classes.completed]: completed
      })}>
      {error ? (
        <Incomplete style={{ fontSize: 30 }} className={classes.error} />
      ) : completed ? (
        <Completed className={classes.completed} />
      ) : (
        <div style={{ marginRight: "1.8em", marginBottom: "1.8em" }}>
          <Normal style={{ position: "absolute", fontSize: 30 }} />
          <span
            style={{
              position: "absolute",
              marginLeft: "0.55em",
              marginTop: "0.25em",
              color: "#fff",
              font: "1.1em Inconsolata, monospace"
            }}>
            {icon}
          </span>
        </div>
      )}
    </div>
  );
}

const StepperNavigation = React.memo(props => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Stepper
        nonLinear
        activeStep={props.activeStep}
        orientation={window.innerWidth >= 768 ? "horizontal" : "vertical"}
        style={{
          backgroundColor: "transparent",
          paddingLeft: 0,
          paddingRight: 0
        }}>
        {props.stepProps.map((item, index) => {
          const labelProps = {};

          if (item.isFailed === true) {
            labelProps.error = true;
          }
          if (item.isCompleted === true) {
            labelProps.completed = true;
          }

          return (
            <Step key={item.title}>
              <StepButton
                onClick={() => props.handleStepChange(index + 1)}
                disabled={index === props.activeStep}
                completed={item.isCompleted}>
                <StepLabel
                  style={{ marginBottom: "0.1em" }}
                  StepIconComponent={StepIcons}
                  {...labelProps}>
                  {item.title}
                </StepLabel>
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
});

StepperNavigation.defaultProps = {
  stepProps: [
    { title: "Phase 1" },
    { title: "Phase 2", isFailed: true },
    { title: "Phase 3", isCompleted: true }
  ]
};

StepperNavigation.propTypes = {
  stepProps: PropTypes.array,
  activeStep: PropTypes.number,
  handleStepChange: PropTypes.func
};

export default StepperNavigation;
