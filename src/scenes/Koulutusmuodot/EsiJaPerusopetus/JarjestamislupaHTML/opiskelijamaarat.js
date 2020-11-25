import React from "react";
import { find } from "ramda";
import { useIntl } from "react-intl";
import common from "../../../../i18n/definitions/common";
import education from "../../../../i18n/definitions/education";

export default function PoOpiskelijamaaratHtml({ maaraykset }) {
  const intl = useIntl();

  const opiskelijamaaraMaarays = find(maarays => maarays.kohde.tunniste === "oppilasopiskelijamaara" &&
    maarays.koodisto === "kujalisamaareet", maaraykset);

  return opiskelijamaaraMaarays ? (
    <div className="mt-4">
      <h3 className="font-medium mb-4">{intl.formatMessage(education.oppilasOpiskelijamaarat)}</h3>
      <ul className="ml-8 list-disc mb-4">
        <li className="leading-bulletList">
          {(opiskelijamaaraMaarays.koodiarvo === "1" ?
            intl.formatMessage(common.enintaan) : intl.formatMessage(common.vahintaan)) + " " +
          opiskelijamaaraMaarays.arvo}
        </li>
      </ul>
    </div>
  ) : null
}