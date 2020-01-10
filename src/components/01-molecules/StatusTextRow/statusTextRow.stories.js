import React from "react";
import { storiesOf } from "@storybook/react";
import StatusTextRow from "./index";
import { withInfo } from "@storybook/addon-info";
import { isInLupa, isAdded } from "../../../css/label";

storiesOf("StatusTextRow", module)
  .addDecorator(withInfo)
  .add("is added and is in lupa", () => (
    <StatusTextRow labelStyles={Object.assign({}, isInLupa, isAdded)}>
      <div>Example text 1</div>
    </StatusTextRow>
  ));
