import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import Tyovoimakoulutuslomake from "./index";

storiesOf("Lomakkeet/Muut", module)
  .addDecorator(withInfo)
  .add("Tyovoimakoulutuslomake", () => {
    const changes = [

    ];
    return (
      <Tyovoimakoulutuslomake
        changes={changes}
      ></Tyovoimakoulutuslomake>
    );
  });
