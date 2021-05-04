import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import lukiokoulutus from "i18n/definitions/lukiokoulutus";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import OpetustaAntavatKunnatHtml from "./opetustaAntavatKunnat";
import OpetuskieletHtml from "./opetuskielet";
import OpiskelijamaaratHtml from "./opiskelijamaarat";
import ErityisetKoulutustehtavatHtml from "./erityisetKoulutustehtavat";
import OpetuksenMuutEhdotHtml from "./muutEhdot";
import OikeusSisaoppilaitosmuotoiseenKoulutukseenHtml from "./oikeusSisaoppilaitosmuotoiseenKoulutukseen";
import ValtakunnallisetKehittamistehtavatHtml from "./valtakunnallisetKehittamistehtavat";
import { onkoMaaraysVoimassa } from "../../../../helpers/muut";

/**
 * Funktio rakentaa lukiokoulutuksen HTML-lupanäkymän.
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
          koulutusmuodon: formatMessage(lukiokoulutus.genetiivi)
        })}
      </Typography>
      {lupa.loppupvm && (
        <p className="mb-4">
          {formatMessage(common.onVoimassa, {
            loppupvm: moment(lupa.loppupvm).format("D.M.YYYY")
          })}
        </p>
      )}
      <p className="mb-4">{formatMessage(lukiokoulutus.esittelyteksti)}</p>

      <OpetustaAntavatKunnatHtml maaraykset={lupa.maaraykset} />
      <OpetuskieletHtml maaraykset={lupa.maaraykset} />
      <OikeusSisaoppilaitosmuotoiseenKoulutukseenHtml
        maaraykset={lupa.maaraykset}
      />
      <OpiskelijamaaratHtml maaraykset={lupa.maaraykset} />
      <ErityisetKoulutustehtavatHtml maaraykset={lupa.maaraykset} />
      <ValtakunnallisetKehittamistehtavatHtml maaraykset={lupa.maaraykset} />
      <OpetuksenMuutEhdotHtml maaraykset={lupa.maaraykset} />
    </React.Fragment>
  );
};

JarjestamislupaJSX.propTypes = {
  lupa: PropTypes.object.isRequired
};

export default JarjestamislupaJSX;
