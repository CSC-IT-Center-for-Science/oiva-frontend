import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import OppisopimusPerusteluLomake from "./index";

storiesOf("Lomakkeet/Muut", module)
  .addDecorator(withInfo)
  .add("OppisopimusPerusteluLomake", () => {
    const changes = [];
    return (
      <OppisopimusPerusteluLomake
        changes={changes}
      ></OppisopimusPerusteluLomake>
    );
  });
