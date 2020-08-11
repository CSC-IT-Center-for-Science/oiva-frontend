import React, { useEffect, useState, useMemo } from "react";
import PerustelutKoulutukset from "./Perustelut/PerustelutKoulutukset";
import PerustelutMuut from "./Perustelut/PerustelutMuut";
import PerustelutOpetuskielet from "./Perustelut/PerustelutOpetuskielet";
import PerustelutTutkintokielet from "./Perustelut/PerustelutTutkintokielet";
import PerustelutTutkinnot from "./Perustelut/PerustelutTutkinnot";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import PerustelutToimintaalue from "./Perustelut/PerustelutToimintaalue";
import PerustelutOpiskelijavuodet from "./Perustelut/PerustelutOpiskelijavuodet";
import YhteenvetoLiitteet from "./Yhteenveto/YhteenvetoLiitteet";
import PerustelutLiitteet from "./Perustelut/PerustelutLiitteet";
import wizard from "../../../../../../i18n/definitions/wizard";
import * as R from "ramda";
import Section from "components/03-templates/Section";

const defaultProps = {
  changeObjects: {},
  elykeskukset: [],
  kohteet: [],
  oivaperustelut: [],
  vankilat: []
};

const MuutospyyntoWizardPerustelut = ({
  changeObjects = defaultProps.changeObjects,
  elykeskukset = defaultProps.elykeskukset,
  visits,
  kielet,
  kohteet = defaultProps.kohteet,
  koulutukset,
  koulutusalat,
  koulutustyypit,
  maakuntakunnat,
  maaraystyypit,
  muut,
  lupa,
  lupaKohteet,
  oivaperustelut = defaultProps.oivaperustelut,
  onChangesRemove,
  onChangesUpdate,
  opetuskielet,
  tutkinnot,
  vankilat = defaultProps.vankilat
}) => {
  const intl = useIntl();
  const [kohdetiedot, setKohdetiedot] = useState(null);
  const [maaraystyypitState, setMaaraystyypitState] = useState({});

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
  console.info(changeObjects);
  return (
    <React.Fragment>
      <h2 className="my-6">{intl.formatMessage(wizard.pageTitle_2)}</h2>

      {!isAnyChanges && <p>{intl.formatMessage(wizard.noChanges)}</p>}
      {isAnyChanges && (
        <p>{intl.formatMessage(wizard.allPerustelutRequired)}</p>
      )}

      {isAnyChanges && kohdetiedot ? (
        <React.Fragment>
          {(isTutkinnotChanges || isKoulutuksetChanges) && (
            <Section
              code={lupaKohteet[1].headingNumber}
              title={lupaKohteet[1].heading}>
              {isTutkinnotChanges && (
                <PerustelutTutkinnot
                  changeObjects={{
                    tutkinnot: R.prop("tutkinnot", changeObjects) || {},
                    perustelut: {
                      tutkinnot:
                        R.path(["perustelut", "tutkinnot"], changeObjects) || {}
                    }
                  }}
                  isFirstVisit={visits === 1}
                  kohde={R.find(R.propEq("tunniste", "tutkinnotjakoulutukset"))(
                    kohteet
                  )}
                  koulutusalat={koulutusalat}
                  koulutustyypit={koulutustyypit}
                  lupa={lupa}
                  lupaKohteet={lupaKohteet}
                  maaraystyyppi={maaraystyypitState.OIKEUS}
                  oivaperustelut={oivaperustelut}
                  tutkinnot={tutkinnot}
                  onChangesRemove={onChangesRemove}
                  onChangesUpdate={onChangesUpdate}
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
                  kohde={R.find(R.propEq("tunniste", "tutkinnotjakoulutukset"))(
                    kohteet
                  )}
                  koulutukset={koulutukset}
                  maaraystyyppi={maaraystyypitState.OIKEUS}
                  maaraykset={lupa.maaraykset}
                  onChangesRemove={onChangesRemove}
                  onChangesUpdate={onChangesUpdate}
                />
              )}
              {/* Attachments for Tutkinnot ja koulutukset */}
              <Section className="my-0">
                <PerustelutLiitteet
                  changeObjects={{
                    perustelut: changeObjects.perustelut.liitteet
                  }}
                  onChangesRemove={onChangesRemove}
                  onChangesUpdate={onChangesUpdate}
                />
              </Section>
            </Section>
          )}
          {(isTutkintokieletChanges || isOpetuskieletChanges) && (
            <Section code={2} title={kohdetiedot[1].title}>
              {isOpetuskieletChanges ? (
                <PerustelutOpetuskielet
                  changeObjects={{
                    opetuskielet:
                      R.path(["kielet", "opetuskielet"], changeObjects) || [],
                    perustelut:
                      R.path(
                        ["perustelut", "kielet", "opetuskielet"],
                        changeObjects
                      ) || []
                  }}
                  kohde={R.find(R.propEq("tunniste", "opetusjatutkintokieli"))(
                    kohteet
                  )}
                  lupa={lupa}
                  maaraystyyppi={maaraystyypitState.OIKEUS}
                  opetuskielet={opetuskielet}
                  onChangesRemove={onChangesRemove}
                  onChangesUpdate={onChangesUpdate}
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
                      koulutusalat={koulutusalat}
                      onChangesRemove={onChangesRemove}
                      onChangesUpdate={onChangesUpdate}
                    />
                  ) : null}
            </Section>
          )}

          {/* TOIMINTA-ALUE */}
          {isToimintaalueChanges ? (
            <Section code={3} title={kohdetiedot[2].title}>
              <PerustelutToimintaalue
                kohde={R.find(R.propEq("tunniste", "toimintaalue"))(kohteet)}
                lupakohde={lupaKohteet[3]}
                maakuntakunnat={maakuntakunnat}
                maaraystyyppi={maaraystyypitState.VELVOITE}
                changeObjects={{
                  toimintaalue: R.path(["toimintaalue"], changeObjects),
                  perustelut: R.path(
                    ["perustelut", "toimintaalue"],
                    changeObjects
                  )
                }}
                onChangesRemove={onChangesRemove}
                onChangesUpdate={onChangesUpdate}
              />
            </Section>
          ) : null}

          {/* OPISKELIJAVUODET */}
          {isOpiskelijavuodetChanges ? (
            <Section code={4} title={kohdetiedot[3].title}>
              <PerustelutOpiskelijavuodet
                changeObjects={changeObjects}
                oivaperustelut={oivaperustelut}
                onChangesRemove={onChangesRemove}
                onChangesUpdate={onChangesUpdate}
              />
            </Section>
          ) : null}

          {/* MUUT */}
          {isMuutChanges ? (
            <Section code={5} title={kohdetiedot[4].title}>
              <PerustelutMuut
                changeObjects={{
                  muut: changeObjects.muut,
                  perustelut: changeObjects.perustelut.muut
                }}
                maaraykset={lupa.maaraykset}
                muut={muut}
                onChangesRemove={onChangesRemove}
                onChangesUpdate={onChangesUpdate}
                vankilat={vankilat}
              />
            </Section>
          ) : null}
          {/* Common attachments, the same also in Yhteenveto */}
          {isAnyChanges && (
            <Section className="my-0">
              <YhteenvetoLiitteet
                changeObjects={{
                  hakemuksenLiitteet:
                    changeObjects.yhteenveto.hakemuksenLiitteet
                }}
                onChangesRemove={onChangesRemove}
                onChangesUpdate={onChangesUpdate}
              />
            </Section>
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
  kielet: PropTypes.array,
  kohteet: PropTypes.array,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  koulutukset: PropTypes.object,
  maakuntakunnat: PropTypes.array,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  oivaperustelut: PropTypes.array,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  opetuskielet: PropTypes.array,
  tutkinnot: PropTypes.array,
  vankilat: PropTypes.array
};

export default MuutospyyntoWizardPerustelut;
