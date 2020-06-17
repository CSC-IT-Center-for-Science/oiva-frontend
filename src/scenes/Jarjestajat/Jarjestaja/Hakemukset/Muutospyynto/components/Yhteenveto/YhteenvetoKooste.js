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

const YhteenvetoKooste = ({
  changeObjects,
  kielet,
  kohteet = [],
  koulutukset,
  maaraystyypit = [],
  muut,
  muutosperusteluList = [],
  lupa,
  lupaKohteet,
  onChangesUpdate,
  opetuskielet,
  tutkinnot
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

  const isKoulutuksetChanges = useMemo(() => {
    return R.not(R.isEmpty(R.flatten(R.values(changeObjects.koulutukset))));
  }, [changeObjects.koulutukset]);

  return (
    <React.Fragment>
      {kohdetiedot && kohdetiedot.length ? (
        <React.Fragment>
          {muutosperusteluList &&
            (!R.isEmpty(changeObjects.tutkinnot) || isKoulutuksetChanges) && (
              <FormSection
                code={1}
                id="perustelut_tutkinnot"
                render={_props => (
                  <React.Fragment>
                    {!!R.prop("tutkinnot", changeObjects) && (
                      <PerustelutTutkinnot
                        changeObjects={{
                          tutkinnot: R.prop("tutkinnot", changeObjects),
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
                        muutosperustelut={muutosperusteluListSorted}
                        tutkinnot={tutkinnot}
                        isReadOnly={true}
                        {..._props}
                      />
                    )}
                    {!!R.path(["perustelut", "koulutukset"], changeObjects) ? (
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
                        kohde={R.find(
                          R.propEq("tunniste", "tutkinnotjakoulutukset")
                        )(kohteet)}
                        koulutukset={koulutukset}
                        maaraystyyppi={maaraystyypitState.OIKEUS}
                        isReadOnly={true}
                        {..._props}
                      />
                    ) : null}
                    {/* Attachments for Tutkinnot ja koulutukset */}
                    <FormSection
                      id="perustelut_liitteet"
                      className="my-0"
                      render={_props => (
                        <PerustelutLiitteet
                          changeObjects={{
                            perustelut: R.path(
                              ["perustelut", "liitteet"],
                              changeObjects
                            )
                          }}
                          isReadOnly={true}
                          {..._props}
                        />
                      )}
                      runOnChanges={onChangesUpdate}
                    />
                  </React.Fragment>
                )}
                runOnChanges={onChangesUpdate}
                title={kohdetiedot[0].title}
              />
            )}
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
                      kohde={R.find(
                        R.propEq("tunniste", "opetusjatutkintokieli")
                      )(kohteet)}
                      lupa={lupa}
                      maaraystyyppi={maaraystyypitState.OIKEUS}
                      opetuskielet={opetuskielet}
                      isReadOnly={true}
                      {..._props}
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
          {!R.isEmpty(changeObjects.opiskelijavuodet) && muutosperusteluList ? (
            <FormSection
              code={4}
              id="perustelut_opiskelijavuodet"
              render={_props => (
                <PerustelutOpiskelijavuodet
                  muutosperustelut={R.sortBy(R.prop("koodiArvo"))(
                    muutosperusteluList
                  )}
                  {..._props}
                  isReadOnly={true}
                />
              )}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[3].title}
            />
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
  kohteet: PropTypes.array,
  koulutukset: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  muutosperusteluList: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  opetuskielet: PropTypes.array,
  tutkinnot: PropTypes.object
};

export default YhteenvetoKooste;
