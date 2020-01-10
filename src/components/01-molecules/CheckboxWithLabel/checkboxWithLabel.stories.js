import React from "react";
import { storiesOf } from "@storybook/react";
import CheckboxWithLabel from "./index";
import { withInfo } from "@storybook/addon-info";
import { isInLupa, isAdded, isRemoved } from "../../../css/label";

storiesOf("CheckboxWithLabel", module)
  .addDecorator(withInfo)
  .add("is unchecked", () => (
    <CheckboxWithLabel
      name="example"
      isChecked={false}
      onChanges={() => {
        console.info("Clicked!");
      }}
    >
      Is unchecked
    </CheckboxWithLabel>
  ))
  .add("is checked", () => (
    <CheckboxWithLabel
      name="example"
      isChecked={true}
      onChanges={() => {
        console.info("Clicked!");
      }}
    >
      Is checked
    </CheckboxWithLabel>
  ))
  .add("unchecked, in lupa", () => (
    <CheckboxWithLabel
      name="example"
      onChanges={() => {
        console.info("Clicked!");
      }}
      labelStyles={Object.assign({}, isInLupa)}
    >
      Is unchecked and in LUPA
    </CheckboxWithLabel>
  ))
  .add("Is checked and in LUPA", () => (
    <CheckboxWithLabel
      name="example"
      isChecked={true}
      onChanges={() => {
        console.info("Clicked!");
      }}
      labelStyles={Object.assign({}, isInLupa)}
    >
      Is checked and in LUPA
    </CheckboxWithLabel>
  ))
  .add("is unchecked and removed", () => (
    <CheckboxWithLabel
      name="example"
      onChanges={() => {
        console.info("Clicked!");
      }}
      labelStyles={Object.assign({}, isRemoved)}
    >
      Is unchecked and removed
    </CheckboxWithLabel>
  ))
  .add("is checked and added", () => (
    <CheckboxWithLabel
      name="example"
      isChecked={true}
      onChanges={() => {
        console.info("Clicked!");
      }}
      labelStyles={Object.assign({}, isAdded)}
    >
      Is checked and added
    </CheckboxWithLabel>
  ))
  .add("is unchecked, removed and in LUPA", () => (
    <CheckboxWithLabel
      name="example"
      onChanges={() => {
        console.info("Clicked!");
      }}
      labelStyles={Object.assign({}, isRemoved, isInLupa)}
    >
      Is unchecked, removed and in LUPA
    </CheckboxWithLabel>
  ))
  .add("is checked, added and in LUPA", () => (
    <CheckboxWithLabel
      name="example"
      isChecked={true}
      onChanges={() => {
        console.info("Clicked!");
      }}
      labelStyles={Object.assign({}, isAdded, isInLupa)}
    >
      Is checked, added and in LUPA
    </CheckboxWithLabel>
  ));
