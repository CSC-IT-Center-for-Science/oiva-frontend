import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import PoOpetuskieletHtml from "./opetuskielet";
import PoOpetuksenJarjestamismuotoHtml from "./opetuksenJarjestamismuoto";
import PoOpetuksenErityisetKoulutustehtavatHtml from "./erityisetKoulutustehtavat";
import PoOpetusJotaLupaKoskeeHtml from "./opetusJotaLupaKoskee";
import moment from "moment";
import PoOpetustaAntavatKunnatHtml from "./opetustaAntavatKunnat";

/**
 * Funktio rakentaa esi- ja perusopetuksen HTML-lupanäkymän.
 * @param {*} lupa - Lupa, jonka tietoja hyödyntäen lupanäkymä muodostetaan.
 */
const JarjestamislupaJSX = ({ lupa, lupakohteet }) => {
  const { formatMessage } = useIntl();

  return (
    <React.Fragment>
      <h2 className="font-medium mb-6">
        {formatMessage(common.htmlLuvanOtsikko, {
          date: moment().format("DD.MM.YYYY"),
          koulutusmuodon: "esi- ja perusopetuksen",
        })}
      </h2>

      <PoOpetusJotaLupaKoskeeHtml maaraykset={lupa.maaraykset} />
      <PoOpetustaAntavatKunnatHtml maaraykset={lupa.maaraykset} />
      <PoOpetuskieletHtml maaraykset={lupa.maaraykset} />
      <PoOpetuksenJarjestamismuotoHtml maaraykset={lupa.maaraykset} />
      <PoOpetuksenErityisetKoulutustehtavatHtml maaraykset={lupa.maaraykset} />
    </React.Fragment>
  );
};

JarjestamislupaJSX.propTypes = {
  lupa: PropTypes.object.isRequired,
  lupakohteet: PropTypes.object
};

export default JarjestamislupaJSX;
