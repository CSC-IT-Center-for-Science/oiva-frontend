import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";
import Koulutusala from "./Koulutusala";
import { useLatestChangesByAnchor } from "scenes/AmmatillinenKoulutus/store";
import { find, forEach, map, path, propEq, toUpper } from "ramda";
import wizard from "i18n/definitions/wizard";

const Tutkintokielet = ({ koulutusalat, tutkinnot }) => {
  const sectionId = "kielet_tutkintokielet";
  const intl = useIntl();

  const [tutkintodata] = useLomakedata({
    anchor: "tutkinnot"
  });

  const [, { removeChangeObjectByAnchor }] = useLatestChangesByAnchor({
    anchor: "tutkinnot"
  });

  /**
   * Tarkkaillaan tutkinto-osion deaktiivisia tutkintoja ja poistetaan
   * tarvittaessa niitä vastaavat muutosobjektit tutkintokieliosiosta. Eli
   * kyseessä on käyttötapaus, jossa käyttäjä poistaa ruksin jonkin
   * tutkinnon kohdalta. Jos kyseiselle tutkinnolle on asetettu
   * tutkintokieli(ä), on tutkintokielet lisäävät muutosobjektit
   * poistettava. Tässä tehdään se.
   */
  useEffect(() => {
    forEach(tutkinto => {
      const {
        koulutusalakoodiarvo,
        koulutustyyppikoodiarvo,
        koodiarvo
      } = tutkinto;
      const aktiivisetTutkinnot = path(
        [koulutusalakoodiarvo, "aktiiviset"],
        tutkintodata
      );
      const isTutkintoEnabled = !!find(
        propEq("koodiarvo", koodiarvo),
        aktiivisetTutkinnot || []
      );
      if (!isTutkintoEnabled) {
        /**
         * Muodostetaan tutkinnon pohjalta ankkuri, jolla saaadaan kiinni
         * tutkintoa vastaava tutkintokielimuutos.
         **/
        const anchor = `kielet_tutkintokielet_${koulutusalakoodiarvo}.${koulutustyyppikoodiarvo}.${koodiarvo}.kielet`;
        removeChangeObjectByAnchor(anchor);
      }
    }, tutkinnot);
  }, [tutkintodata, tutkinnot, tutkintodata]);

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
  koulutusalat: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default Tutkintokielet;
