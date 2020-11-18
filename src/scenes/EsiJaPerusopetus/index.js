import React from "react";
import educationMessages from "../../i18n/definitions/education";
import { useIntl } from "react-intl";
import KoulutusmuodonEtusivu from "components/03-templates/KoulutusmuodonEtusivu";
import AsiaDialogContainer from "./AsiaDialogContainer";
import UusiAsiaDialogContainer from "./UusiAsiaDialogContainer";
import JarjestamislupaJSX from "./JarjestamislupaHTML";

const koulutusmuoto = {
  kebabCase: "esi-ja-perusopetus",
  koulutustyyppi: 1
};

export default function EsiJaPerusopetus() {
  const { formatMessage } = useIntl();

  return (
    <KoulutusmuodonEtusivu
      AsiaDialogContainer={AsiaDialogContainer}
      JarjestamislupaJSX={JarjestamislupaJSX}
      koulutusmuoto={koulutusmuoto}
      kuvausteksti="Esi- ja perusopetuksen kuvaus tulee tähän."
      sivunOtsikko={formatMessage(educationMessages.preAndBasicEducation)}
      UusiAsiaDialogContainer={UusiAsiaDialogContainer}></KoulutusmuodonEtusivu>
  );
}
