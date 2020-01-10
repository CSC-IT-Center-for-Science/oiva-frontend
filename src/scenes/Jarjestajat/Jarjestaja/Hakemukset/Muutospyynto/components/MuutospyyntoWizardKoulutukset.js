import React from "react";
import { injectIntl } from "react-intl";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import ValmentavatKoulutukset from "./Koulutukset/ValmentavatKoulutukset";
import AmmatilliseenTehtavaanValmistavatKoulutukset from "./Koulutukset/AmmatilliseenTehtavaanValmistavatKoulutukset";
import Tyovoimakoulutukset from "./Koulutukset/Tyovoimakoulutukset";
import Kuljettajakoulutukset from "./Koulutukset/Kuljettajakoulutukset";
import PropTypes from "prop-types";
import * as R from "ramda";

const MuutospyyntoWizardKoulutukset = React.memo(props => {
  return (
    <div className="md:pl-16 pb-10">
      <p className="pt-4 pb-10">
        {props.intl.formatMessage(wizardMessages.info_02)}
      </p>

      <ValmentavatKoulutukset
        changeObjects={R.prop("valmentavatKoulutukset", props.changeObjects)}
        kohde={props.kohde}
        koulutukset={props.koulutukset}
        maaraystyyppi={props.maaraystyyppi}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
        onStateUpdate={props.onStateUpdate}
        stateObject={props.stateObjects.valmentavatKoulutukset}
      />

      <AmmatilliseenTehtavaanValmistavatKoulutukset
        changeObjects={R.prop(
          "ammatilliseenTehtavaanValmistavatKoulutukset",
          props.changeObjects
        )}
        kohde={props.kohde}
        koulutukset={props.koulutukset}
        maaraystyyppi={props.maaraystyyppi}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
        onStateUpdate={props.onStateUpdate}
        stateObject={
          props.stateObjects.ammatilliseenTehtavaanValmistavatKoulutukset
        }
      />

      <Tyovoimakoulutukset
        changeObjects={R.prop("tyovoimakoulutukset", props.changeObjects)}
        kohde={props.kohde}
        koulutukset={props.koulutukset}
        lupa={props.lupa}
        maaraystyyppi={props.maaraystyyppi}
        onUpdate={props.onUpdate}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
        onStateUpdate={props.onStateUpdate}
        stateObject={props.stateObjects.tyovoimakoulutukset}
      />

      <Kuljettajakoulutukset
        changeObjects={R.prop("kuljettajakoulutukset", props.changeObjects)}
        kohde={props.kohde}
        koulutukset={props.koulutukset}
        lupa={props.lupa}
        maaraystyyppi={props.maaraystyyppi}
        onUpdate={props.onUpdate}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
        onStateUpdate={props.onStateUpdate}
        stateObject={props.stateObjects.kuljettajakoulutukset}
      />
    </div>
  );
});

MuutospyyntoWizardKoulutukset.defaultProps = {
  changeObjects: {},
  stateObjects: {}
};

MuutospyyntoWizardKoulutukset.propTypes = {
  changeObjects: PropTypes.object,
  kohde: PropTypes.object,
  koulutukset: PropTypes.object,
  lupa: PropTypes.object,
  maaraystyyppi: PropTypes.object,
  onUpdate: PropTypes.func,
  stateObjects: PropTypes.object
};

export default injectIntl(MuutospyyntoWizardKoulutukset);
