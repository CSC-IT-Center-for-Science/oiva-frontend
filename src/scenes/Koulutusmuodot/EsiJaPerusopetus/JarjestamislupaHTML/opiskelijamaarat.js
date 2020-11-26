import React from "react";
import { find } from "ramda";
import { useIntl } from "react-intl";
import common from "../../../../i18n/definitions/common";
import education from "../../../../i18n/definitions/education";
import Typography from "@material-ui/core/Typography";

export default function PoOpiskelijamaaratHtml({ maaraykset }) {
  const intl = useIntl();

  const opiskelijamaaraMaarays = find(maarays => maarays.kohde.tunniste === "oppilasopiskelijamaara" &&
    maarays.koodisto === "kujalisamaareet", maaraykset);

  const lisatietomaarays = find(maarays => maarays.kohde.tunniste === "oppilasopiskelijamaara" &&
    maarays.koodisto === "lisatietoja", maaraykset);

  return opiskelijamaaraMaarays ? (
    <div className="mt-4">
      <Typography component="h3" variant="h3">
        {intl.formatMessage(education.oppilasOpiskelijamaarat)}
      </Typography>
      <ul className="ml-8 list-disc mb-4">
        <li className="leading-bulletList">
          {(opiskelijamaaraMaarays.koodiarvo === "1" ?
            intl.formatMessage(common.enintaan) : intl.formatMessage(common.vahintaan)) + " " +
          opiskelijamaaraMaarays.arvo}
        </li>
      </ul>
      { lisatietomaarays && (lisatietomaarays.meta.arvo)}
    </div>
  ) : null
}