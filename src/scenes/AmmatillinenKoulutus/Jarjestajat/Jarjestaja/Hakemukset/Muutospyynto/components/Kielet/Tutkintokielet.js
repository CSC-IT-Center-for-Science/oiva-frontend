import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import * as R from "ramda";

import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";
import Koulutusala from "./Koulutusala";

const Tutkintokielet = ({ koulutusalat }) => {
  const sectionId = "kielet_tutkintokielet";
  const intl = useIntl();

  const [tutkintodata] = useLomakedata({
    anchor: "tutkinnot"
  });

  return (
    <React.Fragment>
      {R.map(koulutusala => {
        if (tutkintodata[koulutusala.koodiarvo]) {
          return (
            <Koulutusala
              key={koulutusala.koodiarvo}
              koodiarvo={koulutusala.koodiarvo}
              sectionId={`${sectionId}_${koulutusala.koodiarvo}`}
              title={`${koulutusala.metadata[R.toUpper(intl.locale)].nimi}`}
            />
          );
        } else {
          return null;
        }
      }, koulutusalat).filter(Boolean)}
    </React.Fragment>
  );
};

Tutkintokielet.propTypes = {
  koulutusalat: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default Tutkintokielet;
