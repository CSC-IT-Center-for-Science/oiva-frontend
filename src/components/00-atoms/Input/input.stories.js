import React from "react";
import Input from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { withState } from "components/01-molecules/Stepper/node_modules/@dump247/storybook-state";

storiesOf("Input", module)
  .addDecorator(withInfo)
  .add("Simple example", () => {
    const onChanges = (payload, { value }) => {
      console.info(payload, value);
    };
    return (
      <div>
        <p>Normal</p>
        <Input value="1" payload={{ testProp: 1 }} onChanges={onChanges} />
        <p>Error</p>
        <Input
          value="1"
          payload={{ testProp: 2 }}
          onChanges={onChanges}
          error={true}
        />
        <p>Required and valid or not yet visited/validated</p>
        <Input
          payload={{ testProp: 1 }}
          value="test"
          onChanges={onChanges}
          isRequired
          isValid={true}
          label="Required"
          tooltip={{ text: "This is info text" }}
        />
        <p>Invalid</p>
        <Input
          payload={{ testProp: 1 }}
          onChanges={onChanges}
          isValid={false}
          label="Invalid"
          tooltip={{ text: "This is info text" }}
        />
        <p>Required and invalid</p>
        <Input
          payload={{ testProp: 1 }}
          onChanges={onChanges}
          isRequired
          isValid={false}
          label="Required"
        />
        <p>Width given</p>
        <Input
          payload={{ testProp: 2 }}
          onChanges={onChanges}
          width={"20rem"}
        />
        <Input
          label="Readonly"
          payload={{ testProp: 2 }}
          onChanges={onChanges}
          isReadOnly
          value="readonly"
        />
        <p>Number</p>
        <Input
          payload={{ testProp: 123 }}
          onChanges={onChanges}
          type={"number"}
          value={123}
        />
        <Input
          payload={{ testProp: 123 }}
          onChanges={onChanges}
          type={"number"}
          isRequired
          label="Required"
        />
        <Input
          label="Readonly"
          payload={{ testProp: 123 }}
          type={"number"}
          onChanges={onChanges}
          isReadOnly
          isRequired
          value={123}
          tooltip={{ text: "This is info text" }}
        />
        <Input
          label="Readonly empty"
          payload={{ testProp: 123 }}
          type={"number"}
          onChanges={onChanges}
          isReadOnly
          isRequired
          tooltip={{ text: "This is info text" }}
        />
      </div>
    );
  })
  .add(
    "Requirement example",
    withState({ values: ["", "", "", "", ""] })(({ store }) => {
      const onChanges = (payload, { value }, index) => {
        console.info(payload, value);
        store.set({ values: store.state.currentStep + 1 });
      };
      return (
        <div className="p-4">
          <Input
            payload={{ testProp: store.state.values[0] }}
            onChanges={(payload, value) => onChanges(payload, { value }, 0)}
            isRequired
            isValid={true}
            label="Perustele muutos"
          />
          <Input
            payload={{ testProp: store.state.values[1] }}
            onChanges={(payload, value) => onChanges(payload, { value }, 1)}
            isRequired
            isValid={true}
            label="Perustele muutos"
          />
          <Input
            payload={{ testProp: store.state.values[2] }}
            onChanges={(payload, value) => onChanges(payload, { value }, 2)}
            isRequired
            isValid={true}
            label="Perustele muutos"
          />
          <Input
            payload={{ testProp: store.state.values[3] }}
            onChanges={(payload, value) => onChanges(payload, { value }, 3)}
            isRequired
            isValid={true}
            label="Perustele muutos"
          />
          <Input
            payload={{ testProp: store.state.values[4] }}
            onChanges={(payload, value) => onChanges(payload, { value }, 4)}
            isRequired
            isValid={true}
            label="Perustele muutos"
          />
        </div>
      );
    })
  );
