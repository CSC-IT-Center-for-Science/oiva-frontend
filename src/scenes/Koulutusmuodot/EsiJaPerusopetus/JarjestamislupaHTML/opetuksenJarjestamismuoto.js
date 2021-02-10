import React from "react";
import { find, includes, path } from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";
import Typography from "@material-ui/core/Typography";

export default function PoOpetuksenJarjestamismuotoHtml({ maaraykset }) {
  const intl = useIntl();

  const opetuksenJarjestamismuoto = find(
    maarays =>
      maarays.kohde.tunniste === "opetuksenjarjestamismuoto" &&
      maarays.koodisto === "opetuksenjarjestamismuoto",
    maaraykset
  );

  const lisatietomaarays = find(
    maarays =>
      maarays.kohde.tunniste === "opetuksenjarjestamismuoto" &&
      maarays.koodisto === "lisatietoja",
    maaraykset
  );

  const jarjestamismuodonKuvaus = opetuksenJarjestamismuoto
    ? path(
        ["properties", "value"],
        find(
          changeObj => includes("kuvaus", changeObj.anchor),
          opetuksenJarjestamismuoto.meta.changeObjects
        )
      )
    : null;

  return opetuksenJarjestamismuoto || lisatietomaarays ? (
    <div className="mt-4">
      <Typography component="h3" variant="h3">
        {intl.formatMessage(education.opetuksenJarjestamismuoto)}
      </Typography>
      {opetuksenJarjestamismuoto ? (
        <ul className="ml-8 list-disc mb-4">
          <li key={opetuksenJarjestamismuoto.koodiarvo}>
            {jarjestamismuodonKuvaus}
          </li>
        </ul>
      ) : null}
      {lisatietomaarays && lisatietomaarays.meta.arvo}
    </div>
  ) : null;
}
