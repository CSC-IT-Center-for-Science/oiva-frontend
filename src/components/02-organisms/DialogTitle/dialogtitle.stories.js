import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import DialogTitle from "./index";

storiesOf("Dialog Title", module)
  .addDecorator(withInfo)
  .add("Example 1",
    () =>
      <DialogTitle
        onClose={() => console.log('close')}
      >
        Hello World!
      </DialogTitle>
        );
