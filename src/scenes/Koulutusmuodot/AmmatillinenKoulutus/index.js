import React from "react";
import KoulutusmuodonEtusivu from "components/03-templates/KoulutusmuodonEtusivu";
import AsiaDialogContainer from "./AsiaDialogContainer";
import UusiAsiaDialogContainer from "./UusiAsiaDialogContainer";
import JarjestamislupaJSX from "./JarjestamislupaHTML";
import Jarjestajaluettelo from "./Jarjestajaluettelo";

export default function AmmatillinenKoulutus({ koulutusmuoto }) {
  return (
    <KoulutusmuodonEtusivu
      AsiaDialogContainer={AsiaDialogContainer}
      Jarjestajaluettelo={Jarjestajaluettelo}
      JarjestamislupaJSX={JarjestamislupaJSX}
      koulutusmuoto={koulutusmuoto}
      kuvausteksti={koulutusmuoto.kuvausteksti}
      paasivunOtsikko={koulutusmuoto.paasivunOtsikko}
      jarjestajatOtsikko={koulutusmuoto.jarjestajatOtsikko}
      UusiAsiaDialogContainer={UusiAsiaDialogContainer}></KoulutusmuodonEtusivu>
  );
}
