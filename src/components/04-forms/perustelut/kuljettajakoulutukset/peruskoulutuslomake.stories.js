import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import Lomake from "../../../02-organisms/Lomake";

storiesOf("Lomakkeet/Perustelut/Kuljettajakoulutukset/Peruskoulutus", module)
  .addDecorator(withInfo)
  .add("Lisääminen", () => {
    return (
      <Lomake
        anchor={"perustelut_koulutukset_kuljettajakoulutukset"}
        changeObjects={[]}
        isReadOnly={false}
        onChangesUpdate={() => {}}
        path={["koulutukset", "kuljettajakoulutukset", "peruskoulutus"]}
        showCategoryTitles={true}
      ></Lomake>
    );
  })
  .add("Poistaminen", () => {
    return (
      <Lomake
        action={"removal"}
        anchor={"perustelut_koulutukset_kuljettajakoulutukset"}
        changeObjects={[]}
        isReadOnly={false}
        onChangesUpdate={() => {}}
        path={["koulutukset", "kuljettajakoulutukset", "peruskoulutus"]}
        showCategoryTitles={true}
      ></Lomake>
    );
  });
