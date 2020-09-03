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
        <br />
        <TextBox
          title="Required"
          isRequired
          payload={{ testProp: 1 }}
          onChanges={onChanges}
        />
        <br />
        <br />
        <TextBox
          title="read only"
          isReadOnly
          value="Read only longer text Read only longer text Read only longer text Read only longer text Read only longer text Read only longer text Read only longer text Read only longer text Read only longer text Read only longer text Read only longer text Read only longer text "
          isRequired
          tooltip={{ text: "This is info text" }}
        />
        <TextBox
          title="invalid"
          payload={{ testProp: 1 }}
          onChanges={onChanges}
          isValid={false}
          tooltip={{ text: "This is info text" }}
        />
        <br />
        <TextBox
          title="invalid and required"
          isRequired
          payload={{ testProp: 1 }}
          onChanges={onChanges}
          isValid={false}
          requiredMessage={"Pakollinen tieto"}
        />
      </div>
    );
  });
