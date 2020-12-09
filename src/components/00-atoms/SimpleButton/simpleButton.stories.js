import React from "react";
import { storiesOf } from "@storybook/react";
import SimpleButton from "./index";

storiesOf("SimpleButton", module).add("Normal", () => (
  <div className="flex flex-col w-56 p-4">
    <SimpleButton text="Text is here" onClick={() => {}} />
  </div>
));
storiesOf("SimpleButton", module).add("Outlined, large", () => (
  <div className="flex flex-col w-56 p-4">
    <SimpleButton
      text="Text is here"
      variant="outlined"
      size="large"
      onClick={() => {}}
    />
  </div>
));
storiesOf("SimpleButton", module).add("Text button", () => (
  <div className="flex flex-col w-56 p-4">
    <SimpleButton
      text="Text is here"
      color="default"
      onClick={() => {}}
    />
  </div>
));
storiesOf("SimpleButton", module).add("Disabled Normal button", () => (
  <div className={"flex flex-col w-56 p-4"}>
    <SimpleButton text="Text is here" disabled={true} onClick={() => {}} />
  </div>
));
