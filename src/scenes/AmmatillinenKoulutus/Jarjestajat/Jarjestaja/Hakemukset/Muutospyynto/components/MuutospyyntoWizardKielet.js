import React from "react";
import PropTypes from "prop-types";
import Tutkintokielet from "./Kielet/Tutkintokielet";
import Lomake from "components/02-organisms/Lomake";
import { useIntl } from "react-intl";
import wizardMessages from "../../../../../../../i18n/definitions/wizard";

const constants = {
  formLocation: {
    opetuskielet: ["kielet", "opetuskielet"]
  }
};

const MuutospyyntoWizardKielet = props => {
  const intl = useIntl();
  return (
    <React.Fragment>
      <Lomake
        action="modification"
        anchor={"kielet_opetuskielet"}
        isRowExpanded={true}
        path={constants.formLocation.opetuskielet}
        rowTitle={intl.formatMessage(wizardMessages.teachingLanguages)}
        showCategoryTitles={true}
      />

      <Tutkintokielet
        koulutusalat={props.koulutusalat}
        tutkinnot={props.tutkinnot}
      />
    </React.Fragment>
  );
};

MuutospyyntoWizardKielet.propTypes = {
  kielet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  lupaKohteet: PropTypes.object,
  opetuskielet: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default MuutospyyntoWizardKielet;
