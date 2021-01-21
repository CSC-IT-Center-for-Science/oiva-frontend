import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import PropTypes from "prop-types";
import { toUpper, map, groupBy, prop } from "ramda";
import Koulutusala from "./Koulutusala";
import { Typography } from "@material-ui/core";
import { getTutkinnotFromStorage } from "helpers/tutkinnot";
import common from "i18n/definitions/common";
import { TutkintomuutoksetContainer } from "stores/tutkintomuutokset";

const Tutkinnot = ({
  isReadOnly = false,
  koulutusalat,
  koulutustyypit,
  mode
}) => {
  const intl = useIntl();
  const sectionId = "tutkinnot";
  const localeUpper = toUpper(intl.locale);
  const [tutkinnot, setTutkinnot] = useState([]);

  useEffect(() => {
    getTutkinnotFromStorage().then(tutkinnot => {
      setTutkinnot(tutkinnot);
    });
  }, []);

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
            <TutkintomuutoksetContainer
              key={koulutusala.koodiarvo}
              scope={`tutkinnot_${koulutusala.koodiarvo}`}
            >
              <Koulutusala
                data={lomakedata}
                isReadOnly={isReadOnly}
                mode={mode}
                sectionId={`${sectionId}_${koulutusala.koodiarvo}`}
                title={title}
                tutkinnot={tutkinnotByKoulutusala[koulutusala.koodiarvo]}
              ></Koulutusala>
            </TutkintomuutoksetContainer>
          );
        }
        return null;
      }, koulutusalat)}
    </React.Fragment>
  );
};

Tutkinnot.propTypes = {
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array
};

export default Tutkinnot;
