import React from "react";
import { storiesOf } from "@storybook/react";
import SimpleButton from "./index";

storiesOf("SimpleButton", module).add("default, contained", () => (
  <SimpleButton text="Text is here" variant="contained" />
));
