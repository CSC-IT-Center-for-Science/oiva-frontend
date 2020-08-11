import React, { useEffect, useMemo, useState } from "react";
import PerustelutKoulutukset from "../Perustelut/PerustelutKoulutukset";
import PerustelutMuut from "../Perustelut/PerustelutMuut";
import PerustelutOpiskelijavuodet from "../Perustelut/PerustelutOpiskelijavuodet";
import PerustelutOpetuskielet from "../Perustelut/PerustelutOpetuskielet";
import PerustelutTutkintokielet from "../Perustelut/PerustelutTutkintokielet";
import PerustelutTutkinnot from "../Perustelut/PerustelutTutkinnot";
import PerustelutLiitteet from "../Perustelut/PerustelutLiitteet";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import PerustelutToimintaalue from "../Perustelut/PerustelutToimintaalue";
import FormSection from "../../../../../../../components/03-templates/FormSection";
import YhteenvetoTaloudelliset from "./YhteenvetoTaloudelliset";
import * as R from "ramda";
import Section from "components/03-templates/Section";

const YhteenvetoKooste = ({
  changeObjects,
  elykeskukset,
  kielet,
  kohteet,
  koulutukset,
  koulutusalat,
  koulutustyypit,
  maaraystyypit,
  muut,
  oivaperustelut,
  lupa,
  lupaKohteet,
  onChangesRemove,
  onChangesUpdate,
  opetuskielet,
  tutkinnot
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

  const isKoulutuksetChanges = useMemo(() => {
    return R.not(R.isEmpty(R.flatten(R.values(changeObjects.koulutukset))));
  }, [changeObjects.koulutukset]);

  return (
    <React.Fragment>
      {kohdetiedot && kohdetiedot.length ? (
        <React.Fragment>
          <Section
            code={lupaKohteet[1].headingNumber}
            title={lupaKohteet[1].heading}>
            {!R.isEmpty(changeObjects.tutkinnot) && (
              <PerustelutTutkinnot
                changeObjects={{
                  tutkinnot: R.prop("tutkinnot", changeObjects) || {},
                  perustelut: {
                    tutkinnot:
                      R.path(["perustelut", "tutkinnot"], changeObjects) || {}
                  }
                }}
                isFirstVisit={false}
                isReadOnly={true}
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
                isReadOnly={true}
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

          {!R.isEmpty(changeObjects.kielet.opetuskielet) ||
          !R.isEmpty(changeObjects.kielet.tutkintokielet) ? (
            <FormSection
              code={2}
              id="perustelut_kielet"
              render={_props => (
                <React.Fragment>
                  {!!R.path(["kielet", "opetuskielet"], changeObjects) ? (
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
                      isReadOnly={true}
                      kohde={R.find(
                        R.propEq("tunniste", "opetusjatutkintokieli")
                      )(kohteet)}
                      lupa={lupa}
                      maaraystyyppi={maaraystyypitState.OIKEUS}
                      opetuskielet={opetuskielet}
                      onChangesRemove={onChangesRemove}
                      onChangesUpdate={onChangesUpdate}
                    />
                  ) : null}

                  {!!R.path(["kielet", "tutkintokielet"], changeObjects) ? (
                    <PerustelutTutkintokielet
                      changeObjects={{
                        tutkintokielet:
                          R.path(["kielet", "tutkintokielet"], changeObjects) ||
                          [],
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
                      koulutukset={koulutukset}
                      maaraystyyppi={maaraystyypitState.OIKEUS}
                      maaraykset={lupa.maaraykset}
                      opetuskielet={opetuskielet}
                      tutkinnot={tutkinnot}
                      isReadOnly={true}
                      {..._props}
                    />
                  ) : null}
                </React.Fragment>
              )}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[1].title}
            />
          ) : null}

          {/* TOIMINTA-ALUE */}
          {!R.isEmpty(changeObjects.toimintaalue) ? (
            <FormSection
              code={3}
              id="perustelut_toimintaalue"
              render={_props => (
                <React.Fragment>
                  {!!R.path(["toimintaalue"], changeObjects) ? (
                    <PerustelutToimintaalue
                      lupakohde={lupaKohteet[3]}
                      changeObjects={{
                        toimintaalue: R.path(["toimintaalue"], changeObjects),
                        perustelut: R.path(
                          ["perustelut", "toimintaalue"],
                          changeObjects
                        )
                      }}
                      isReadOnly={true}
                      {..._props}
                    />
                  ) : null}
                </React.Fragment>
              )}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[2].title}
            />
          ) : null}

          {/* OPISKELIJAVUODET */}
          {!R.isEmpty(changeObjects.opiskelijavuodet) ? (
            <Section code={4} title={kohdetiedot[3].title}>
              <PerustelutOpiskelijavuodet
                changeObjects={changeObjects}
                isReadOnly={true}
                oivaperustelut={oivaperustelut}
                onChangesRemove={onChangesRemove}
                onChangesUpdate={onChangesUpdate}
              />
            </Section>
          ) : null}

          {/* MUUT */}
          {!R.isEmpty(changeObjects.muut) ? (
            <FormSection
              code={5}
              id="perustelut_muut"
              render={_props => (
                <React.Fragment>
                  {!!R.path(["muut"], changeObjects) ? (
                    <PerustelutMuut
                      changeObjects={{
                        muut: R.path(["muut"], changeObjects),
                        perustelut: R.path(
                          ["perustelut", "muut"],
                          changeObjects
                        )
                      }}
                      kohde={R.find(R.propEq("tunniste", "muut"))(kohteet)}
                      maaraykset={lupa.maaraykset}
                      muut={muut}
                      isReadOnly={true}
                      {..._props}
                    />
                  ) : null}
                </React.Fragment>
              )}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[4].title}
            />
          ) : null}

          {!!R.prop("taloudelliset", changeObjects) && (
            <YhteenvetoTaloudelliset
              changeObjects={changeObjects}
              onChangesUpdate={onChangesUpdate}
            />
          )}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};

YhteenvetoKooste.propTypes = {
  changeObjects: PropTypes.object,
  elykeskukset: PropTypes.array,
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  oivaperustelut: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  onChangesRemove: PropTypes.func,
  onChangesUpdate: PropTypes.func,
  opetuskielet: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default YhteenvetoKooste;
