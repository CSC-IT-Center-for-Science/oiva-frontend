import React from "react";
import { find, length, path, toUpper } from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";
import Typography from "@material-ui/core/Typography";
import { getRajoitteetFromMaarays } from "../../../../utils/rajoitteetUtils";
import { getLocalizedProperty } from "services/lomakkeet/utils";
import LisatiedotHtmlLupa from "../../../LisatiedotHtmlLupa";
import rajoitteet from "../../../../i18n/definitions/rajoitteet";

export default function OikeusSisaoppilaitosmuotoiseenKoulutukseenHtml({
  maaraykset
}) {
  const intl = useIntl();
  const locale = toUpper(intl.locale);

  const opetuksenJarjestamismuoto = find(
    maarays =>
      maarays.kohde.tunniste === "sisaoppilaitosmuotoinenkoulutus" &&
      maarays.koodisto === "lukiooikeussisaooppilaitosmuotoiseenkoulutukseen",
    maaraykset
  );

  const lisatietomaarays = find(
    maarays =>
      maarays.kohde.tunniste === "sisaoppilaitosmuotoinenkoulutus" &&
      maarays.koodisto === "lisatietoja",
    maaraykset
  );

  let kuvaus = null;
  if (opetuksenJarjestamismuoto) {
    const jarjestamismuodonMetadata = path(
      ["koodi", "metadata"],
      opetuksenJarjestamismuoto
    );
    kuvaus =
      opetuksenJarjestamismuoto.meta.kuvaus ||
      getLocalizedProperty(jarjestamismuodonMetadata, locale, "kuvaus");
  }

  return opetuksenJarjestamismuoto || lisatietomaarays ? (
    <div className="mt-4">
      <Typography component="h3" variant="h3">
        {intl.formatMessage(education.opetuksenJarjestamismuoto)}
      </Typography>
      {opetuksenJarjestamismuoto ? (
        <ul className="ml-8 list-disc mb-4">
          <li key={opetuksenJarjestamismuoto.koodiarvo}>{kuvaus}</li>
          <React.Fragment>
            {length(opetuksenJarjestamismuoto.aliMaaraykset)
              ? getRajoitteetFromMaarays(
                  opetuksenJarjestamismuoto.aliMaaraykset,
                  locale,
                  intl.formatMessage(rajoitteet.ajalla)
                )
              : ""}
          </React.Fragment>
        </ul>
      ) : null}
      <LisatiedotHtmlLupa lisatietomaarays={lisatietomaarays} />
    </div>
  ) : null;
}
