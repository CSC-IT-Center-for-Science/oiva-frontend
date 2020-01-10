import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import Attachments from "./index";

storiesOf("Attachments", module)
  .addDecorator(withInfo)
  .add("Example 1", () => <Attachments name="example" />);
