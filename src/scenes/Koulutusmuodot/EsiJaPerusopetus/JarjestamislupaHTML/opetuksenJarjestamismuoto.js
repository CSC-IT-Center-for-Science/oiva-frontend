import React, { useEffect, useState } from "react";
import { find, toUpper, isEmpty, propEq } from "ramda";
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

  const lisatietomaarays = find(
    maarays => maarays.kohde.tunniste === "opetuksenjarjestamismuoto" &&
    maarays.koodisto === "lisatietoja", maaraykset);

  return opetuksenJarjestamismuoto && !isEmpty(jarjestamismuodotKoodisto) ? (
    <div className="mt-4">
      <h3 className="font-medium mb-4">{intl.formatMessage(education.opetuksenJarjestamismuoto)}</h3>
      <ul className="ml-8 list-disc mb-4">
        <li key={opetuksenJarjestamismuoto.koodiarvo}>
          {find(propEq("koodiarvo", opetuksenJarjestamismuoto.koodiarvo), jarjestamismuodotKoodisto)
            .metadata[locale].nimi}
        </li>
      </ul>
    </div>
  ) : null
}