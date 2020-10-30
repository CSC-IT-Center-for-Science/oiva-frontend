import React from "react";
import Pill from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";

storiesOf("Chip, Pill", module)
  .addDecorator(withInfo)
  .add("Simple example", () => {
    return (
      <div>
        <p>Normal</p>
        <Pill label="Something" onDelete={() => {}} />
        <p>Filled</p>
        <div className="flex flex-col items-start">
          <Pill label="Something" variant="default" onDelete={() => {}} />
          <br />
          <Pill
            label="Something"
            variant="default"
            color="primary"
            onDelete={() => {}}
          />
          <br />
          <Pill
            label="Something"
            variant="default"
            color="secondary"
            onDelete={() => {}}
          />
        </div>
      </div>
    );
  });
