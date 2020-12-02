import React from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { toUpper, map, groupBy, prop } from "ramda";
import Koulutusala from "./Koulutusala";
import { Typography } from "@material-ui/core";
import common from "i18n/definitions/common";

const Tutkinnot = ({ koulutusalat, koulutustyypit, tutkinnot }) => {
  const intl = useIntl();
  const sectionId = "tutkinnot";
  const localeUpper = toUpper(intl.locale);
  const tutkinnotByKoulutusala = groupBy(
    prop("koulutusalakoodiarvo"),
    tutkinnot
  );

  return (
    <React.Fragment>
      <Typography component="h4" variant="h4">
        {intl.formatMessage(common.tutkinnot)}
      </Typography>
      {map(koulutusala => {
        if (tutkinnotByKoulutusala[koulutusala.koodiarvo]) {
          const title = koulutusala.metadata[localeUpper].nimi;
          const tutkinnotByKoulutustyyppi = groupBy(
            prop("koulutustyyppikoodiarvo"),
            tutkinnotByKoulutusala[koulutusala.koodiarvo]
          );
          const lomakedata = {
            koulutusala,
            koulutustyypit: koulutustyypit,
            title,
            tutkinnotByKoulutustyyppi
          };
          return (
            <Koulutusala
              sectionId={`${sectionId}_${koulutusala.koodiarvo}`}
              data={lomakedata}
              key={koulutusala.koodiarvo}
              title={title}
              tutkinnot={
                tutkinnotByKoulutusala[koulutusala.koodiarvo]
              }></Koulutusala>
          );
        }
        return null;
      }, koulutusalat)}
    </React.Fragment>
  );
};

Tutkinnot.propTypes = {
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default Tutkinnot;
