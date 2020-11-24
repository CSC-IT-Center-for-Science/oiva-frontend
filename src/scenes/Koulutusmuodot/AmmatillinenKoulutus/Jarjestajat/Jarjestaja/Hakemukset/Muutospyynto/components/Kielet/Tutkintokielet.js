import React from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { useLomakedata } from "stores/lomakedata";
import Koulutusala from "./Koulutusala";
import { map, toUpper } from "ramda";
import wizard from "i18n/definitions/wizard";

const Tutkintokielet = ({ koulutusalat }) => {
  const sectionId = "kielet_tutkintokielet";
  const intl = useIntl();

  const [tutkintodata] = useLomakedata({
    anchor: "tutkinnot"
  });

  return (
    <React.Fragment>
      <h4 className="py-4">{intl.formatMessage(wizard.tutkintokielet)}</h4>
      {map(koulutusala => {
        if (tutkintodata[koulutusala.koodiarvo]) {
          return (
            <Koulutusala
              key={koulutusala.koodiarvo}
              koodiarvo={koulutusala.koodiarvo}
              sectionId={`${sectionId}_${koulutusala.koodiarvo}`}
              title={`${koulutusala.metadata[toUpper(intl.locale)].nimi}`}
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
  koulutusalat: PropTypes.array
};

export default Tutkintokielet;
