import React from "react";
import FormSection from "../../../../../../components/03-templates/FormSection";
import { injectIntl } from "react-intl";
import TaloudellisetYleisettiedot from "./Taloudelliset/TaloudellisetYleisettiedot";
import TaloudellisetInvestoinnit from "./Taloudelliset/TaloudellisetInvestoinnit";
import TaloudellisetTilinpaatostiedot from "./Taloudelliset/TaloudellisetTilinpaatostiedot";
import TaloudellisetLiitteet from "./Taloudelliset/TaloudellisetLiitteet";
import wizard from "../../../../../../i18n/definitions/wizard";
import PropTypes from "prop-types";
import * as R from "ramda";

const MuutospyyntoWizardTaloudelliset = ({
  changeObjects = {},
  muutoshakemus,
  onChangesUpdate,
  onStateUpdate,
  intl: { formatMessage }
}) => {
  const checkIfIsAdditions = changeObjects => {
    const findIsChecked = obj => {
      if (obj instanceof Array) {
        return R.any(findIsChecked, obj);
      } else if (obj instanceof Object) {
        const isChecked = R.prop("isChecked", obj);
        return (
          isChecked ||
          R.compose(
            R.any(([k, v]) => findIsChecked(v)),
            R.toPairs
          )(obj)
        );
      }
      return false;
    };

    return findIsChecked(changeObjects);
  };
  return (
    <React.Fragment>
      <h2 className="my-6">{formatMessage(wizard.pageTitle_3)}</h2>

      {!checkIfIsAdditions(R.props(["tutkinnot", "koulutukset"], changeObjects)) ? (
        <p>{formatMessage(wizard.noAddedTutkinnot)}</p>
      ) : (
        <React.Fragment>
          <FormSection
            id="taloudelliset_yleisettiedot"
            render={_props => (
              <React.Fragment>
                <TaloudellisetYleisettiedot
                  stateObject={R.path(
                    ["taloudelliset", "yleisettiedot"],
                    muutoshakemus
                  )}
                  changeObjects={{
                    taloudelliset: R.path(
                      ["taloudelliset", "yleisettiedot"],
                      changeObjects
                    )
                  }}
                  {..._props}
                />
              </React.Fragment>
            )}
            runOnStateUpdate={onStateUpdate}
            runOnChanges={onChangesUpdate}
          />
          <FormSection
            id="taloudelliset_investoinnit"
            render={_props => (
              <React.Fragment>
                <TaloudellisetInvestoinnit
                  stateObject={R.path(
                    ["taloudelliset", "investoinnit"],
                    muutoshakemus
                  )}
                  changeObjects={{
                    taloudelliset: R.path(
                      ["taloudelliset", "investoinnit"],
                      changeObjects
                    )
                  }}
                  {..._props}
                />
              </React.Fragment>
            )}
            runOnStateUpdate={onStateUpdate}
            runOnChanges={onChangesUpdate}
          />
          <FormSection
            id="taloudelliset_tilinpaatostiedot"
            render={_props => (
              <React.Fragment>
                <TaloudellisetTilinpaatostiedot
                  stateObject={R.path(
                    ["taloudelliset", "tilinpaatostiedot"],
                    muutoshakemus
                  )}
                  changeObjects={{
                    taloudelliset: R.path(
                      ["taloudelliset", "tilinpaatostiedot"],
                      changeObjects
                    )
                  }}
                  {..._props}
                />
              </React.Fragment>
            )}
            runOnStateUpdate={onStateUpdate}
            runOnChanges={onChangesUpdate}
          />
          <FormSection
            id="taloudelliset_liitteet"
            render={_props => (
              <React.Fragment>
                <TaloudellisetLiitteet
                  stateObject={R.path(
                    ["taloudelliset", "liitteet"],
                    muutoshakemus
                  )}
                  changeObjects={{
                    taloudelliset: R.path(
                      ["taloudelliset", "liitteet"],
                      changeObjects
                    )
                  }}
                  {..._props}
                />
              </React.Fragment>
            )}
            runOnStateUpdate={onStateUpdate}
            runOnChanges={onChangesUpdate}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

MuutospyyntoWizardTaloudelliset.propTypes = {
  changeObjects: PropTypes.object,
  muutoshakemus: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func
};

export default injectIntl(MuutospyyntoWizardTaloudelliset);
