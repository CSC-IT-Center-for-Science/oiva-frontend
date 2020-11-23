import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import { Typography } from "@material-ui/core";
import PoOpetuskieletHtml from "./opetuskielet";
import PoOpetuksenJarjestamismuotoHtml from "./opetuksenJarjestamismuoto";

/**
 * Funktio rakentaa esi- ja perusopetuksen HTML-lupanäkymän.
 * @param {*} lupa - Lupa, jonka tietoja hyödyntäen lupanäkymä muodostetaan.
 */
const JarjestamislupaJSX = ({ lupa, lupakohteet }) => {
  const { formatMessage } = useIntl();

  return (
    <React.Fragment>
      <div className="border-b border-solid border-gray-400 py-16">
          <Typography variant="h2">
            {formatMessage(common.htmlLuvanOtsikko, {
              date: new Date().toLocaleDateString(),
              koulutusmuodon: "esi- ja perusopetuksen",
            })}
          </Typography>
      </div>
      <PoOpetuskieletHtml maaraykset={lupa.maaraykset} />
      <PoOpetuksenJarjestamismuotoHtml maaraykset={lupa.maaraykset }/>
  </React.Fragment>
  );
};

JarjestamislupaJSX.propTypes = {
  lupa: PropTypes.object.isRequired,
  lupakohteet: PropTypes.object
};

export default JarjestamislupaJSX;
