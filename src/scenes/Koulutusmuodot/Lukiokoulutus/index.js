import React from "react";
import KoulutusmuodonEtusivu from "components/03-templates/KoulutusmuodonEtusivu";
import JarjestamislupaJSX from "./JarjestamislupaHTML";
import Jarjestajaluettelo from "./Jarjestajaluettelo";
import WizardContainer from "./WizardContainer";
import { getKoulutusmuodot } from "utils/common";
import { useIntl } from "react-intl";

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
  "lupaByOid",
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

export default function Lukio() {
  const { formatMessage } = useIntl();

  const koulutusmuoto = getKoulutusmuodot(formatMessage).lukiokoulutus;

  return (
    <KoulutusmuodonEtusivu
      hakuavaimet={hakuavaimet}
      Jarjestajaluettelo={Jarjestajaluettelo}
      jarjestajatOtsikko={koulutusmuoto.jarjestajatOtsikko}
      JarjestamislupaJSX={JarjestamislupaJSX}
      koulutusmuoto={koulutusmuoto}
      kuvausteksti={koulutusmuoto.kuvausteksti}
      paasivunOtsikko={koulutusmuoto.paasivunOtsikko}
      WizardContainer={WizardContainer}
    ></KoulutusmuodonEtusivu>
  );
}
