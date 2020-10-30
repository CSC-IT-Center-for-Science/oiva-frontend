import React from "react";
import TextBox from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { withState } from "@dump247/storybook-state";

const initialState = {
  value: "Example text"
};

storiesOf("TextBox", module)
  .addDecorator(withInfo)
  .add(
    "Unrequired without a title",
    withState(initialState)(({ store }) => {
      const onChanges = (payload, { value }) => {
        store.set({ value });
      };
      return <TextBox onChanges={onChanges} value={store.state.value} />;
    })
  )
  .add(
    "Required",
    withState(initialState)(({ store }) => {
      const onChanges = (payload, { value }) => {
        store.set({ value });
      };
      return (
        <TextBox
          isRequired={true}
          onChanges={onChanges}
          title="Perustelut"
          value={store.state.value}
        />
      );
    })
  )
  .add(
    "Read only",
    withState(initialState)(({ store }) => {
      const onChanges = (payload, { value }) => {
        store.set({ value });
      };
      return (
        <TextBox
          isReadOnly={true}
          onChanges={onChanges}
          title="Perustelut"
          value={store.state.value}
        />
      );
    })
  )
  .add(
    "Invalid with a tooltip",
    withState(initialState)(({ store }) => {
      const onChanges = (payload, { value }) => {
        store.set({ value });
      };
      return (
        <TextBox
          isRequired={false}
          isValid={false}
          onChanges={onChanges}
          title="Perustelut"
          tooltip={{ text: "This is info text" }}
          value={store.state.value}
        />
      );
    })
  )
  .add(
    "Required and invalid",
    withState(initialState)(({ store }) => {
      const onChanges = (payload, { value }) => {
        store.set({ value });
      };
      return (
        <TextBox
          isRequired
          isValid={false}
          onChanges={onChanges}
          requiredMessage={"Pakollinen tieto"}
          title="Perustelut"
          value={store.state.value}
        />
      );
    })
  )
  .add(
    "Textbox with delete icon",
    withState(initialState)(({ store }) => {
      const onChanges = (payload, { value }) => {
        store.set({ value });
      };
      return (
        <TextBox
          isRequired
          isValid={false}
          onChanges={onChanges}
          requiredMessage={"Pakollinen tieto"}
          title="Perustelut"
          value={store.state.value}
          isRemovable={true}
        />
      );
    })
  );
