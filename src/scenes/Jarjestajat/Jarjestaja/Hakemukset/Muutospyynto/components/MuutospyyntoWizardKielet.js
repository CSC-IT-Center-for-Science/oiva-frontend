import React, { useMemo, useRef } from "react";
import Opetuskielet from "./Kielet/Opetuskielet";
import PropTypes from "prop-types";
import Tutkintokielet from "./Kielet/Tutkintokielet";
import * as R from "ramda";
import _ from "lodash";

const MuutospyyntoWizardKielet = props => {
  const prevTutkinnotItemsRef = useRef();

  const { lupa } = props;

  /**
   * Array of anhors of checkboxes which have been checked. The idea behind
   * this is to remove corresponding change objects of Tutkintokielet section.
   *
   * E.g."321204 Musiikkialan perustutkinto" has been checked and user
   * disables it. We need to remove all changes on Tutkintokielet section
   * related to the disabed degree.
   */
  const unselectedAnchors = useMemo(() => {
    const clonedPrevChanges = _.cloneDeep(prevTutkinnotItemsRef.current) || {};

    /**
     * There are two use cases:
     *
     * 1) Degree is unchecked. User activates it and deactivates it later.
     * 2) Degree is checked by default and user deactivates.
     */

    // Use case 1 (Array 1)
    const wereSelected = R.map(
      R.prop("anchor"),
      R.flatten(
        R.values(
          R.mapObjIndexed((value, key) => {
            return R.filter(changeObj => {
              const isInCurrentChanges = !!R.find(
                R.propEq("anchor", changeObj.anchor),
                props.changeObjects.tutkinnot[key] || []
              );
              return changeObj.properties.isChecked && !isInCurrentChanges;
            }, value);
          }, clonedPrevChanges)
        )
      )
    );

    // Use case 2 (Array 2)
    const wereSelectedByDefault = R.map(
      R.prop("anchor"),
      R.filter(
        R.compose(R.equals(false), R.path(["properties", "isChecked"])),
        R.flatten(R.values(props.changeObjects.tutkinnot))
      )
    );

    prevTutkinnotItemsRef.current = props.changeObjects.tutkinnot;

    // Here we combine the arrays 1 and 2
    return R.concat(wereSelected, wereSelectedByDefault);
  }, [props.changeObjects.tutkinnot]);

  return (
    <React.Fragment>
      <Opetuskielet
        changeObjects={props.changeObjects}
        opetuskielet={props.opetuskielet}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
      />

      <Tutkintokielet
        changeObjects={props.changeObjects}
        kielet={props.kielet}
        koulutusalat={props.koulutusalat}
        koulutustyypit={props.koulutustyypit}
        lupa={lupa}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
        tutkinnot={props.tutkinnot}
        unselectedAnchors={unselectedAnchors}
      />
    </React.Fragment>
  );
};

MuutospyyntoWizardKielet.propTypes = {
  kielet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  opetuskielet: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default MuutospyyntoWizardKielet;
