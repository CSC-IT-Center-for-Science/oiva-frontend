import React from "react";
import KoulutusmuodonEtusivu from "components/03-templates/KoulutusmuodonEtusivu";
import JarjestamislupaJSX from "./JarjestamislupaHTML";
import Jarjestajaluettelo from "./Jarjestajaluettelo";
import WizardContainer from "./WizardContainer";
import { useIntl } from "react-intl";
import { getKoulutusmuodot } from "utils/common";

/**
 * Hakuavaimet, joiden perusteella basedata.js täydentään lokaalia
 * tietovarastoa. Näiden avaimien mukaista dataa tarvitaan laajasti kyseisen
 * koulutusmuodon sivuilla.
 **/
const hakuavaimet = [
  "kielet",
  "kohteet",
  "kunnat",
  "lisatietoja",
  "lupaByUuid",
  "lupaByOid",
  "maakuntakunnat",
  "organisaatio",
  "tulevatLuvat"
];

export default function AmmatillinenKoulutus() {
  const { formatMessage } = useIntl();

  const koulutusmuoto = getKoulutusmuodot(formatMessage).ammatillinenKoulutus;

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
