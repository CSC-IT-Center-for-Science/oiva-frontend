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

/**
 * Funktio rakentaa esi- ja perusopetuksen HTML-lupanäkymän.
 * @param {*} lupa - Lupa, jonka tietoja hyödyntäen lupanäkymä muodostetaan.
 */
const JarjestamislupaJSX = ({ lupa }) => {
  const { formatMessage } = useIntl();

  return (
    <React.Fragment>
      <Typography component="h2" variant="h2">
        {formatMessage(common.htmlLuvanOtsikko, {
          date: moment().format("DD.MM.YYYY"),
          koulutusmuodon: "esi- ja perusopetuksen",
        })}
      </Typography>

      <PoOpetusJotaLupaKoskeeHtml maaraykset={lupa.maaraykset} />
      <PoOpetustaAntavatKunnatHtml maaraykset={lupa.maaraykset} />
      <PoOpetuskieletHtml maaraykset={lupa.maaraykset} />
      <PoOpetuksenJarjestamismuotoHtml maaraykset={lupa.maaraykset} />
      <PoOpiskelijamaaratHtml maaraykset={lupa.maaraykset} />
      <PoOpetuksenErityisetKoulutustehtavatHtml maaraykset={lupa.maaraykset} />
      <PoOpetuksenMuutEhdotHtml maaraykset={lupa.maaraykset} />
    </React.Fragment>
  );
};

JarjestamislupaJSX.propTypes = {
  lupa: PropTypes.object.isRequired
};

export default JarjestamislupaJSX;
