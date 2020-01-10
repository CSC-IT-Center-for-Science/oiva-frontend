import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import VankilaopetusPeustelulomake from "./index";

storiesOf("Lomakkeet/Muut", module)
  .addDecorator(withInfo)
  .add("VankilaopetusPeustelulomake", () => {
    const changes = [
      {
        anchor: "lomake.vankilaopetus.field.A",
        properties: {
          value: "Merkkijono"
        }
      }
    ];
    return (
      <VankilaopetusPeustelulomake
        changes={changes}
      ></VankilaopetusPeustelulomake>
    );
  });
