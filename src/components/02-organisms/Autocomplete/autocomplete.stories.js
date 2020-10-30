import React from "react";
import { storiesOf } from "@storybook/react";
import Autocomplete from "./index";
import { withInfo } from "@storybook/addon-info";
import { heights } from "../../../css/autocomplete";

storiesOf("Autocomplete", module)
  .addDecorator(withInfo)
  .add("Example 1", () => (
    <div>
      <br />
      <Autocomplete
        name="example"
        options={[
          { label: "Aaaaaaaa", value: "Aaaaaaaa" },
          { label: "Bbbbbb", value: "Bbbbbb" },
          { label: "Ccccccccccc", value: "Ccccccccccc" }
        ]}
        callback={(payload, values) => {
          console.log(values.value[0]);
        }}
        isRequired
        title="test"
      />
      <br />
      <Autocomplete
        name="filter example"
        options={[
          { label: "Aaaaaaaa", value: "Aaaaaaaa" },
          { label: "Bbbbbb", value: "Bbbbbb" },
          { label: "Ccccccccccc", value: "Ccccccccccc" }
        ]}
        isSearch
        callback={(payload, values) => {
          console.log(values.value[0]);
        }}
      />
    </div>
  ))
  .add("Short height", () => (
    <div>
      <br />
      <Autocomplete
        name="example"
        options={[
          { label: "Aaaaaaaa", value: "Aaaaaaaa" },
          { label: "Bbbbbb", value: "Bbbbbb" },
          { label: "Ccccccccccc", value: "Ccccccccccc" }
        ]}
        height={heights.SHORT}
        callback={(payload, values) => {
          console.log(values.value[0]);
        }}
      />
    </div>
  ))
  .add("Short width", () => (
    <div>
      <br/>
      <Autocomplete
        name="example"
        options={[
          { label: "Aaaaaaaa", value: "Aaaaaaaa" },
          { label: "Bbbbbb", value: "Bbbbbb" },
          { label: "Ccccccccccc", value: "Ccccccccccc" }
        ]}
        short={true}
        callback={(payload, values) => {
          console.log(values.value[0]);
        }}
      />
    </div>
  ));
