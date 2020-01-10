import React from "react";
import TextBox from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";

storiesOf("TextBox", module)
  .addDecorator(withInfo)
  .add("Simple example", () => {
    const onChanges = (payload, { value }) => {
      console.info(payload, value);
    };
    return (
      <div>
        <p>Open developer tool console to see callback values.</p>
        <TextBox payload={{ testProp: 1 }} onChanges={onChanges} />
      </div>
    );
  });
