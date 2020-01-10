import React, { useContext, useEffect, useState, useMemo } from "react";
import PerustelutKoulutukset from "./Perustelut/PerustelutKoulutukset";
import PerustelutMuut from "./Perustelut/PerustelutMuut";
import PerustelutOpetuskielet from "./Perustelut/PerustelutOpetuskielet";
import PerustelutTutkintokielet from "./Perustelut/PerustelutTutkintokielet";
import PerustelutTutkinnot from "./Perustelut/PerustelutTutkinnot";
import { LomakkeetContext } from "../../../../../../context/lomakkeetContext";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import * as R from "ramda";
import PerustelutToimintaalue from "./Perustelut/PerustelutToimintaalue";
import { updateFormStructure } from "../../../../../../services/lomakkeet/actions";
import {
  getAdditionFormStructure,
  getOsaamisalaFormStructure
} from "../../../../../../services/lomakkeet/perustelut/tutkinnot";
import { getRemovalFormStructure } from "../../../../../../services/lomakkeet/perustelut/tutkinnot";
import FormSection from "../../../../../../components/03-templates/FormSection";
import PerustelutOpiskelijavuodet from "./Perustelut/PerustelutOpiskelijavuodet";
import YhteenvetoLiitteet from "./Yhteenveto/YhteenvetoLiitteet";
import PerustelutLiitteet from "./Perustelut/PerustelutLiitteet";
import wizard from "../../../../../../i18n/definitions/wizard";

const MuutospyyntoWizardPerustelut = ({
  changeObjects = {},
  elykeskukset = [],
  intl,
  intl: { formatMessage },
  kielet,
  kohteet = [],
  koulutukset,
  maaraystyypit,
  muut,
  lupa,
  lupaKohteet,
  muutoshakemus,
  muutosperusteluList = [],
  onChangesUpdate,
  onStateUpdate,
  tutkinnot,
  vankilat = []
}) => {
  const [kohdetiedot, setKohdetiedot] = useState(null);
  const [maaraystyypitState, setMaaraystyypitState] = useState({});

  const { state: lomakkeet, dispatch: lomakkeetDispatch } = useContext(
    LomakkeetContext
  );

  useEffect(() => {
    /**
     * Let's get the structures of different tutkinto based reasoning forms and update the context.
     * These will be needed later.
     */
    const additionFormStructure = getAdditionFormStructure(
      R.sortBy(R.prop("koodiArvo"))(muutosperusteluList),
      R.toUpper(intl.locale)
    );
    updateFormStructure(
      ["perustelut", "tutkinnot", "addition"],
      additionFormStructure
    )(lomakkeetDispatch);
    const removalFormStructure = getRemovalFormStructure();
    updateFormStructure(
      ["perustelut", "tutkinnot", "removal"],
      removalFormStructure
    )(lomakkeetDispatch);
    const osaamisalaFormStructure = getOsaamisalaFormStructure();
    updateFormStructure(
      ["perustelut", "tutkinnot", "osaamisala"],
      osaamisalaFormStructure
    )(lomakkeetDispatch);
  }, [lomakkeetDispatch, muutosperusteluList, intl.locale]);

  useEffect(() => {
    const kohdeTiedot = R.map(kohde => {
      return {
        title: R.path(["meta", "otsikko", [intl.locale]], kohde),

        code: R.find(R.propEq("tunniste", kohde.tunniste))(lupaKohteet)
      };
    }, kohteet);
    setKohdetiedot(kohdeTiedot);
  }, [intl.locale, kohteet, lupaKohteet]);

  useEffect(() => {
    setMaaraystyypitState(
      R.mergeAll(
        R.flatten(
          R.map(item => {
            return {
              [R.props(["tunniste"], item)]: item
            };
          }, maaraystyypit)
        )
      )
    );
  }, [maaraystyypit]);

  const isTutkinnotChanges = useMemo(() => {
    return R.not(R.isEmpty(changeObjects.tutkinnot || {}));
  }, [changeObjects.tutkinnot]);

  const isKoulutuksetChanges = useMemo(() => {
    return R.not(R.isEmpty(changeObjects.koulutukset || {}));
  }, [changeObjects.koulutukset]);

  const isToimintaalueChanges = useMemo(() => {
    return R.not(R.isEmpty(changeObjects.toimintaalue || {}));
  }, [changeObjects.toimintaalue]);

  const { isTutkintokieletChanges, isOpetuskieletChanges } = useMemo(() => {
    return {
      isOpetuskieletChanges: R.not(
        R.isEmpty(R.prop("opetuskielet", changeObjects.kielet) || {})
      ),
      isTutkintokieletChanges: R.not(
        R.isEmpty(R.prop("tutkintokielet", changeObjects.kielet) || {})
      )
    };
  }, [changeObjects.kielet]);

  const isOpiskelijavuodetChanges = useMemo(() => {
    return R.not(R.isEmpty(changeObjects.opiskelijavuodet || {}));
  }, [changeObjects.opiskelijavuodet]);

  const isMuutChanges = useMemo(() => {
    return R.not(R.isEmpty(changeObjects.muut || {}));
  }, [changeObjects.muut]);

  const isAnyChanges = useMemo(() => {
    return (
      isTutkinnotChanges ||
      isKoulutuksetChanges ||
      isOpetuskieletChanges ||
      isTutkintokieletChanges ||
      isToimintaalueChanges ||
      isOpiskelijavuodetChanges ||
      isMuutChanges
    );
  }, [
    isTutkinnotChanges,
    isKoulutuksetChanges,
    isOpetuskieletChanges,
    isTutkintokieletChanges,
    isToimintaalueChanges,
    isOpiskelijavuodetChanges,
    isMuutChanges
  ]);

  return (
    <React.Fragment>
      <h2 className="my-6">{formatMessage(wizard.pageTitle_2)}</h2>

      {!isAnyChanges && <p>{formatMessage(wizard.noChanges)}</p>}

      {isAnyChanges && muutosperusteluList && muutoshakemus && kohdetiedot ? (
        <React.Fragment>
          {(isTutkinnotChanges || isKoulutuksetChanges) && (
            <FormSection
              code={1}
              id="perustelut_tutkinnot"
              muutoshakemus={muutoshakemus}
              render={_props => (
                <React.Fragment>
                  {isTutkinnotChanges && (
                    <PerustelutTutkinnot
                      changeObjects={{
                        tutkinnot: R.prop("tutkinnot", changeObjects) || {},
                        perustelut: {
                          tutkinnot:
                            R.path(
                              ["perustelut", "tutkinnot"],
                              changeObjects
                            ) || {}
                        }
                      }}
                      kohde={R.find(
                        R.propEq("tunniste", "tutkinnotjakoulutukset")
                      )(kohteet)}
                      lupa={lupa}
                      lupaKohteet={lupaKohteet}
                      maaraystyyppi={maaraystyypitState.OIKEUS}
                      lomakkeet={lomakkeet.perustelut.tutkinnot}
                      stateObject={R.path(["perustelut", "tutkinnot"])(
                        muutoshakemus
                      )}
                      tutkinnot={tutkinnot}
                      {..._props}
                    />
                  )}
                  {isKoulutuksetChanges ? (
                    <PerustelutKoulutukset
                      changeObjects={{
                        koulutukset: R.prop("koulutukset", changeObjects),
                        perustelut: {
                          koulutukset: R.path(
                            ["perustelut", "koulutukset"],
                            changeObjects
                          )
                        }
                      }}
                      elykeskukset={elykeskukset}
                      kohde={R.find(
                        R.propEq("tunniste", "tutkinnotjakoulutukset")
                      )(kohteet)}
                      koulutukset={koulutukset}
                      maaraystyyppi={maaraystyypitState.OIKEUS}
                      maaraykset={lupa.maaraykset}
                      lomakkeet={lomakkeet.perustelut.koulutukset}
                      stateObject={R.path([
                        "perustelut",
                        "koulutukset",
                        "valmentavatKoulutukset"
                      ])(muutoshakemus)}
                      {..._props}
                    />
                  ) : null}
                  {/* Attachments for Tutkinnot ja koulutukset */}
                  <FormSection
                    id="perustelut_liitteet"
                    className="my-0"
                    render={_props => (
                      <React.Fragment>
                        <PerustelutLiitteet
                          stateObject={R.path(
                            ["perustelut", "liitteet"],
                            muutoshakemus
                          )}
                          changeObjects={{
                            perustelut: R.path(
                              ["perustelut", "liitteet"],
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
              runOnStateUpdate={onStateUpdate}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[0].title}
            />
          )}
          {(isTutkintokieletChanges || isOpetuskieletChanges) && (
            <FormSection
              code={2}
              id="perustelut_kielet"
              muutoshakemus={muutoshakemus}
              render={_props => (
                <React.Fragment>
                  {isOpetuskieletChanges ? (
                    <PerustelutOpetuskielet
                      changeObjects={{
                        opetuskielet:
                          R.path(["kielet", "opetuskielet"], changeObjects) ||
                          [],
                        perustelut:
                          R.path(
                            ["perustelut", "kielet", "opetuskielet"],
                            changeObjects
                          ) || []
                      }}
                      kohde={R.find(
                        R.propEq("tunniste", "opetusjatutkintokieli")
                      )(kohteet)}
                      lupa={lupa}
                      maaraystyyppi={maaraystyypitState.OIKEUS}
                      opetuskielet={kielet.opetuskielet}
                      stateObject={R.path([
                        "perustelut",
                        "kielet",
                        "opetuskielet"
                      ])(muutoshakemus)}
                      {..._props}
                    />
                  ) : null}

                  {isTutkintokieletChanges ? (
                    <PerustelutTutkintokielet
                      changeObjects={{
                        tutkintokielet:
                          R.path(["kielet", "tutkintokielet"], changeObjects) ||
                          [],
                        perustelut:
                          R.path(
                            ["perustelut", "kielet", "tutkintokielet"],
                            changeObjects
                          ) || []
                      }}
                      kohde={R.find(
                        R.propEq("tunniste", "opetusjatutkintokieli")
                      )(kohteet)}
                      tutkinnot={tutkinnot}
                      maaraystyyppi={maaraystyypitState.OIKEUS}
                      maaraykset={lupa.maaraykset}
                      opetuskielet={kielet.opetuskielet}
                      stateObjects={{
                        tutkintokielet: R.path(["kielet", "tutkintokielet"])(
                          muutoshakemus
                        ),
                        perustelut: R.path([
                          "perustelut",
                          "kielet",
                          "tutkintokielet"
                        ])(muutoshakemus)
                      }}
                      {..._props}
                    />
                  ) : null}
                </React.Fragment>
              )}
              runOnStateUpdate={onStateUpdate}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[1].title}
            />
          )}
          {isToimintaalueChanges ? (
            <FormSection
              code={3}
              id="perustelut_toimintaalue"
              muutoshakemus={muutoshakemus}
              render={_props => (
                <React.Fragment>
                  <PerustelutToimintaalue
                    lupakohde={lupaKohteet[3]}
                    changeObjects={{
                      toimintaalue: R.path(["toimintaalue"], changeObjects),
                      perustelut: R.path(
                        ["perustelut", "toimintaalue"],
                        changeObjects
                      )
                    }}
                    stateObjects={{
                      toimintaalue: muutoshakemus.toimintaalue,
                      perustelut: R.path(["perustelut", "toimintaalue"])(
                        muutoshakemus
                      )
                    }}
                    {..._props}
                  />
                </React.Fragment>
              )}
              runOnStateUpdate={onStateUpdate}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[2].title}
            />
          ) : null}
          {isOpiskelijavuodetChanges ? (
            <FormSection
              code={4}
              id="perustelut_opiskelijavuodet"
              muutoshakemus={muutoshakemus}
              render={_props => (
                <React.Fragment>
                  <PerustelutOpiskelijavuodet
                    changeObjects={{
                      opiskelijavuodet: R.path(
                        ["opiskelijavuodet"],
                        changeObjects
                      ),
                      perustelut: R.path(
                        ["perustelut", "opiskelijavuodet"],
                        changeObjects
                      )
                    }}
                    kohde={R.find(R.propEq("tunniste", "opiskelijavuodet"))(
                      kohteet
                    )}
                    muutosperustelut={R.sortBy(R.prop("koodiArvo"))(
                      muutosperusteluList
                    )}
                    stateObject={{
                      opiskelijavuodet: R.path(
                        ["opiskelijavuodet"],
                        muutoshakemus
                      )
                    }}
                    {..._props}
                  />
                </React.Fragment>
              )}
              runOnStateUpdate={onStateUpdate}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[3].title}
            />
          ) : null}
          {isMuutChanges ? (
            <FormSection
              code={5}
              id="perustelut_muut"
              muutoshakemus={muutoshakemus}
              render={_props => (
                <React.Fragment>
                  <PerustelutMuut
                    changeObjects={{
                      muut: R.path(["muut"], changeObjects),
                      perustelut: R.path(["perustelut", "muut"], changeObjects)
                    }}
                    kohde={R.find(R.propEq("tunniste", "muut"))(kohteet)}
                    maaraykset={lupa.maaraykset}
                    muut={muut}
                    stateObject={R.path(["perustelut", "muut"])(muutoshakemus)}
                    vankilat={vankilat}
                    {..._props}
                  />
                </React.Fragment>
              )}
              runOnStateUpdate={onStateUpdate}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[4].title}
            />
          ) : null}
          {/* Common attachments, the same also in Yhteenveto */}
          {isAnyChanges && (
            <FormSection
              id="yhteenveto_hakemuksenliitteet"
              className="my-0"
              render={_props => (
                <React.Fragment>
                  <YhteenvetoLiitteet
                    stateObject={R.path(
                      ["yhteenveto", "hakemuksenliitteet"],
                      muutoshakemus
                    )}
                    changeObjects={{
                      yhteenveto: R.path(
                        ["yhteenveto", "hakemuksenliitteet"],
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
          )}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

MuutospyyntoWizardPerustelut.propTypes = {
  changeObjects: PropTypes.object,
  elykeskukset: PropTypes.array,
  kielet: PropTypes.object,
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  muutoshakemus: PropTypes.object,
  muutosperusteluList: PropTypes.array,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  tutkinnot: PropTypes.object,
  vankilat: PropTypes.array
};

export default injectIntl(MuutospyyntoWizardPerustelut);
