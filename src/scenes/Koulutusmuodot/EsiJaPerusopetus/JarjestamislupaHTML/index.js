import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import common from "i18n/definitions/common";
import { Typography } from "@material-ui/core";

/**
 * Funktio rakentaa esi- ja perusopetuksen HTML-lupanäkymän.
 * @param {*} lupa - Lupa, jonka tietoja hyödyntäen lupanäkymä muodostetaan.
 */
const JarjestamislupaJSX = ({ lupa, lupakohteet }) => {
  const { formatMessage } = useIntl();
  return (
    <div>
      <Typography variant="h2">
        {formatMessage(common.htmlLuvanOtsikko, {
          date: new Date().toLocaleDateString(),
          koulutusmuodon: "esi- ja perusopetuksen",
        })}
      </Typography>
    </div>
  );
};

JarjestamislupaJSX.propTypes = {
  lupa: PropTypes.object.isRequired,
  lupakohteet: PropTypes.object
};

export default JarjestamislupaJSX;
