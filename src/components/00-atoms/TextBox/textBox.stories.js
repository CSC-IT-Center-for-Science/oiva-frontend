import React, { useState } from "react";
import TextBox from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";

storiesOf("TextBox", module)
  .addDecorator(withInfo)
  .add("Unrequired without a title", () => {
    const [state, setState] = useState({
      value: "Example text"
    });
    const onChanges = (payload, { value }) => {
      setState({ value });
    };
    return <TextBox onChanges={onChanges} value={state.value} />;
  })
  .add("Required", () => {
    const [state, setState] = useState({
      value: "Example text"
    });
    const onChanges = (payload, { value }) => {
      setState({ value });
    };
    return (
      <TextBox
        isRequired={true}
        onChanges={onChanges}
        title="Perustelut"
        value={state.value}
      />
    );
  })
  .add("Read only", () => {
    const [state, setState] = useState({
      value: "Example text"
    });
    const onChanges = (payload, { value }) => {
      setState({ value });
    };
    return (
      <TextBox
        isReadOnly={true}
        onChanges={onChanges}
        title="Perustelut"
        value={state.value}
      />
    );
  })
  .add("Invalid with a tooltip", () => {
    const [state, setState] = useState({
      value: "Example text"
    });
    const onChanges = (payload, { value }) => {
      setState({ value });
    };
    return (
      <TextBox
        isRequired={false}
        isValid={false}
        onChanges={onChanges}
        title="Perustelut"
        tooltip={{ text: "This is info text" }}
        value={state.value}
      />
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
      <TextBox
        isRequired
        isValid={false}
        onChanges={onChanges}
        requiredMessage={"Pakollinen tieto"}
        title="Perustelut"
        value={state.value}
      />
    );
  })
  .add("Textbox with delete icon", () => {
    const [state, setState] = useState({
      value: "Example text"
    });
    const onChanges = (payload, { value }) => {
      setState({ value });
    };
    return (
      <TextBox
        isRequired
        isValid={false}
        onChanges={onChanges}
        requiredMessage={"Pakollinen tieto"}
        title="Perustelut"
        value={state.value}
        isRemovable={true}
      />
    );
  });
