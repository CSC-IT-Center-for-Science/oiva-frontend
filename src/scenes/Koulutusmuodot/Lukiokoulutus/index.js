import React from "react";
import KoulutusmuodonEtusivu from "components/03-templates/KoulutusmuodonEtusivu";
import Jarjestajaluettelo from "./Jarjestajaluettelo";
import JarjestamislupaJSX from "./JarjestamislupaHTML";

export default function Lukio({ koulutusmuoto }) {
  return (
    <KoulutusmuodonEtusivu
      Jarjestajaluettelo={Jarjestajaluettelo}
      JarjestamislupaJSX={JarjestamislupaJSX}
      koulutusmuoto={koulutusmuoto}
      kuvausteksti={koulutusmuoto.kuvausteksti}
      paasivunOtsikko={koulutusmuoto.paasivunOtsikko}
      jarjestajatOtsikko={koulutusmuoto.jarjestajatOtsikko}></KoulutusmuodonEtusivu>
  );
}
