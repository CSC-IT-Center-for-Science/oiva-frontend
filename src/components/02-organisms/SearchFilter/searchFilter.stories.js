import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import SearchFilter from "./index";

storiesOf("SearchFilter", module)
.addDecorator(withInfo)
.add("Filter example", () => {
  const onValueChanged = (value) => {
    console.info(value);
  };
  return (
    <div>
      <p>Open developer tool console to see callback values.</p>
      <SearchFilter onValueChanged={onValueChanged}/>
    </div>
  )
});
