import React, { useEffect, useState } from "react";
import Tutkinnot from "./Tutkinnot";
import MuutospyyntoWizardKoulutukset from "./MuutospyyntoWizardKoulutukset";
import MuutospyyntoWizardKielet from "./MuutospyyntoWizardKielet";
import MuutospyyntoWizardToimialue from "./MuutospyyntoWizardToimintaalue";
import MuutospyyntoWizardOpiskelijavuodet from "./MuutospyyntoWizardOpiskelijavuodet";
import MuutospyyntoWizardMuut from "./MuutospyyntoWizardMuut";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import * as R from "ramda";
import FormSection from "../../../../../../components/03-templates/FormSection";

const MuutospyyntoWizardMuutokset = React.memo(props => {
  const [kohteet, setKohteet] = useState({});
  const [maaraystyypit, setMaaraystyypit] = useState(null);

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

  useEffect(() => {
    setMaaraystyypit(
      R.mergeAll(
        R.flatten(
          R.map(item => {
            return {
              [R.props(["tunniste"], item)]: item
            };
          }, props.maaraystyypit)
        )
      )
    );
  }, [props.maaraystyypit]);

  return (
    <React.Fragment>
      <div>
        <p className="py-10">
          {props.intl.formatMessage(wizardMessages.info_01)}
        </p>

        <form onSubmit={props.handleSubmit}>
          {R.is(Object, maaraystyypit) ? (
            <React.Fragment>
              <FormSection
                code={props.lupa.kohteet[1].headingNumber}
                id="tutkinnot"
                render={_props => (
                  <React.Fragment>
                    <Tutkinnot
                      changeObjects={R.prop("tutkinnot", props.changeObjects)}
                      kohde={kohteet.tutkinnotjakoulutukset}
                      koulutukset={props.koulutukset}
                      koulutusalat={props.koulutusalat}
                      koulutustyypit={props.koulutustyypit.data}
                      lupa={props.lupa}
                      maaraystyyppi={maaraystyypit.OIKEUS}
                      stateObject={props.muutoshakemus.tutkinnot}
                      {..._props}
                    />
                    <MuutospyyntoWizardKoulutukset
                      changeObjects={R.prop("koulutukset", props.changeObjects)}
                      kohde={kohteet.tutkinnotjakoulutukset}
                      koulutukset={props.koulutukset}
                      maaraystyyppi={maaraystyypit.OIKEUS}
                      stateObjects={props.muutoshakemus.koulutukset}
                      {..._props}
                    />
                  </React.Fragment>
                )}
                runOnStateUpdate={props.onStateUpdate}
                runOnChanges={props.onChangesUpdate}
                title={props.lupa.kohteet[1].heading}
              />

              {!!R.path(["tutkinnot", "items"], props.muutoshakemus) ? (
                <FormSection
                  code={props.lupa.kohteet[2].headingNumber}
                  id="tutkinnot"
                  render={_props => (
                    <React.Fragment>
                      <MuutospyyntoWizardKielet
                        changeObjects={{
                          kielet: R.prop("kielet", props.changeObjects),
                          tutkinnot: R.prop("tutkinnot", props.changeObjects)
                        }}
                        kohde={kohteet.kielet}
                        lupa={props.lupa}
                        kielet={props.kielet}
                        koulutukset={props.koulutukset}
                        onUpdate={props.onUpdate}
                        maaraystyyppi={maaraystyypit.VELVOITE}
                        stateObjects={{
                          kielet: R.prop("kielet", props.muutoshakemus),
                          tutkinnot: R.prop("tutkinnot", props.muutoshakemus)
                        }}
                        {..._props}
                      />
                    </React.Fragment>
                  )}
                  runOnStateUpdate={props.onStateUpdate}
                  runOnChanges={props.onChangesUpdate}
                  title={props.intl.formatMessage(
                    wizardMessages.header_section2
                  )}
                />
              ) : null}

              {!!R.path(["toimintaalue"], props.muutoshakemus) && (
                <FormSection
                  code={3}
                  id="toimintaalue"
                  render={_props => (
                    <MuutospyyntoWizardToimialue
                      changeObjects={R.prop(
                        "toimintaalue",
                        props.changeObjects
                      )}
                      muutokset={props.toimintaalueMuutokset}
                      lupakohde={props.lupa.kohteet[3]}
                      kohde={kohteet.toimintaalue}
                      kunnat={props.kunnat}
                      maakuntakunnat={props.maakuntakunnat}
                      maakunnat={props.maakunnat}
                      maaraystyyppi={maaraystyypit.VELVOITE}
                      stateObjects={{
                        toimintaalue: R.prop(
                          "toimintaalue",
                          props.muutoshakemus
                        )
                      }}
                      {..._props}
                    />
                  )}
                  runOnStateUpdate={props.onStateUpdate}
                  runOnChanges={props.onChangesUpdate}
                  title={R.path(
                    ["meta", "otsikko", props.intl.locale],
                    kohteet.toimintaalue
                  )}
                />
              )}

              {kohteet.opiskelijavuodet &&
                !!R.path(["muut", "muutdata"], props.muutoshakemus) && (
                  <FormSection
                    code={props.lupa.kohteet[4].headingNumber}
                    id="opiskelijavuodet"
                    render={_props => (
                      <React.Fragment>
                        <MuutospyyntoWizardOpiskelijavuodet
                          changeObjects={{
                            opiskelijavuodet: R.prop(
                              "opiskelijavuodet",
                              props.changeObjects
                            ),
                            muut: R.prop("muut", props.changeObjects)
                          }}
                          kohde={kohteet.opiskelijavuodet}
                          lupa={props.lupa}
                          maaraystyyppi={maaraystyypit.OIKEUS}
                          muut={props.muut}
                          opiskelijavuodet={props.opiskelijavuodet}
                          stateObjects={{
                            opiskelijavuodet: R.prop(
                              "opiskelijavuodet",
                              props.muutoshakemus
                            ),
                            muut: R.prop("muut", props.muutoshakemus)
                          }}
                          {..._props}
                        />
                      </React.Fragment>
                    )}
                    runOnStateUpdate={props.onStateUpdate}
                    runOnChanges={props.onChangesUpdate}
                    title={props.intl.formatMessage(
                      wizardMessages.header_section4
                    )}
                  />
                )}

              {kohteet.muut && props.muut && maaraystyypit && (
                <FormSection
                  code={props.lupa.kohteet[5].headingNumber}
                  id="muut"
                  render={_props => (
                    <React.Fragment>
                      {kohteet.muut && props.muut && maaraystyypit && (
                        <MuutospyyntoWizardMuut
                          changeObjects={{
                            muut: R.prop("muut", props.changeObjects)
                          }}
                          kohde={kohteet.muut}
                          maaraykset={props.lupa.data.maaraykset}
                          muut={props.muut}
                          koulutukset={props.koulutukset}
                          maaraystyyppi={maaraystyypit.VELVOITE}
                          stateObjects={{
                            muut: props.muutoshakemus.muut
                          }}
                          {..._props}
                        />
                      )}
                    </React.Fragment>
                  )}
                  runOnStateUpdate={props.onStateUpdate}
                  runOnChanges={props.onChangesUpdate}
                  title={props.intl.formatMessage(
                    wizardMessages.header_section5
                  )}
                />
              )}
            </React.Fragment>
          ) : null}
        </form>
      </div>
    </React.Fragment>
  );
});

MuutospyyntoWizardMuutokset.propTypes = {
  changeObjects: PropTypes.object,
  kielet: PropTypes.object,
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.object,
  koulutustyypit: PropTypes.object,
  kunnat: PropTypes.array,
  maakuntakunnat: PropTypes.object,
  maakunnat: PropTypes.array,
  lupa: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.object,
  muutoshakemus: PropTypes.object,
  onStateUpdate: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  toimintaalueMuutokset: PropTypes.array
};

export default injectIntl(MuutospyyntoWizardMuutokset);
