import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import PoOpetuskieletHtml from "./opetuskielet";
import PoOpetuksenJarjestamismuotoHtml from "./opetuksenJarjestamismuoto";
import PoOpetuksenMuutEhdotHtml from "./muutEhdot";
import PoOpetuksenErityisetKoulutustehtavatHtml from "./erityisetKoulutustehtavat";
import PoOpetusJotaLupaKoskeeHtml from "./opetusJotaLupaKoskee";
import moment from "moment";
import PoOpetustaAntavatKunnatHtml from "./opetustaAntavatKunnat";
import PoOpiskelijamaaratHtml from "./opiskelijamaarat";
import Typography from "@material-ui/core/Typography";
import LupanakymaA from "../lupanakymat/LupanakymaA";
import { find, prop, propEq } from "ramda";

/**
 * Funktio rakentaa esi- ja perusopetuksen HTML-lupanäkymän.
 * @param {*} lupa - Lupa, jonka tietoja hyödyntäen lupanäkymä muodostetaan.
 */
const JarjestamislupaJSX = ({ kohteet, lupa, lupakohteet }) => {
  const { formatMessage } = useIntl();

  const valtakunnallinenMaarays = find(
    propEq("koodisto", "nuts1"),
    prop("maaraykset", lupa) || []
  );

  return (
    <React.Fragment>
      <Typography component="h2" variant="h2">
        {formatMessage(common.htmlLuvanOtsikko, {
          date: moment().format("DD.MM.YYYY"),
          koulutusmuodon: "esi- ja perusopetuksen"
        })}
      </Typography>

      <LupanakymaA
        isPreviewModeOn={true}
        kohteet={kohteet}
        lupakohteet={lupakohteet}
        maaraykset={lupa.maaraykset}
        valtakunnallinenMaarays={valtakunnallinenMaarays}
      />

      {/* <PoOpetusJotaLupaKoskeeHtml maaraykset={lupa.maaraykset} />
      <PoOpetustaAntavatKunnatHtml maaraykset={lupa.maaraykset} />
      <PoOpetuskieletHtml maaraykset={lupa.maaraykset} />
      <PoOpetuksenJarjestamismuotoHtml maaraykset={lupa.maaraykset} />
      <PoOpiskelijamaaratHtml maaraykset={lupa.maaraykset} />
      <PoOpetuksenErityisetKoulutustehtavatHtml maaraykset={lupa.maaraykset} />
      <PoOpetuksenMuutEhdotHtml maaraykset={lupa.maaraykset} /> */}
    </React.Fragment>
  );
};

JarjestamislupaJSX.propTypes = {
  lupa: PropTypes.object.isRequired
};

export default JarjestamislupaJSX;
