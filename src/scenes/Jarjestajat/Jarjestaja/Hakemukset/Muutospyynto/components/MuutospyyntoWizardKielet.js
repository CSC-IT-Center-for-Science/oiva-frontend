import React, { useEffect, useRef, useState } from "react";
import Opetuskielet from "./Kielet/Opetuskielet";
import PropTypes from "prop-types";
import { KIELET_SECTIONS } from "../../../modules/constants";
import Tutkintokielet from "./Kielet/Tutkintokielet";
import { injectIntl } from "react-intl";
import * as R from "ramda";
import _ from "lodash";

const MuutospyyntoWizardKielet = React.memo(props => {
  const prevTutkinnotItemsRef = useRef();

  const [unselectedAnchors, setUnselectedAnchors] = useState([]);
  const { lupa } = props;

  useEffect(() => {
    let anchors = {};
    const clonedPrevChanges = _.cloneDeep(prevTutkinnotItemsRef.current) || [];
    if (props.changeObjects.tutkinnot) {
      // Changes that are not checked anymore
      const a = R.map(
        R.prop("anchor"),
        R.difference(
          R.flatten(R.values(clonedPrevChanges)),
          R.flatten(R.values(props.changeObjects.tutkinnot))
        )
      );
      // Changes with isChecked = false
      const b = R.map(
        R.prop("anchor"),
        R.filter(
          R.compose(
            R.equals(false),
            R.path(["properties", "isChecked"])
          ),
          R.flatten(R.values(props.changeObjects.tutkinnot))
        )
      );

      anchors = R.concat(a, b);
      prevTutkinnotItemsRef.current = props.changeObjects.tutkinnot;
      setUnselectedAnchors(anchors);
    }
  }, [props.changeObjects.tutkinnot, props.stateObjects.tutkinnot.items]);

  return (
    <React.Fragment>
      <Opetuskielet
        changeObjects={R.path(["kielet", "opetuskielet"], props.changeObjects)}
        opetuskielet={props.kielet.opetuskielet}
        kohde={props.lupaKohteet[2]}
        lupa={lupa}
        maaraystyyppi={props.maaraystyyppi}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
        onStateUpdate={props.onStateUpdate}
        stateObject={props.stateObjects.kielet.opetuskielet}
      />

      <h4 className="py-4">{KIELET_SECTIONS.TUTKINTOKIELET}</h4>

      {R.path(["tutkinnot", "items"], props.stateObjects) ? (
        <Tutkintokielet
          changeObjects={{
            tutkintokielet: R.path(
              ["kielet", "tutkintokielet"],
              props.changeObjects
            ),
            tutkinnot: R.path(["tutkinnot"], props.changeObjects)
          }}
          kielet={props.kielet.kielet}
          kohde={props.lupaKohteet[1]}
          locale={R.toUpper(props.intl.locale)}
          lupa={lupa}
          onChangesRemove={props.onChangesRemove}
          onChangesUpdate={props.onChangesUpdate}
          onStateUpdate={props.onStateUpdate}
          stateObjects={{
            tutkintokielet:
              R.path(["kielet", "tutkintokielet"], props.stateObjects) || {},
            tutkinnot: R.path(["tutkinnot"], props.stateObjects)
          }}
          unselectedAnchors={unselectedAnchors}
        />
      ) : null}
    </React.Fragment>
  );
});

MuutospyyntoWizardKielet.defaultProps = {
  changeObjects: { tutkinnot: [] },
  stateObjects: {}
};

MuutospyyntoWizardKielet.propTypes = {
  changeObjects: PropTypes.object,
  kielet: PropTypes.object,
  koulutukset: PropTypes.object,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  stateObjects: PropTypes.object
};

export default injectIntl(MuutospyyntoWizardKielet);
