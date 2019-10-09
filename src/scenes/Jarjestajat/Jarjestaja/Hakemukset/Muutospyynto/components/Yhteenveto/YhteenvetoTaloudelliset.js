import React from "react";
import { MUUTOS_WIZARD_TEKSTIT } from "../../modules/constants";
import FormSection from "../../../../../../../components/03-templates/FormSection";
import { injectIntl } from "react-intl";
import TaloudellisetYleisettiedot from "../Taloudelliset/TaloudellisetYleisettiedot";
import TaloudellisetInvestoinnit from "../Taloudelliset/TaloudellisetInvestoinnit";
import TaloudellisetTilinpaatostiedot from "../Taloudelliset/TaloudellisetTilinpaatostiedot";
import TaloudellisetLiitteet from "../Taloudelliset/TaloudellisetLiitteet";
import PropTypes from "prop-types";
import * as R from "ramda";

const YhteenvetoTaloudelliset = ({
  changeObjects,
  muutoshakemus,
  onChangesUpdate,
  onStateUpdate
}) => {
  return (
    <React.Fragment>
      <h2 className="my-6">
        {MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.PAAOTSIKKO.FI}
      </h2>

      {!changeObjects && (
        <p>{MUUTOS_WIZARD_TEKSTIT.TALOUDELLISET.EI_LISATTYJA_TUTKINTOJA.FI}</p>
      )}
      {changeObjects && (
        <React.Fragment>
          <FormSection
            className="my-0"
            id="yhteenveto_taloudelliset_yleisettiedot"
            render={_props => (
              <React.Fragment>
                <TaloudellisetYleisettiedot
                  stateObject={R.path(
                    ["yhteenveto", "taloudelliset", "yleisettiedot"],
                    muutoshakemus
                  )}
                  changeObjects={{
                    taloudelliset: R.path(
                      ["taloudelliset", "yleisettiedot"],
                      changeObjects
                    )
                  }}
                  isReadOnly={true}
                  {..._props}
                />
              </React.Fragment>
            )}
            runOnStateUpdate={onStateUpdate}
            runOnChanges={onChangesUpdate}
          />
          <FormSection
            id="yhteenveto_taloudelliset_investoinnit"
            render={_props => (
              <React.Fragment>
                <TaloudellisetInvestoinnit
                  stateObject={R.path(
                    ["yhteenveto", "taloudelliset", "investoinnit"],
                    muutoshakemus
                  )}
                  changeObjects={{
                    taloudelliset: R.path(
                      ["taloudelliset", "investoinnit"],
                      changeObjects
                    )
                  }}
                  isReadOnly={true}
                  {..._props}
                />
              </React.Fragment>
            )}
            runOnStateUpdate={onStateUpdate}
            runOnChanges={onChangesUpdate}
          />
          <FormSection
            id="yhteenveto_taloudelliset_tilinpaatostiedot"
            render={_props => (
              <React.Fragment>
                <TaloudellisetTilinpaatostiedot
                  stateObject={R.path(
                    ["yhteenveto", "taloudelliset", "tilinpaatostiedot"],
                    muutoshakemus
                  )}
                  changeObjects={{
                    taloudelliset: R.path(
                      ["taloudelliset", "tilinpaatostiedot"],
                      changeObjects
                    )
                  }}
                  isReadOnly={true}
                  {..._props}
                />
              </React.Fragment>
            )}
            runOnStateUpdate={onStateUpdate}
            runOnChanges={onChangesUpdate}
          />
          {/* <FormSection
            id="yhteenveto_taloudelliset_liitteet"
            render={_props => (
              <React.Fragment>
                <TaloudellisetLiitteet
                  stateObject={R.path(
                    ["yhteenveto", "taloudelliset", "liitteet"],
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
          /> */}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

YhteenvetoTaloudelliset.propTypes = {
  changeObjects: PropTypes.object,
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.object,
  koulutustyypit: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.object,
  lupa: PropTypes.object,
  muutoshakemus: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func
};

export default injectIntl(YhteenvetoTaloudelliset);
