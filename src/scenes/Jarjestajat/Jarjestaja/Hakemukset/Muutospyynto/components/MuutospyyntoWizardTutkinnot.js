import _ from "lodash";
import React, { useContext } from "react";
import Section from "components/03-templates/Section";
import { MuutoshakemusContext } from "context/muutoshakemusContext";
import PropTypes from "prop-types";
import Tutkinnot from "./Tutkinnot";
import wizardMessages from "../../../../../../i18n/definitions/wizard";

const MuutospyyntoWizardTutkinnot = props => {
  const sectionId = "tutkinnot";
  const { state } = useContext(MuutoshakemusContext);
  const { lupa } = props;
  const { kohteet } = lupa;
  const { headingNumber } = kohteet[1];
  const heading = props.intl.formatMessage(wizardMessages.header_section1)

  return (
    <Section code={headingNumber} title={heading}>
      <Tutkinnot
        koulutukset={props.koulutukset}
        lupa={lupa}
        changes={state[sectionId].changes || []}
        kohde={props.lupa.kohteet[2]} 
      />
    </Section>
  );
};

MuutospyyntoWizardTutkinnot.propTypes = {
  lupa: PropTypes.object
};

export default MuutospyyntoWizardTutkinnot;
