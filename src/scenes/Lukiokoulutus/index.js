import React from "react";
import educationMessages from "i18n/definitions/education";
import { useIntl } from "react-intl";
import KoulutusmuodonEtusivu from "components/03-templates/KoulutusmuodonEtusivu";
import AsiaDialogContainer from "./AsiaDialogContainer";
import UusiAsiaDialogContainer from "./UusiAsiaDialogContainer";
import Jarjestajaluettelo from "./Jarjestajaluettelo";
import JarjestamislupaJSX from "./JarjestamislupaHTML";

const koulutusmuoto = {
  kebabCase: "lukiokoulutus",
  koulutustyyppi: "2"
};

export default function Lukio() {
  const { formatMessage } = useIntl();

  return (
    <KoulutusmuodonEtusivu
      AsiaDialogContainer={AsiaDialogContainer}
      Jarjestajaluettelo={Jarjestajaluettelo}
      JarjestamislupaJSX={JarjestamislupaJSX}
      koulutusmuoto={koulutusmuoto}
      kuvausteksti="Lukiokoulutuksen kuvaus tulee tähän."
      sivunOtsikko={formatMessage(educationMessages.highSchoolEducation)}
      UusiAsiaDialogContainer={UusiAsiaDialogContainer}></KoulutusmuodonEtusivu>
  );
}
