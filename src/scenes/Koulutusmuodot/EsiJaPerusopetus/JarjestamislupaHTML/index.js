import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import esiJaPerusopetus from "i18n/definitions/esiJaPerusopetus";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import PoOpetusJotaLupaKoskeeHtml from "./opetusJotaLupaKoskee";
import PoOpetustaAntavatKunnatHtml from "./opetustaAntavatKunnat";
import PoOpetuskieletHtml from "./opetuskielet";
import PoOpetuksenJarjestamismuotoHtml from "./opetuksenJarjestamismuoto";
import PoOpiskelijamaaratHtml from "./opiskelijamaarat";
import PoOpetuksenErityisetKoulutustehtavatHtml from "./erityisetKoulutustehtavat";
import PoOpetuksenMuutEhdotHtml from "./muutEhdot";
import { onkoMaaraysVoimassa } from "../../../../helpers/muut";


/**
 * Funktio rakentaa esi- ja perusopetuksen HTML-lupanäkymän.
 * @param {*} lupa - Lupa, jonka tietoja hyödyntäen lupanäkymä muodostetaan.
 */
const JarjestamislupaJSX = ({ lupa }) => {
  const { formatMessage } = useIntl();

  lupa.maaraykset = lupa.maaraykset.map(maarays => {
    return onkoMaaraysVoimassa(maarays);
  }).filter(Boolean);

  return (
    <React.Fragment>
      <Typography component="h2" variant="h2">
        {formatMessage(common.htmlLuvanOtsikko, {
          date: moment().format("DD.MM.YYYY"),
          koulutusmuodon: formatMessage(esiJaPerusopetus.genetiivi).toLowerCase()
        })}
      </Typography>
      {lupa.loppupvm && (
        <p className="mb-4">
          {formatMessage(common.onVoimassa, {
            loppupvm: moment(lupa.loppupvm).format("D.M.YYYY")
          })}
        </p>
      )}
      <p className="mb-4">{formatMessage(esiJaPerusopetus.esittelyteksti)}</p>

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
