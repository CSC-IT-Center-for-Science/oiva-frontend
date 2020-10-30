import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import { useLomakedata } from "scenes/AmmatillinenKoulutus/lomakedata";
import Koulutusala from "./Koulutusala";
import { useLatestChangesByAnchor } from "scenes/AmmatillinenKoulutus/store";
import { forEach, isEmpty, map, replace, toUpper } from "ramda";
import { replaceAnchorPartWith } from "utils/common";
import wizard from "i18n/definitions/wizard";

const Tutkintokielet = ({ koulutusalat }) => {
  const sectionId = "kielet_tutkintokielet";
  const intl = useIntl();

  const [tutkintodata] = useLomakedata({
    anchor: "tutkinnot"
  });

  const [
    latestChanges,
    { removeChangeObjectByAnchor }
  ] = useLatestChangesByAnchor({ anchor: "tutkinnot" });

  /**
   * Tarkkaillaan tutkintoja koskevia muutoksia ja poistetaan tarvittaessa
   * niitä vastaavat muutosobjektit tutkintokieliosiosta. Eli kyseessä on
   * käyttötapaus, jossa käyttäjä poistaa ruksin jonkin tutkinnon kohdalta.
   * Jos kyseiselle tutkinnolle on asetettu tutkintokieli(ä), on tutkinto-
   * kielet lisäävät muutosobjektit poistettava. Tässä tehdään se.
   */
  useEffect(() => {
    if (!isEmpty(latestChanges.underRemoval)) {
      forEach(changeObj => {
        if (changeObj.properties.isChecked) {
          removeChangeObjectByAnchor(
            /**
             * Tutkintoankkuria muutetaan siten, että saadaan aikaan vastaava
             * tutkintokieliankkuri. Esim. tutkintoankkuria
             * tutkinnot_01.12.417101.tutkinto vastaava tutkintokieliankkuri on
             * kielet_tutkintokielet_01.12.417101.kielet
             **/
            replaceAnchorPartWith(
              replace("tutkinnot", sectionId, changeObj.anchor),
              3,
              "kielet"
            )
          );
        }
      }, latestChanges.underRemoval);
    }
  }, [latestChanges]);

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
