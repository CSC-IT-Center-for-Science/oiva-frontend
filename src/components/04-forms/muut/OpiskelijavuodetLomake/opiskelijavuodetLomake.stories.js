import React from "react";
import {storiesOf} from "@storybook/react";
import {withInfo} from "@storybook/addon-info";
import OpiskelijavuodetVahimmaisopiskelijavuosimaaraPerustelulomake from "./Vahimmaisopiskelijavuosimaara";
import OpiskelijavuodetSisaoppilaitosmuotoinenOpetusPerustelulomake from "./SisamuotoinenOpetus";
import OpiskelijavuodetVaativaKoulutusPerustelulomake from "./VaativaKoulutus";

storiesOf("Lomakkeet/Muut/Opiskelijavuodet", module)
  .addDecorator(withInfo)
  .add("Vahimmaisopiskelijavuosimaara perustelulomake", () => {
    const changes = [];
    return (
      <OpiskelijavuodetVahimmaisopiskelijavuosimaaraPerustelulomake
        changes={changes}
      ></OpiskelijavuodetVahimmaisopiskelijavuosimaaraPerustelulomake>
    );
  })
  .add("Sisaoppilaitosmuotoinen opetus perustelulomake", () => {
    const changes = [];
    return (
      <OpiskelijavuodetSisaoppilaitosmuotoinenOpetusPerustelulomake
        changes={changes}
      ></OpiskelijavuodetSisaoppilaitosmuotoinenOpetusPerustelulomake>
    );
  })
  .add("Vaativa koulutus perustelulomake", () => {
    const changes = [];
    return (
      <OpiskelijavuodetVaativaKoulutusPerustelulomake
        changes={changes}
      ></OpiskelijavuodetVaativaKoulutusPerustelulomake>
    );
  });
