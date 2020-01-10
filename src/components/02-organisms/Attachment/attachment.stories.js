import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import Attachment from "./index";

storiesOf("Attachment", module)
  .addDecorator(withInfo)
  .add("Example 1", () => <Attachment name="example" />);
