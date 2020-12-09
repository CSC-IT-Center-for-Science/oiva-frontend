import React from "react";
import { fireEvent, render } from "react-testing-library";
import StepperNavigation from "./index";

const props = [
  {
    title: "Step 1",
    isFailed: true,
    onChange: jest.fn()
  },
  {
    title: "Step 2",
    isCompleted: true,
    onChange: jest.fn()
  },
  { title: "Step 3", onChange: jest.fn() }
];

it("renders the correct titles", () => {
  const { getByLabelText } = render(
    <StepperNavigation name="example" stepProps={props} />
  );
  expect(getByLabelText(props[0].title)).toBeInTheDocument();
  expect(getByLabelText(props[1].title)).toBeInTheDocument();
  expect(getByLabelText(props[2].title)).toBeInTheDocument();
});

it("checks if the callback method is called on click", () => {
  const { container } = render(
    <StepperNavigation name="example" stepProps={props} />
  );

  fireEvent.click(container.querySelector(props[0].title));

  expect(props[0].onChange).toHaveBeenCalled();
});
