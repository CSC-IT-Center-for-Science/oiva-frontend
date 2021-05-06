import React from "react";
import { storiesOf } from "@storybook/react";
import Footer from ".";
import { withInfo } from "@storybook/addon-info";

storiesOf("Footer", module)
  .addDecorator(withInfo)
  .add("Renders with the correct layout", () => <Footer />);
