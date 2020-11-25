import React from "react";
import { find, includes } from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";

export default function PoOpetuksenJarjestamismuotoHtml({ maaraykset }) {
  const intl = useIntl();

  const opetuksenJarjestamismuoto = find(
    maarays => maarays.kohde.tunniste === "opetuksenjarjestamismuoto" &&
    maarays.koodisto === "opetuksenjarjestamismuoto",
    maaraykset);

  const lisatietomaarays = find(
    maarays => maarays.kohde.tunniste === "opetuksenjarjestamismuoto" &&
    maarays.koodisto === "lisatietoja", maaraykset);

  const jarjestamismuodonKuvaus = opetuksenJarjestamismuoto ?
    find(changeObj => includes("kuvaus", changeObj.anchor),
      opetuksenJarjestamismuoto.meta.changeObjects).properties.value : null

  return opetuksenJarjestamismuoto ? (
    <div className="mt-4">
      <h3 className="font-medium mb-4">{intl.formatMessage(education.opetuksenJarjestamismuoto)}</h3>
      <ul className="ml-8 list-disc mb-4">
        <li key={opetuksenJarjestamismuoto.koodiarvo}>
          {jarjestamismuodonKuvaus}
        </li>
      </ul>
    </div>
  ) : null
}