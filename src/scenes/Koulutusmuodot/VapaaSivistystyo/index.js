import React from "react";
import KoulutusmuodonEtusivu from "components/03-templates/KoulutusmuodonEtusivu";
import JarjestamislupaJSX from "./JarjestamislupaHTML";
import JarjestajaluetteloFiltteroinnilla from "./JarjestajaluetteloFiltteroinnilla";

export default function VapaaSivistystyo({ koulutusmuoto }) {
  return (
    <KoulutusmuodonEtusivu
      Jarjestajaluettelo={JarjestajaluetteloFiltteroinnilla}
      JarjestamislupaJSX={JarjestamislupaJSX}
      koulutusmuoto={koulutusmuoto}
      kuvausteksti={koulutusmuoto.kuvausteksti}
      sivunOtsikko={koulutusmuoto.sivunOtsikko}></KoulutusmuodonEtusivu>
  );
}
