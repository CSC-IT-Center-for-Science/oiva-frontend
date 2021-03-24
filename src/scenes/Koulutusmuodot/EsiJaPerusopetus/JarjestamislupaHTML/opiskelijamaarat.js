import React from "react";
import {
  addIndex,
  filter,
  find,
  isEmpty,
  length,
  map,
  path,
  pathEq,
  toUpper
} from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";
import Typography from "@material-ui/core/Typography";
import { getRajoitteetFromMaarays } from "../../../../utils/rajoitteetUtils";
import opiskelijamaara from "../../../../i18n/definitions/opiskelijamaara";
import { __ } from "i18n-for-browser";
import LisatiedotHtmlLupa from "../../../LisatiedotHtmlLupa";

export default function PoOpiskelijamaaratHtml({ maaraykset }) {
  const intl = useIntl();
  const locale = toUpper(intl.locale);

  const opiskelijamaaraMaaraykset = filter(
    maarays =>
      pathEq(["kohde", "tunniste"], "oppilasopiskelijamaara", maarays) &&
      maarays.koodisto === "kujalisamaareet",
    maaraykset
  );

  const hasKokonaisopiskelijamaararajoite = !!find(
    maarays => path(["meta", "tyyppi"], maarays) === "kokonaismaara",
    opiskelijamaaraMaaraykset
  );

  const lisatietomaarays = find(
    maarays =>
      pathEq(["kohde", "tunniste"], "oppilasopiskelijamaara", maarays) &&
      maarays.koodisto === "lisatietoja",
    maaraykset
  );

  return !isEmpty(opiskelijamaaraMaaraykset) ? (
    <div className="mt-4">
      <Typography component="h3" variant="h3">
        {intl.formatMessage(education.oppilasOpiskelijamaarat)}
      </Typography>
      {!hasKokonaisopiskelijamaararajoite && (
        <ul key="kokonaisopiskelijamaara-ei-rajattu" className="ml-8 list-disc">
          <li className="leading-bulletList">
            {__("opiskelijamaara.kokonaismaaraEiRajattu")}
          </li>
        </ul>
      )}
      {addIndex(map)(
        (maarays, index) => [
          <ul key={"opiskelijamaara-" + index} className="ml-8 list-disc">
            <li className="leading-bulletList">
              {maarays.meta.tyyppi === "yksittainen"
                ? intl.formatMessage(
                    opiskelijamaara.yksittainenKohdennus,
                    locale
                  )
                : intl.formatMessage(opiskelijamaara.kokonaismaara, locale)}
              {": "}
              {path(
                ["nimi"],
                find(
                  metadata => metadata.kieli === locale,
                  path(["koodi", "metadata"], maarays)
                )
              )}{" "}
              {maarays.arvo}
            </li>
            <ul key={maarays.arvo + "-" + index} className="list-disc">
              <React.Fragment>
                {length(maarays.aliMaaraykset)
                  ? getRajoitteetFromMaarays(maarays.aliMaaraykset, locale)
                  : ""}
              </React.Fragment>
            </ul>
          </ul>
        ],
        opiskelijamaaraMaaraykset || []
      )}
      <LisatiedotHtmlLupa lisatietomaarays={lisatietomaarays} />
    </div>
  ) : null;
}
