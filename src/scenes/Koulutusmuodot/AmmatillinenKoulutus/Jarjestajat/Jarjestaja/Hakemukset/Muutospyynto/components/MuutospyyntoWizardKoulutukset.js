import React from "react";
import PropTypes from "prop-types";
import ValmentavatKoulutukset from "./Koulutukset/ValmentavatKoulutukset";
import ATVKoulutukset from "./Koulutukset/ATVKoulutukset";
import Tyovoimakoulutukset from "./Koulutukset/Tyovoimakoulutukset";
import Kuljettajakoulutukset from "./Koulutukset/Kuljettajakoulutukset";

const MuutospyyntoWizardKoulutukset = props => {
  return (
    <div>
      <ValmentavatKoulutukset
        changeObjects={props.changeObjects}
        koulutukset={props.koulutukset}
        maaraykset={props.maaraykset}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
      />

      <ATVKoulutukset
        changeObjects={props.changeObjects}
        koulutukset={props.koulutukset}
        maaraykset={props.maaraykset}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
      />

      <Tyovoimakoulutukset
        changeObjects={props.changeObjects}
        koulutukset={props.koulutukset}
        maaraykset={props.maaraykset}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
      />

      <Kuljettajakoulutukset
        changeObjects={props.changeObjects}
        koulutukset={props.koulutukset}
        maaraykset={props.maaraykset}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
      />
    </div>
  );
};

MuutospyyntoWizardKoulutukset.propTypes = {
  changeObjects: PropTypes.object,
  koulutukset: PropTypes.object,
  maaraykset: PropTypes.array
};

export default MuutospyyntoWizardKoulutukset;
