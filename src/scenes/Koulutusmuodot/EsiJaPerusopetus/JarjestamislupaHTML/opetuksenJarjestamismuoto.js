import React, { useEffect, useState } from "react";
import { find, toUpper, isEmpty } from "ramda";
import { useIntl } from "react-intl";
import { getOpetuksenJarjestamismuodotFromStorage } from "../../../../helpers/opetuksenJarjestamismuodot";
import education from "../../../../i18n/definitions/education";

export default function PoOpetuksenJarjestamismuotoHtml({ maaraykset }) {
  const intl = useIntl();
  const locale = toUpper(intl.locale);
  const [jarjestamismuodotKoodisto, setJarjestamismuodotKoodisto] = useState([]);

  /** Fetch opetuksenJarjestamismuodot from storage */
  useEffect(() => {
    getOpetuksenJarjestamismuodotFromStorage().then(jarjestamismuodot =>
      setJarjestamismuodotKoodisto(jarjestamismuodot)
    ).catch(err => {
      console.error(err);
    });
  }, []);

  const opetuksenJarjestamismuoto = find(
    maarays => maarays.kohde.tunniste === "opetuksenjarjestamismuoto" &&
    maarays.koodisto === "opetuksenjarjestamismuoto",
    maaraykset);

  const lisatietoMaarays = find(maarays => maarays.kohde.tunniste === "opetuksenjarjestamismuoto" &&
    maarays.koodisto === "lisatietoja", maaraykset);

  return opetuksenJarjestamismuoto && !isEmpty(jarjestamismuodotKoodisto) ? (
    <div className={"pt-8 pb-4"}>
      <h1 className="font-medium mb-4">{intl.formatMessage(education.opetuksenJarjestamismuoto)}</h1>
      <ul className="ml-8 list-disc mb-4">
        <li key={opetuksenJarjestamismuoto.koodiarvo} style={{"lineHeight": "1.325"}}>
          {find(koodistoObj => opetuksenJarjestamismuoto.koodiarvo === koodistoObj.koodiarvo, jarjestamismuodotKoodisto)
            .metadata[locale].nimi}
        </li>
      </ul>
    </div>
  ) : null
}