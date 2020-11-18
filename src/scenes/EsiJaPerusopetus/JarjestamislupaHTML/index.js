import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import esiJaPerusopetus from "i18n/definitions/esiJaPerusopetus";
import { Typography } from "@material-ui/core";

/**
 * Funktio rakentaa esi- ja perusopetuksen HTML-lupanäkymän.
 * @param {*} lupa - Lupa, jonka tietoja hyödyntäen lupanäkymä muodostetaan.
 */
const JarjestamislupaJSX = ({ lupa }) => {
  const { formatMessage } = useIntl();
  return (
    <div>
      <Typography variant="h2">
        {formatMessage(esiJaPerusopetus.htmlLuvanOtsikko, {
          date: new Date().toLocaleDateString()
        })}
      </Typography>
    </div>
  );
};

JarjestamislupaJSX.propTypes = {
  lupa: PropTypes.object.isRequired
};

export default JarjestamislupaJSX;
