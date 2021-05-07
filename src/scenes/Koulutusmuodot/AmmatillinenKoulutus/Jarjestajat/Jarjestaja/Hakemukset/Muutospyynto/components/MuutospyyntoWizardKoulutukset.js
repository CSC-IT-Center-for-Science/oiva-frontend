import React from "react";
import PropTypes from "prop-types";
import ValmentavatKoulutukset from "./Koulutukset/ValmentavatKoulutukset";
import ATVKoulutukset from "./Koulutukset/ATVKoulutukset";
import Tyovoimakoulutukset from "./Koulutukset/Tyovoimakoulutukset";
import Kuljettajakoulutukset from "./Koulutukset/Kuljettajakoulutukset";

const MuutospyyntoWizardKoulutukset = ({
  isReadOnly,
  koulutukset,
  maaraykset,
  mode
}) => {
  return (
    <div>
      <ValmentavatKoulutukset
        isReadOnly={isReadOnly}
        koulutukset={koulutukset}
        maaraykset={maaraykset}
        mode={mode}
      />

      <ATVKoulutukset
        isReadOnly={isReadOnly}
        koulutukset={koulutukset}
        maaraykset={maaraykset}
        mode={mode}
      />

      <Tyovoimakoulutukset
        isReadOnly={isReadOnly}
        koulutukset={koulutukset}
        maaraykset={maaraykset}
        mode={mode}
      />

      <Kuljettajakoulutukset
        isReadOnly={isReadOnly}
        koulutukset={koulutukset}
        maaraykset={maaraykset}
        mode={mode}
      />
    </div>
  );
};

MuutospyyntoWizardKoulutukset.propTypes = {
  isReadOnly: PropTypes.bool,
  koulutukset: PropTypes.object,
  maaraykset: PropTypes.array,
  mode: PropTypes.string
};

export default MuutospyyntoWizardKoulutukset;
