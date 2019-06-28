import React from "react";
import Tutkinnot from "./Tutkinnot";
import MuutospyyntoWizardKoulutukset from "./MuutospyyntoWizardKoulutukset";
import MuutospyyntoWizardKielet from "./MuutospyyntoWizardKielet";
import MuutospyyntoWizardMuut from "./MuutospyyntoWizardMuut";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";

const MuutospyyntoWizardMuutokset = React.memo(props => {
  const {
    intl: { formatMessage }
  } = props;

  return (
    <div>
      <p className="py-10">{formatMessage(wizardMessages.info_01)}</p>

      <form onSubmit={props.handleSubmit}>
        <Tutkinnot
          changes={props.muutoshakemus.tutkinnot.changes || {}}
          koulutukset={props.koulutukset}
          koulutusalat={props.koulutusalat}
          koulutustyypit={props.koulutustyypit.data}
          lupa={props.lupa}
          onUpdate={props.onUpdate}
        />

        <MuutospyyntoWizardKoulutukset
          koulutukset={props.koulutukset}
          onUpdate={props.onUpdate}
        />

        <MuutospyyntoWizardKielet
          lupa={props.lupa}
          kielet={props.kielet}
          koulutukset={props.koulutukset}
          onUpdate={props.onUpdate}
        />

        {/* <Kohde>
          <MuutospyyntoWizardToimialue lupa={lupa} />
        </Kohde>

        <Kohde>
          <MuutospyyntoWizardOpiskelijavuodet lupa={lupa} />
        </Kohde> */}

        <MuutospyyntoWizardMuut lupa={props.lupa} muut={props.muut} />
      </form>
    </div>
  );
});

MuutospyyntoWizardMuutokset.propTypes = {
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.object,
  koulutustyypit: PropTypes.object,
  lupa: PropTypes.object,
  muutoshakemus: PropTypes.object,
  onUpdate: PropTypes.func
};

export default injectIntl(MuutospyyntoWizardMuutokset);
