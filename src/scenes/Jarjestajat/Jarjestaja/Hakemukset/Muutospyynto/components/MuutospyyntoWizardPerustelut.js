import React, { useEffect, useState, useMemo } from "react";
import PerustelutKoulutukset from "./Perustelut/PerustelutKoulutukset";
import PerustelutMuut from "./Perustelut/PerustelutMuut";
import PerustelutOpetuskielet from "./Perustelut/PerustelutOpetuskielet";
import PerustelutTutkintokielet from "./Perustelut/PerustelutTutkintokielet";
import PerustelutTutkinnot from "./Perustelut/PerustelutTutkinnot";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import PerustelutToimintaalue from "./Perustelut/PerustelutToimintaalue";
import FormSection from "../../../../../../components/03-templates/FormSection";
import PerustelutOpiskelijavuodet from "./Perustelut/PerustelutOpiskelijavuodet";
import YhteenvetoLiitteet from "./Yhteenveto/YhteenvetoLiitteet";
import PerustelutLiitteet from "./Perustelut/PerustelutLiitteet";
import wizard from "../../../../../../i18n/definitions/wizard";
import * as R from "ramda";

const MuutospyyntoWizardPerustelut = ({
  changeObjects = {},
  elykeskukset = [],
  visits,
  kielet,
  kohteet = [],
  koulutukset,
  maakuntakunnatList,
  maaraystyypit,
  muut,
  lupa,
  lupaKohteet,
  muutosperusteluList = [],
  onChangesUpdate,
  tutkinnot,
  vankilat = []
}) => {
  const intl = useIntl();
  const [kohdetiedot, setKohdetiedot] = useState(null);
  const [maaraystyypitState, setMaaraystyypitState] = useState({});

  const muutosperusteluListSorted = useMemo(() => {
    return R.sortBy(R.prop("koodiArvo"))(muutosperusteluList);
  }, [muutosperusteluList]);

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
    return R.not(R.isEmpty(R.flatten(R.values(changeObjects.koulutukset))));
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
      <h2 className="my-6">{intl.formatMessage(wizard.pageTitle_2)}</h2>

      {!isAnyChanges && <p>{intl.formatMessage(wizard.noChanges)}</p>}
      {isAnyChanges && (
        <p>{intl.formatMessage(wizard.allPerustelutRequired)}</p>
      )}

      {isAnyChanges && muutosperusteluList && kohdetiedot ? (
        <React.Fragment>
          {(isTutkinnotChanges || isKoulutuksetChanges) && (
            <FormSection
              code={1}
              id="perustelut_tutkinnot"
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
                      isFirstVisit={visits === 1}
                      kohde={R.find(
                        R.propEq("tunniste", "tutkinnotjakoulutukset")
                      )(kohteet)}
                      lupa={lupa}
                      lupaKohteet={lupaKohteet}
                      maaraystyyppi={maaraystyypitState.OIKEUS}
                      muutosperustelut={muutosperusteluListSorted}
                      tutkinnot={tutkinnot}
                      {..._props}
                    />
                  )}
                  {isKoulutuksetChanges && (
                    <PerustelutKoulutukset
                      changeObjects={{
                        koulutukset: changeObjects.koulutukset,
                        perustelut: {
                          koulutukset: changeObjects.perustelut.koulutukset
                        }
                      }}
                      elykeskukset={elykeskukset}
                      kohde={R.find(
                        R.propEq("tunniste", "tutkinnotjakoulutukset")
                      )(kohteet)}
                      koulutukset={koulutukset}
                      maaraystyyppi={maaraystyypitState.OIKEUS}
                      maaraykset={lupa.maaraykset}
                      {..._props}
                    />
                  )}
                  {/* Attachments for Tutkinnot ja koulutukset */}
                  <FormSection
                    id="perustelut_liitteet"
                    className="my-0"
                    render={_props => (
                      <React.Fragment>
                        <PerustelutLiitteet
                          changeObjects={{
                            perustelut: changeObjects.perustelut.liitteet
                          }}
                          {..._props}
                        />
                      </React.Fragment>
                    )}
                    runOnChanges={onChangesUpdate}
                  />
                </React.Fragment>
              )}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[0].title}
            />
          )}
          {(isTutkintokieletChanges || isOpetuskieletChanges) && (
            <FormSection
              code={2}
              id="perustelut_kielet"
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
                      {..._props}
                    />
                  ) : null}

                  {isTutkintokieletChanges ? (
                    <PerustelutTutkintokielet
                      changeObjects={{
                        tutkintokielet: changeObjects.kielet.tutkintokielet,
                        perustelut: {
                          tutkintokielet: R.path(
                            ["perustelut", "kielet", "tutkintokielet"],
                            changeObjects
                          )
                        }
                      }}
                      kohde={R.find(
                        R.propEq("tunniste", "opetusjatutkintokieli")
                      )(kohteet)}
                      tutkinnot={tutkinnot}
                      maaraystyyppi={maaraystyypitState.OIKEUS}
                      maaraykset={lupa.maaraykset}
                      opetuskielet={kielet.opetuskielet}
                      {..._props}
                    />
                  ) : null}
                </React.Fragment>
              )}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[1].title}
            />
          )}

          {/* TOIMINTA-ALUE */}
          {isToimintaalueChanges ? (
            <FormSection
              code={3}
              id="perustelut_toimintaalue"
              render={_props => (
                <React.Fragment>
                  <PerustelutToimintaalue
                    kohde={R.find(R.propEq("tunniste", "toimintaalue"))(
                      kohteet
                    )}
                    lupakohde={lupaKohteet[3]}
                    maakuntakunnatList={maakuntakunnatList}
                    maaraystyyppi={maaraystyypitState.VELVOITE}
                    changeObjects={{
                      toimintaalue: R.path(["toimintaalue"], changeObjects),
                      perustelut: R.path(
                        ["perustelut", "toimintaalue"],
                        changeObjects
                      )
                    }}
                    {..._props}
                  />
                </React.Fragment>
              )}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[2].title}
            />
          ) : null}

          {/* OPISKELIJAVUODET */}
          {isOpiskelijavuodetChanges ? (
            <FormSection
              code={4}
              id="perustelut_opiskelijavuodet"
              render={_props => (
                <React.Fragment>
                  <PerustelutOpiskelijavuodet
                    muutosperustelut={R.sortBy(R.prop("koodiArvo"))(
                      muutosperusteluList
                    )}
                    {..._props}
                  />
                </React.Fragment>
              )}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[3].title}
            />
          ) : null}

          {/* MUUT */}
          {isMuutChanges ? (
            <FormSection
              code={5}
              id="perustelut_muut"
              render={_props => (
                <React.Fragment>
                  <PerustelutMuut
                    changeObjects={{
                      muut: changeObjects.muut,
                      perustelut: changeObjects.perustelut.muut
                    }}
                    maaraykset={lupa.maaraykset}
                    muut={muut}
                    vankilat={vankilat}
                    {..._props}
                  />
                </React.Fragment>
              )}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[4].title}
            />
          ) : null}
          {/* Common attachments, the same also in Yhteenveto */}
          {isAnyChanges && (
            <FormSection
              id="yhteenveto_hakemuksenLiitteet"
              className="my-0"
              render={_props => (
                <React.Fragment>
                  <YhteenvetoLiitteet
                    changeObjects={{
                      hakemuksenLiitteet:
                        changeObjects.yhteenveto.hakemuksenLiitteet
                    }}
                    {..._props}
                  />
                </React.Fragment>
              )}
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
  visits: PropTypes.number,
  kielet: PropTypes.object,
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  maakuntakunnatList: PropTypes.array,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  muutosperusteluList: PropTypes.array,
  onChangesUpdate: PropTypes.func,
  tutkinnot: PropTypes.object,
  vankilat: PropTypes.array
};

export default MuutospyyntoWizardPerustelut;
