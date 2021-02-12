import React from "react";
import KoulutusmuodonEtusivu from "components/03-templates/KoulutusmuodonEtusivu";
import JarjestamislupaJSX from "./JarjestamislupaHTML";
import JarjestajaluetteloFiltteroinnilla from "./JarjestajaluetteloFiltteroinnilla";
import { useIntl } from "react-intl";
import { getKoulutusmuodot } from "utils/common";

/**
 * Hakuavaimet, joiden perusteella basedata.js täydentään lokaalia
 * tietovarastoa. Näiden avaimien mukaista dataa tarvitaan laajasti kyseisen
 * koulutusmuodon sivuilla.
 **/
const hakuavaimet = ["lupaByUuid", "organisaatio", "vstTyypit"];

export default function VapaaSivistystyo() {
  const { formatMessage } = useIntl();

  const koulutusmuoto = getKoulutusmuodot(formatMessage).vapaaSivistystyo;

  return (
    <KoulutusmuodonEtusivu
      hakuavaimet={hakuavaimet}
      Jarjestajaluettelo={JarjestajaluetteloFiltteroinnilla}
      JarjestamislupaJSX={JarjestamislupaJSX}
      koulutusmuoto={koulutusmuoto}
      kuvausteksti={koulutusmuoto.kuvausteksti}
      paasivunOtsikko={koulutusmuoto.paasivunOtsikko}
      jarjestajatOtsikko={koulutusmuoto.jarjestajatOtsikko}
    ></KoulutusmuodonEtusivu>
  );
}
