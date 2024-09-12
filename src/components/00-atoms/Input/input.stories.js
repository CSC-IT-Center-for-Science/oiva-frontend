import React, { useState } from "react";
import Input from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";

storiesOf("Input", module)
  .addDecorator(withInfo)
  .add("Unrequired", () => {
    const [state, setState] = useState({
      value: "Example text"
    });
    const onChanges = (payload, { value }) => {
      setState({ value });
    };
    return (
      <div>
        <Input
          label="Perustele muutos"
          onChanges={onChanges}
          value={state.value}
        />
      </div>
    );
  })
  .add("Required and invalid", () => {
    const [state, setState] = useState({
      value: "Example text"
    });
    const onChanges = (payload, { value }) => {
      setState({ value });
    };
    return (
      <div>
        <Input
          isRequired={true}
          isValid={false}
          label="Perustele muutos"
          onChanges={onChanges}
          value={state.value}
        />
      </div>
    );
  })
  .add("Required and valid with a tooltip", () => {
    const [state, setState] = useState({
      value: "Example text"
    });
    const onChanges = (payload, { value }) => {
      setState({ value });
    };
    return (
      <div>
        <Input
          isRequired={true}
          isValid={true}
          label="Perustele muutos"
          onChanges={onChanges}
          tooltip={{ text: "This is info text" }}
          value={state.value}
        />
      </div>
    );
  })
  .add("Read only, required and invalid", () => {
    const [state, setState] = useState({
      value: "Example text"
    });
    const onChanges = (payload, { value }) => {
      setState({ value });
    };
    return (
      <div>
        <Input
          isRequired={true}
          isReadOnly={true}
          isValid={false}
          label="Perustele muutos"
          onChanges={onChanges}
          value={state.value}
        />
      </div>
    );
  })
  .add("Erroneous", () => {
    const [state, setState] = useState({
      value: "Example text"
    });
    const onChanges = (payload, { value }) => {
      setState({ value });
    };
    return (
      <div>
        <Input
          error={true}
          isRequired={true}
          isValid={false}
          label="Perustele muutos"
          onChanges={onChanges}
          value={state.value}
        />
      </div>
    );
  });
