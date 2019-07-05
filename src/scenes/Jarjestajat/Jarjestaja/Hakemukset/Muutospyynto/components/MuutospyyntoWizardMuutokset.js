import React, { useEffect, useState } from "react";
import Tutkinnot from "./Tutkinnot";
import MuutospyyntoWizardKoulutukset from "./MuutospyyntoWizardKoulutukset";
import MuutospyyntoWizardKielet from "./MuutospyyntoWizardKielet";
import MuutospyyntoWizardOpiskelijavuodet from "./MuutospyyntoWizardOpiskelijavuodet";
import MuutospyyntoWizardMuut from "./MuutospyyntoWizardMuut";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import * as R from "ramda";

const MuutospyyntoWizardMuutokset = React.memo(props => {
  const [kohteet, setKohteet] = useState({});
  useEffect(() => {
    setKohteet(
      R.mergeAll(
        R.flatten(
          R.map(item => {
            return {
              [R.props(["tunniste"], item)]: item
            };
          }, props.kohteet)
        )
      )
    );
  }, [props.kohteet]);

  return (
    <div>
      <p className="py-10">
        {props.intl.formatMessage(wizardMessages.info_01)}
      </p>

      <form onSubmit={props.handleSubmit}>
        <Tutkinnot
          kohde={kohteet.tutkinnotjakoulutukset}
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
          tutkinnotState={props.tutkinnotState}
        />

        {/* <Kohde>
          <MuutospyyntoWizardToimialue lupa={lupa} />
        </Kohde> */}

        <MuutospyyntoWizardOpiskelijavuodet
          lupa={props.lupa}
          opiskelijavuodet={props.opiskelijavuodet}
          changesOfSection5={(props.muutoshakemus["muut"] || {}).changes}
        />

        <MuutospyyntoWizardMuut
          lupa={props.lupa}
          muut={props.muut}
          onUpdate={props.onUpdate}
        />
      </form>
    </div>
  );
});

MuutospyyntoWizardMuutokset.propTypes = {
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.object,
  koulutustyypit: PropTypes.object,
  lupa: PropTypes.object,
  muutoshakemus: PropTypes.object,
  onUpdate: PropTypes.func,
  tutkinnotState: PropTypes.array
};

export default injectIntl(MuutospyyntoWizardMuutokset);
