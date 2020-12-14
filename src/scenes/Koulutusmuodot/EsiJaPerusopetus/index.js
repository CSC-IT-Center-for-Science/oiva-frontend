import React from "react";
import KoulutusmuodonEtusivu from "components/03-templates/KoulutusmuodonEtusivu";
import AsiaDialogContainer from "./AsiaDialogContainer";
import UusiAsiaDialogContainer from "./Dialogit/Esittelijat/Lupanakyma/LupanakymaDialogContainer";
import JarjestamislupaJSX from "./JarjestamislupaHTML";
import Jarjestajaluettelo from "./Jarjestajaluettelo";

/**
 * Hakuavaimet, joiden perusteella basedata.js täydentään lokaalia
 * tietovarastoa. Näiden avaimien mukaista dataa tarvitaan laajasti kyseisen
 * koulutusmuodon sivuilla.
 **/
const hakuavaimet = [
  "kohteet",
  "kunnat",
  "lisatietoja",
  "lupaByUuid",
  "lupaByYtunnus",
  "maakuntakunnat",
  "maaraystyypit",
  "opetustehtavakoodisto",
  "opetustehtavat",
  "organisaatio",
  "poErityisetKoulutustehtavat",
  "poMuutEhdot",
  "tulevatLuvat",
  "kieletOPH"
];

export default function EsiJaPerusopetus({ koulutusmuoto }) {
  return (
    <KoulutusmuodonEtusivu
      AsiaDialogContainer={AsiaDialogContainer}
      hakuavaimet={hakuavaimet}
      Jarjestajaluettelo={Jarjestajaluettelo}
      JarjestamislupaJSX={JarjestamislupaJSX}
      koulutusmuoto={koulutusmuoto}
      kuvausteksti={koulutusmuoto.kuvausteksti}
      paasivunOtsikko={koulutusmuoto.paasivunOtsikko}
      jarjestajatOtsikko={koulutusmuoto.jarjestajatOtsikko}
      UusiAsiaDialogContainer={UusiAsiaDialogContainer}></KoulutusmuodonEtusivu>
  );
}
