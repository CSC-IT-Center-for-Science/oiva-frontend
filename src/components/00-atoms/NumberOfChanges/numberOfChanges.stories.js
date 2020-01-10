import React from "react";
import { storiesOf } from "@storybook/react";
import NumberOfChanges from "./index";
import { withInfo } from "@storybook/addon-info";
import centered from "@storybook/addon-centered/react";

storiesOf("NumberOfChanges", module)
  .addDecorator(centered)
  .addDecorator(withInfo)
  .add("no changes", () => <NumberOfChanges changes={[]} />)
  .add("9 changes", () => <NumberOfChanges changes={new Array(9)} />);
