import React from "react";
import educationMessages from "../../i18n/definitions/education";
import { useIntl } from "react-intl";
import KoulutusmuodonEtusivu from "components/03-templates/KoulutusmuodonEtusivu";
import AsiaDialogContainer from "./AsiaDialogContainer";
import UusiAsiaDialogContainer from "./UusiAsiaDialogContainer";
import JarjestamislupaJSX from "./JarjestamislupaHTML";
import Jarjestajaluettelo from "./Jarjestajaluettelo";

const koulutusmuoto = {
  kebabCase: "ammatillinenkoulutus"
};

export default function AmmatillinenKoulutus() {
  const { formatMessage } = useIntl();

  return (
    <KoulutusmuodonEtusivu
      AsiaDialogContainer={AsiaDialogContainer}
      Jarjestajaluettelo={Jarjestajaluettelo}
      JarjestamislupaJSX={JarjestamislupaJSX}
      koulutusmuoto={koulutusmuoto}
      kuvausteksti="Ammatillisen koulutuksen kuvaus tulee tähän."
      sivunOtsikko={formatMessage(educationMessages.vocationalEducation)}
      UusiAsiaDialogContainer={UusiAsiaDialogContainer}></KoulutusmuodonEtusivu>
  );
}
