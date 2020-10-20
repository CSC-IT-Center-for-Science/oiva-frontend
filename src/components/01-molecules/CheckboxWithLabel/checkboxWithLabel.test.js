import React from "react";
import { fireEvent, render } from "react-testing-library";
import CheckboxWithLabel from "./index";

it("renders the correct label", () => {
  const labelText = "Label text";
  const div = document.createElement("div");
  const { getByLabelText } = render(
    <CheckboxWithLabel name="test-checkbox" onChanges={jest.fn()}>
      {labelText}
    </CheckboxWithLabel>,
    div
  );
  expect(getByLabelText(labelText)).toBeInTheDocument();
});

it("renders input as checked", () => {
  const labelText = "Label text";
  const div = document.createElement("div");
  const { container } = render(
    <CheckboxWithLabel
      name="test-checkbox"
      isChecked={true}
      onChanges={jest.fn()}
    >
      {labelText}
    </CheckboxWithLabel>,
    div
  );
  expect(container.querySelector('input[type="checkbox"]').checked).toBe(true);
});

it("handles the click", () => {
  const { container } = render(
    <CheckboxWithLabel
      name="test-checkbox"
      isChecked={false}
      onChanges={jest.fn()}
    >
      Label text
    </CheckboxWithLabel>
  );

  fireEvent.click(container.querySelector("label"));

  expect(container.querySelector('input[type="checkbox"]').checked).toBe(true);
});

it("checks if the callback method is called on click", () => {
  const f = jest.fn();
  const { container } = render(
    <CheckboxWithLabel name="test-checkbox" isChecked={false} onChanges={f}>
      Label text
    </CheckboxWithLabel>
  );

  fireEvent.click(container.querySelector("label"));

  expect(f).toHaveBeenCalled();
});
