import React from "react";
import PropTypes from "prop-types";
import ValmentavatKoulutukset from "./Koulutukset/ValmentavatKoulutukset";
import ATVKoulutukset from "./Koulutukset/ATVKoulutukset";
import Tyovoimakoulutukset from "./Koulutukset/Tyovoimakoulutukset";
import Kuljettajakoulutukset from "./Koulutukset/Kuljettajakoulutukset";

const MuutospyyntoWizardKoulutukset = props => {
  return (
    <div className="md:pl-16 py-10">

      <ValmentavatKoulutukset
        koulutukset={props.koulutukset}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
      />

      <ATVKoulutukset
        koulutukset={props.koulutukset}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
      />

      <Tyovoimakoulutukset
        koulutukset={props.koulutukset}
        maaraykset={props.maaraykset}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
      />

      <Kuljettajakoulutukset
        koulutukset={props.koulutukset}
        lupa={props.maaraykset}
        onChangesRemove={props.onChangesRemove}
        onChangesUpdate={props.onChangesUpdate}
      />
    </div>
  );
};

MuutospyyntoWizardKoulutukset.propTypes = {
  koulutukset: PropTypes.object,
  maaraykset: PropTypes.array
};

export default MuutospyyntoWizardKoulutukset;
