import React from "react";
import {storiesOf} from "@storybook/react";
import Dropdown from "./index";
import {withState} from "components/01-molecules/Stepper/node_modules/@dump247/storybook-state";

const options = [
  {value: "1", label: "один"},
  {value: "2", label: "два"},
  {value: "3", label: "три"}
];

const initialState = {
  value: "2",
  requiredValue: ""
}


storiesOf("Dropdown", module)
  .add(
    "default, contained",
    withState(initialState)(({store}) => (
        <div>
          <p>Base case, has callback and initial value</p>
          <Dropdown
            options={options}
            value={store.state.value}
            onChanges={(payload, {selectedOption}) => store.set({value: selectedOption.value})}
            emptyMessage="Clear"
          />
          <p>Value from callback is: {store.state.value}</p>
          <br/>
          <hr/>

          <p>Fills container</p>
          <Dropdown
            options={options}
            fullWidth={true}
            emptyMessage="Clear"
          />
          <br/>
          <hr/>

          <p>Doesn't fill container</p>
          <Dropdown
            options={options}
            emptyMessage="Clear"
          />
          <br/>
          <hr/>

          <p>With label</p>
          <Dropdown
            options={options}
            label="With label"
            emptyMessage="Clear"
          />
          <br/>
          <hr/>

          <p>Disabled</p>
          <Dropdown
            options={options}
            value={3}
            isDisabled={true}
            emptyMessage="Clear"
          />

          <br/>
          <hr/>
          <p>Required</p>
          <Dropdown
            options={options}
            onChanges={(payload, {selectedOption}) => store.set({requiredValue: selectedOption.value})}
            value={store.state.requiredValue}
            isRequired={true}
            requiredMessage={"field is required"}
            showValidationErrors={true}
            error={store.state.requiredValue === ''}
            label="label"
            emptyMessage="Clear"
          />
        </div>
      )
    ));
