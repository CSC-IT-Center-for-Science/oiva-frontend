import React from "react";
import KoulutusmuodonEtusivu from "components/03-templates/KoulutusmuodonEtusivu";
import Jarjestajaluettelo from "./Jarjestajaluettelo";
import JarjestamislupaJSX from "./JarjestamislupaHTML";
import { useIntl } from "react-intl";
import { getKoulutusmuodot } from "utils/common";

export default function Lukio() {
  const { formatMessage } = useIntl();

  const koulutusmuoto = getKoulutusmuodot(formatMessage).lukiokoulutus;

  return (
    <KoulutusmuodonEtusivu
      Jarjestajaluettelo={Jarjestajaluettelo}
      JarjestamislupaJSX={JarjestamislupaJSX}
      koulutusmuoto={koulutusmuoto}
      kuvausteksti={koulutusmuoto.kuvausteksti}
      paasivunOtsikko={koulutusmuoto.paasivunOtsikko}
      jarjestajatOtsikko={koulutusmuoto.jarjestajatOtsikko}
    ></KoulutusmuodonEtusivu>
  );
}
