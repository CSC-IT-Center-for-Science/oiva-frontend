import React from "react";
import { storiesOf } from "@storybook/react";
import Dropdown from "./index";
import { withState } from "@dump247/storybook-state";

const options = [
  { value: "1", label: "Yksi" },
  { value: "2", label: "Kaksi" },
  { value: "3", label: "Kolme" }
];

const initialState = {
  value: "2",
  requiredValue: ""
};

storiesOf("Dropdown", module).add(
  "default, contained",
  withState(initialState)(({ store }) => (
    <div>
      <p>Base case, has callback and initial value</p>
      <Dropdown
        options={options}
        value={store.state.value}
        onChanges={(payload, { selectedOption }) =>
          store.set({ value: selectedOption.value })
        }
        emptyMessage="Clear"
      />
      <p>Value from callback is: {store.state.value}</p>
      <br />
      <hr />

      <p>Fills container</p>
      <Dropdown
        options={options}
        value={store.state.value}
        fullWidth={true}
        emptyMessage="Clear"
        onChanges={(payload, { selectedOption }) =>
          store.set({ value: selectedOption.value })
        }
      />
      <br />
      <hr />

      <p>Doesn't fill container</p>
      <Dropdown
        options={options}
        value={store.state.value}
        emptyMessage="Clear"
        onChanges={(payload, { selectedOption }) =>
          store.set({ value: selectedOption.value })
        }
      />
      <br />
      <hr />

      <p>With label</p>
      <Dropdown
        options={options}
        value={store.state.value}
        label="With label"
        emptyMessage="Clear"
        onChanges={(payload, { selectedOption }) =>
          store.set({ value: selectedOption.value })
        }
      />
      <br />
      <hr />

      <p>Disabled</p>
      <Dropdown
        options={options}
        value={store.state.value}
        isDisabled={true}
        emptyMessage="Clear"
        onChanges={(payload, { selectedOption }) =>
          store.set({ value: selectedOption.value })
        }
      />

      <hr />

      <p>Required</p>
      <Dropdown
        options={options}
        onChanges={(payload, { selectedOption }) =>
          store.set({ requiredValue: selectedOption.value })
        }
        value={store.state.requiredValue}
        isRequired={true}
        requiredMessage={"field is required"}
        showValidationErrors={true}
        error={store.state.requiredValue === ""}
        label="label"
        emptyMessage="Clear"
      />
    </div>
  ))
);
