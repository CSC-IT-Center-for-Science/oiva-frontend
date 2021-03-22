import React, { useEffect, useState } from "react";
import {
  filter,
  find,
  includes,
  map,
  toUpper,
  isEmpty,
  propEq,
  path,
  length,
  addIndex,
  pathEq
} from "ramda";
import { useIntl } from "react-intl";
import common from "../../../../i18n/definitions/common";
import education from "../../../../i18n/definitions/education";
import { getKieletOPHFromStorage } from "../../../../helpers/opetuskielet";
import Typography from "@material-ui/core/Typography";
import { getRajoitteetFromMaarays } from "../../../../utils/rajoitteetUtils";
import LisatiedotHtmlLupa from "../../../LisatiedotHtmlLupa";

export default function PoOpetuskieletHtml({ maaraykset }) {
  const intl = useIntl();
  const locale = toUpper(intl.locale);
  const [kieletOPH, setKieletOPH] = useState([]);

  /** Fetch kieletOPH from storage */
  useEffect(() => {
    getKieletOPHFromStorage()
      .then(kielet => setKieletOPH(kielet))
      .catch(err => {
        console.error(err);
      });
  }, []);

  const ensisijaisetOpetuskielet = filter(
    maarays =>
      pathEq(["kohde", "tunniste"], "opetuskieli", maarays) &&
      maarays.koodisto === "kielikoodistoopetushallinto" &&
      includes("ensisijaiset", maarays.meta.changeObjects[0].anchor),
    maaraykset
  );

  const toissijaisetOpetuskielet = filter(
    maarays =>
      pathEq(["kohde", "tunniste"], "opetuskieli", maarays) &&
      maarays.koodisto === "kielikoodistoopetushallinto" &&
      includes("toissijaiset", maarays.meta.changeObjects[0].anchor),
    maaraykset
  );

  const lisatietomaarays = find(
    maarays =>
      pathEq(["kohde", "tunniste"], "opetuskieli", maarays) &&
      maarays.koodisto === "lisatietoja",
    maaraykset
  );

  return (
    (!isEmpty(ensisijaisetOpetuskielet) ||
      !isEmpty(toissijaisetOpetuskielet)) &&
    !isEmpty(kieletOPH) && (
      <div className="mt-4">
        <Typography component="h3" variant="h3">
          {intl.formatMessage(common.opetuskieli)}
        </Typography>
        {getOpetuskieletHtml(ensisijaisetOpetuskielet, kieletOPH, locale)}
        {!isEmpty(toissijaisetOpetuskielet) && (
          <Typography component="h4" variant="h4">
            {intl.formatMessage(education.voidaanAntaaMyosSeuraavillaKielilla)}
          </Typography>
        )}
        {getOpetuskieletHtml(toissijaisetOpetuskielet, kieletOPH, locale)}
        <LisatiedotHtmlLupa lisatietomaarays={lisatietomaarays} />
      </div>
    )
  );
}

const getOpetuskieletHtml = (opetuskielet, kieletOPH, locale) => {
  return (
    <ul className="ml-8 list-disc mb-4">
      {addIndex(map)(
        (opetuskieli, index) => [
          <li key={opetuskieli.koodiarvo} className="leading-bulletList">
            {path(
              ["metadata", locale, "nimi"],
              find(
                propEq("koodiarvo", toUpper(opetuskieli.koodiarvo)),
                kieletOPH
              )
            )}
          </li>,
          <div key={"div-" + index}>
            {length(opetuskieli.aliMaaraykset)
              ? getRajoitteetFromMaarays(opetuskieli.aliMaaraykset, locale)
              : ""}
          </div>
        ],
        opetuskielet || []
      )}
    </ul>
  );
};
