import React from "react";
import { storiesOf } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import Lomake from "../../../02-organisms/Lomake";

storiesOf("Lomakkeet/Perustelut/Kuljettajakoulutukset/Jatkokoulutus", module)
  .addDecorator(withInfo)
  .add("Lisääminen", () => {
    return (
      <Lomake
        anchor={"perustelut_koulutukset_kuljettajakoulutukset"}
        changeObjects={[]}
        isReadOnly={true}
        onChangesUpdate={() => {}}
        path={["koulutukset", "kuljettajakoulutukset", "jatkokoulutus"]}
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
        isReadOnly={true}
        onChangesUpdate={() => {}}
        path={["koulutukset", "kuljettajakoulutukset", "jatkokoulutus"]}
        showCategoryTitles={true}
      ></Lomake>
    );
  });
