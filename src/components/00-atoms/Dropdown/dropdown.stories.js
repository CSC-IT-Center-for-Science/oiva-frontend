import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import Dropdown from "./index";

const options = [
  { value: "1", label: "Yksi" },
  { value: "2", label: "Kaksi" },
  { value: "3", label: "Kolme" }
];

storiesOf("Dropdown", module).add("default, contained", () => {
  const [state, setState] = useState({
    value: "2",
    requiredValue: ""
  });

  return (
    <div>
      <p>Base case, has callback and initial value</p>
      <Dropdown
        options={options}
        value={state.value}
        onChanges={(payload, { selectedOption }) =>
          setState({ value: selectedOption.value })
        }
        emptyMessage="Clear"
      />
      <p>Value from callback is: {state.value}</p>
      <br />
      <hr />

      <p>Fills container</p>
      <Dropdown
        options={options}
        value={state.value}
        fullWidth={true}
        emptyMessage="Clear"
        onChanges={(payload, { selectedOption }) =>
          setState({ value: selectedOption.value })
        }
      />
      <br />
      <hr />

      <p>Doesn't fill container</p>
      <Dropdown
        options={options}
        value={state.value}
        emptyMessage="Clear"
        onChanges={(payload, { selectedOption }) =>
          setState({ value: selectedOption.value })
        }
      />
      <br />
      <hr />

      <p>With label</p>
      <Dropdown
        options={options}
        value={state.value}
        label="With label"
        emptyMessage="Clear"
        onChanges={(payload, { selectedOption }) =>
          setState({ value: selectedOption.value })
        }
      />
      <br />
      <hr />

      <p>Disabled</p>
      <Dropdown
        options={options}
        value={state.value}
        isDisabled={true}
        emptyMessage="Clear"
        onChanges={(payload, { selectedOption }) =>
          setState({ value: selectedOption.value })
        }
      />

      <hr />

      <p>Required</p>
      <Dropdown
        options={options}
        onChanges={(payload, { selectedOption }) =>
          setState({ requiredValue: selectedOption.value })
        }
        value={state.requiredValue}
        isRequired={true}
        requiredMessage={"field is required"}
        showValidationErrors={true}
        error={state.requiredValue === ""}
        label="label"
        emptyMessage="Clear"
      />
    </div>
  );
});
