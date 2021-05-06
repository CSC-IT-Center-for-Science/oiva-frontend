import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import StepperNavigation from "./index";
import { withInfo } from "@storybook/addon-info";

const props = [
  {
    title: "Step 1",
    isFailed: true
  },
  {
    title: "Step 2",
    isCompleted: true
  },
  { title: "Step 3", onChange: () => console.log("Clicked 3") }
];

storiesOf("StepperNavigation", module)
  .addDecorator(withInfo)
  .add("Stepper example", () => {
    const [state, setState] = useState({ currentStep: 0 });
    return (
      <React.Fragment>
        <div
          style={{
            marginTop: "1em",
            borderTop: "1px solid red",
            borderBottom: "1px solid red"
          }}>
          <StepperNavigation
            name="example"
            stepProps={props}
            activeStep={0}
            handleStepChange={() => {}}
          />
        </div>
        <button
          onClick={() => {
            setState({ currentStep: state.currentStep - 1 });
          }}>
          - Prev
        </button>
        |
        <button
          onClick={() => {
            setState({ currentStep: state.currentStep + 1 });
          }}>
          Next +
        </button>
      </React.Fragment>
    );
  });
