import React from "react";
import { storiesOf } from "@storybook/react";
import RadioButtonWithLabel from "./index";
import { isInLupa, isAdded, isRemoved } from "../../../css/label";

storiesOf("RadioButtonWithLabel", module)
  .add("is checked", () => (
    <RadioButtonWithLabel
      name="checked-with-label"
      isChecked={true}>
      Label text
    </RadioButtonWithLabel>
  ))
  .add("is unchecked", () => (
    <RadioButtonWithLabel
      name="example"
      isChecked={false}>
      Label text
    </RadioButtonWithLabel>
  ))
  .add("is checked and in LUPA", () => (
    <RadioButtonWithLabel
        name="example"
        labelStyles={Object.assign({}, isInLupa)}
        isChecked={true}>
        Label text
    </RadioButtonWithLabel>
  ))
  .add("is unchecked and in LUPA", () => (
    <RadioButtonWithLabel
        name="example"
        labelStyles={Object.assign({}, isInLupa)}
        isChecked={false}>
        Label text
    </RadioButtonWithLabel>
  ))
  .add("is unchecked and removed", () => (
    <RadioButtonWithLabel
        name="example"
        labelStyles={Object.assign({}, isRemoved)}
        isChecked={false}>
        Label text
    </RadioButtonWithLabel>
  ))
  .add("is checked and added", () => (
    <RadioButtonWithLabel
      name="example"
      labelStyles={Object.assign({}, isAdded)}
      isChecked={true}>
      Label text
  </RadioButtonWithLabel>
  ))
  .add("is unchecked, removed and in LUPA", () => (
    <RadioButtonWithLabel
      name="example"
      labelStyles={Object.assign({}, isRemoved, isInLupa)}
      isChecked={false}>
      Label text
  </RadioButtonWithLabel>
  ))
  .add("is checked, added and in LUPA", () => (
    <RadioButtonWithLabel
      name="example"
      labelStyles={Object.assign({}, isAdded, isInLupa)}
      isChecked={true}>
      Label text
  </RadioButtonWithLabel>
  ))
