import React from "react";
import { fireEvent, render } from "react-testing-library";
import StepperNavigation from "./index";

const stepProps = [
  {
    id: "step-0",
    title: "Step 1",
    isFailed: true,
    onChange: jest.fn()
  },
  {
    id: "step-1",
    title: "Step 2",
    isCompleted: true,
    onChange: jest.fn()
  },
  { id: "step-2", title: "Step 3", onChange: jest.fn() }
];

it("renders the correct titles", () => {
  const { getByText } = render(
    <StepperNavigation name="example" stepProps={stepProps} />
  );
  expect(getByText(stepProps[0].title)).toBeInTheDocument();
  expect(getByText(stepProps[1].title)).toBeInTheDocument();
  expect(getByText(stepProps[2].title)).toBeInTheDocument();
});

it("checks if the callback method is called on click", () => {
  const { container, getByTestId } = render(
    <StepperNavigation
      name="example"
      stepProps={stepProps}
      handleStepChange={stepProps[2].onChange}
    />
  );

  fireEvent.click(getByTestId("step-2"));

  expect(stepProps[2].onChange).toHaveBeenCalled();
});
