import React from "react";
import Input from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";

storiesOf("Input", module)
  .addDecorator(withInfo)
  .add("Simple example", () => {
    const onChanges = (payload, { value }) => {
      console.info(payload, value);
    };
    return (
      <div>
        <p>Normal</p>
        <Input payload={{ testProp: 1 }} onChanges={onChanges} />
        <p>Error</p>
        <Input payload={{ testProp: 2 }} onChanges={onChanges} error={true} />
        <p>Wide</p>
        <Input payload={{ testProp: 2 }} onChanges={onChanges} width={"100%"} />
        <p>Number</p>
        <Input
          payload={{ testProp: 2 }}
          onChanges={onChanges}
          type={"number"}
        />
      </div>
    );
  });
