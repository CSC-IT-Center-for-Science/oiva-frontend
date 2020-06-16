import React, { useMemo, useRef } from "react";
import Opetuskielet from "./Kielet/Opetuskielet";
import PropTypes from "prop-types";
import { KIELET_SECTIONS } from "../../../modules/constants";
import Tutkintokielet from "./Kielet/Tutkintokielet";
import * as R from "ramda";
import _ from "lodash";
import { useChangeObjects } from "../../../../../../stores/changeObjects";

const MuutospyyntoWizardKielet = props => {
  const [changeObjects] = useChangeObjects();
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
                changeObjects.tutkinnot[key] || []
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
        R.flatten(R.values(changeObjects.tutkinnot))
      )
    );

    prevTutkinnotItemsRef.current = changeObjects.tutkinnot;

    // Here we combine the arrays 1 and 2
    return R.concat(wereSelected, wereSelectedByDefault);
  }, [changeObjects.tutkinnot]);

  return (
    <React.Fragment>
      <Opetuskielet
        opetuskielet={props.opetuskielet}
        lupakohde={props.lupaKohteet[2]}
        maaraystyyppi={props.maaraystyyppi}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
      />

      <h4 className="py-4">{KIELET_SECTIONS.TUTKINTOKIELET}</h4>

      <Tutkintokielet
        lupa={lupa}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
        unselectedAnchors={unselectedAnchors}
      />
    </React.Fragment>
  );
};

MuutospyyntoWizardKielet.propTypes = {
  koulutukset: PropTypes.object,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  opetuskielet: PropTypes.array,
  tutkintolomakkeet: PropTypes.object
};

export default MuutospyyntoWizardKielet;
