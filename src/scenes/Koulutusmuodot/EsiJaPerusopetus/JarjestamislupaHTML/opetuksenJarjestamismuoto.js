import React from "react";
import { find, length, path, toUpper } from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";
import Typography from "@material-ui/core/Typography";
import { getRajoitteetFromMaarays } from "../../../../utils/rajoitteetUtils";

export default function PoOpetuksenJarjestamismuotoHtml({ maaraykset }) {
  const intl = useIntl();
  const locale = toUpper(intl.locale);

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

  const jarjestamismuodonMetadata = opetuksenJarjestamismuoto
    ? find(
        metadata => metadata.kieli === locale,
        path(["koodi", "metadata"], opetuksenJarjestamismuoto)
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
            {jarjestamismuodonMetadata.nimi}
          </li>
          <>
            {length(opetuksenJarjestamismuoto.aliMaaraykset)
              ? getRajoitteetFromMaarays(
                  opetuksenJarjestamismuoto.aliMaaraykset,
                  locale
                )
              : ""}
          </>
        </ul>
      ) : null}
      {lisatietomaarays && lisatietomaarays.meta.arvo}
    </div>
  ) : null;
}
