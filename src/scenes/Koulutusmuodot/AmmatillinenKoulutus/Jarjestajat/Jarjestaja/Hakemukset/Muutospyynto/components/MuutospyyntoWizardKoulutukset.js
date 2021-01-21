import React from "react";
import PropTypes from "prop-types";
import ValmentavatKoulutukset from "./Koulutukset/ValmentavatKoulutukset";
import ATVKoulutukset from "./Koulutukset/ATVKoulutukset";
import Tyovoimakoulutukset from "./Koulutukset/Tyovoimakoulutukset";
import Kuljettajakoulutukset from "./Koulutukset/Kuljettajakoulutukset";
import { TutkintomuutoksetContainer } from "stores/tutkintomuutokset";

const MuutospyyntoWizardKoulutukset = ({
  isReadOnly,
  koulutukset,
  maaraykset,
  mode
}) => {
  return (
    <div>
      <TutkintomuutoksetContainer scope="valmentavatKoulutukset">
        <ValmentavatKoulutukset
          isReadOnly={isReadOnly}
          koulutukset={koulutukset}
          maaraykset={maaraykset}
          mode={mode}
        />
      </TutkintomuutoksetContainer>

      <TutkintomuutoksetContainer scope="atvKoulutukset">
        <ATVKoulutukset
          isReadOnly={isReadOnly}
          koulutukset={koulutukset}
          maaraykset={maaraykset}
          mode={mode}
        />
      </TutkintomuutoksetContainer>

      <TutkintomuutoksetContainer scope="tyovoimakoulutukset">
        <Tyovoimakoulutukset
          isReadOnly={isReadOnly}
          koulutukset={koulutukset}
          maaraykset={maaraykset}
          mode={mode}
        />
      </TutkintomuutoksetContainer>

      <TutkintomuutoksetContainer scope="kuljettajakoulutukset">
        <Kuljettajakoulutukset
          isReadOnly={isReadOnly}
          koulutukset={koulutukset}
          maaraykset={maaraykset}
          mode={mode}
        />
      </TutkintomuutoksetContainer>
    </div>
  );
};

MuutospyyntoWizardKoulutukset.propTypes = {
  koulutukset: PropTypes.object,
  maaraykset: PropTypes.array,
  mode: PropTypes.string
};

export default MuutospyyntoWizardKoulutukset;
