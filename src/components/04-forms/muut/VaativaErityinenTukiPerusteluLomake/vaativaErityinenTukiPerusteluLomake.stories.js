import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import VaativaErityinenTukiPerusteluLomake from "./index";

storiesOf("Lomakkeet/Muut", module)
  .addDecorator(withInfo)
  .add("VaativaErityinenTukiPerusteluLomake", () => {
    const changes = [];
    return (
      <VaativaErityinenTukiPerusteluLomake
        changes={changes}
      ></VaativaErityinenTukiPerusteluLomake>
    );
  });
