import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import Lomake from "../../../02-organisms/Lomake";

storiesOf("Lomakkeet/Perustelut/Työvoimakoulutus", module)
  .addDecorator(withInfo)
  .add("Lisääminen", () => {
    const changeObjects = [];
    return (
      <Lomake
        path={["koulutukset", "tyovoimakoulutukset"]}
        changeObjects={changeObjects}
        onChangesUpdate={() => {}}
      ></Lomake>
    );
  })
  .add("Poistaminen", () => {
    const changeObjects = [];
    return (
      <Lomake
        action="removal"
        path={["koulutukset", "tyovoimakoulutukset"]}
        changeObjects={changeObjects}
        onChangesUpdate={() => {}}
      ></Lomake>
    );
  });
