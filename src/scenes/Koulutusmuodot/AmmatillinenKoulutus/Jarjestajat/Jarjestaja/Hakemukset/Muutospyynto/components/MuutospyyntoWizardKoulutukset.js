import React from "react";
import PropTypes from "prop-types";
import ValmentavatKoulutukset from "./Koulutukset/ValmentavatKoulutukset";
import ATVKoulutukset from "./Koulutukset/ATVKoulutukset";
import Tyovoimakoulutukset from "./Koulutukset/Tyovoimakoulutukset";
import Kuljettajakoulutukset from "./Koulutukset/Kuljettajakoulutukset";

const MuutospyyntoWizardKoulutukset = ({ koulutukset, maaraykset, mode }) => {
  return (
    <div>
      <ValmentavatKoulutukset
        koulutukset={koulutukset}
        maaraykset={maaraykset}
        mode={mode}
      />

      <ATVKoulutukset
        koulutukset={koulutukset}
        maaraykset={maaraykset}
        mode={mode}
      />

      <Tyovoimakoulutukset
        koulutukset={koulutukset}
        maaraykset={maaraykset}
        mode={mode}
      />

      <Kuljettajakoulutukset
        koulutukset={koulutukset}
        maaraykset={maaraykset}
        mode={mode}
      />
    </div>
  );
};

MuutospyyntoWizardKoulutukset.propTypes = {
  koulutukset: PropTypes.object,
  maaraykset: PropTypes.array,
  mode: PropTypes.string
};

export default MuutospyyntoWizardKoulutukset;
