import React from "react";
import Input from "./index";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { withState } from "@dump247/storybook-state";

const initialState = {
  value: "Example text"
};

storiesOf("Input", module)
  .addDecorator(withInfo)
  .add(
    "Unrequired",
    withState(initialState)(({ store }) => {
      const onChanges = (payload, { value }) => {
        store.set({ value });
      };
      return (
        <div>
          <Input
            label="Perustele muutos"
            onChanges={onChanges}
            value={store.state.value}
          />
        </div>
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
        <div>
          <Input
            isRequired={true}
            isValid={false}
            label="Perustele muutos"
            onChanges={onChanges}
            value={store.state.value}
          />
        </div>
      );
    })
  )
  .add(
    "Required and valid with a tooltip",
    withState(initialState)(({ store }) => {
      const onChanges = (payload, { value }) => {
        store.set({ value });
      };
      return (
        <div>
          <Input
            isRequired={true}
            isValid={true}
            label="Perustele muutos"
            onChanges={onChanges}
            tooltip={{ text: "This is info text" }}
            value={store.state.value}
          />
        </div>
      );
    })
  )
  .add(
    "Read only, required and invalid",
    withState(initialState)(({ store }) => {
      const onChanges = (payload, { value }) => {
        store.set({ value });
      };
      return (
        <div>
          <Input
            isRequired={true}
            isReadOnly={true}
            isValid={false}
            label="Perustele muutos"
            onChanges={onChanges}
            value={store.state.value}
          />
        </div>
      );
    })
  )
  .add(
    "Erroneous",
    withState(initialState)(({ store }) => {
      const onChanges = (payload, { value }) => {
        store.set({ value });
      };
      return (
        <div>
          <Input
            error={true}
            isRequired={true}
            isValid={false}
            label="Perustele muutos"
            onChanges={onChanges}
            value={store.state.value}
          />
        </div>
      );
    })
  );