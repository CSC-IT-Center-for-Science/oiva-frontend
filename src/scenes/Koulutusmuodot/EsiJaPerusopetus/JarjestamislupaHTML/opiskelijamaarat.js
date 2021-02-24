import React from "react";
import {
  addIndex,
  filter,
  find,
  isEmpty,
  length,
  map,
  path,
  toUpper
} from "ramda";
import { useIntl } from "react-intl";
import education from "../../../../i18n/definitions/education";
import Typography from "@material-ui/core/Typography";
import { getRajoitteetFromMaarays } from "../../../../utils/rajoitteetUtils";
import opiskelijamaara from "../../../../i18n/definitions/opiskelijamaara";

export default function PoOpiskelijamaaratHtml({ maaraykset }) {
  const intl = useIntl();
  const locale = toUpper(intl.locale);

  const opiskelijamaaraMaaraykset = filter(
    maarays =>
      maarays.kohde.tunniste === "oppilasopiskelijamaara" &&
      maarays.koodisto === "kujalisamaareet",
    maaraykset
  );

  const lisatietomaarays = find(
    maarays =>
      maarays.kohde.tunniste === "oppilasopiskelijamaara" &&
      maarays.koodisto === "lisatietoja",
    maaraykset
  );

  return !isEmpty(opiskelijamaaraMaaraykset) ? (
    <div className="mt-4">
      <Typography component="h3" variant="h3">
        {intl.formatMessage(education.oppilasOpiskelijamaarat)}
      </Typography>

      {addIndex(map)(
        (maarays, index) => [
          <ul key={"opiskelijamaara-" + index} className="ml-8 list-disc">
            <li className="leading-bulletList">
              {/*<strong>*/}
                {maarays.meta.tyyppi === "yksittainen"
                  ? intl.formatMessage(
                      opiskelijamaara.yksittainenKohdennus,
                      locale
                    )
                  : intl.formatMessage(opiskelijamaara.kokonaismaara, locale)}
              {/*</strong>*/}
              {": "}{path(
                ["nimi"],
                find(
                  metadata => metadata.kieli === locale,
                  path(["koodi", "metadata"], maarays)
                )
              )}{" "}{maarays.arvo}
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
      {lisatietomaarays && lisatietomaarays.meta.arvo}
    </div>
  ) : null;
}
