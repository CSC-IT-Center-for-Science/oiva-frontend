import React, { useContext, useEffect, useState } from "react";
import PerustelutKoulutukset from "../Perustelut/PerustelutKoulutukset";
// import PerustelutMuut from "./Perustelut/PerustelutMuut";
import PerustelutOpetuskielet from "../Perustelut/PerustelutOpetuskielet";
import PerustelutTutkintokielet from "../Perustelut/PerustelutTutkintokielet";
import YhteenvetoTutkinnot from "./YhteenvetoTutkinnot";
import { MuutosperustelutContext } from "../../../../../../../context/muutosperustelutContext";
import { LomakkeetContext } from "../../../../../../../context/lomakkeetContext";
import { fetchMuutosperustelut } from "../../../../../../../services/muutosperustelut/actions";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import * as R from "ramda";
// import PerustelutToimintaalue from "./Perustelut/PerustelutToimintaalue";
import { updateFormStructure } from "../../../../../../../services/lomakkeet/actions";
import {
  getAdditionFormStructure,
  getOsaamisalaFormStructure,
  getRemovalFormStructure
} from "../../../../../../../services/lomakkeet/perustelut/tutkinnot";
import FormSection from "../../../../../../../components/03-templates/FormSection";
import YhteenvetoTaloudelliset from "./YhteenvetoTaloudelliset";

const YhteenvetoKooste = ({
  changeObjects,
  intl,
  kielet,
  kohteet = [],
  koulutukset,
  koulutusalat,
  koulutustyypit,
  maaraystyypit,
  muut,
  lupa,
  muutoshakemus,
  onChangesUpdate,
  onStateUpdate
}) => {
  const [kohdetiedot, setKohdetiedot] = useState(null);
  const [maaraystyypitState, setMaaraystyypitState] = useState({});
  const {
    state: muutosperustelut,
    dispatch: muutosperustelutDispatch
  } = useContext(MuutosperustelutContext);
  const { state: lomakkeet, dispatch: lomakkeetDispatch } = useContext(
    LomakkeetContext
  );

  useEffect(() => {
    fetchMuutosperustelut()(muutosperustelutDispatch);
  }, [muutosperustelutDispatch]);

  useEffect(() => {
    /**
     * Let's get the structures of different tutkinto based reasoning forms and update the context.
     * These will be needed later.
     */
    if (muutosperustelut.data.length) {
      const additionFormStructure = getAdditionFormStructure(
        R.sortBy(R.prop("koodiArvo"))(muutosperustelut.muutosperusteluList),
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
    }
  }, [lomakkeetDispatch, muutosperustelut, intl.locale]);

  useEffect(() => {
    const kohdeTiedot = R.map(kohde => {
      return {
        title: R.path(["meta", "otsikko", [intl.locale]], kohde),
        code: R.find(R.propEq("tunniste", kohde.tunniste))(lupa.kohteet)
      };
    }, kohteet);
    setKohdetiedot(kohdeTiedot);
  }, [intl.locale, kohteet, lupa.kohteet]);

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

  return (
    <React.Fragment>
      {muutoshakemus && koulutustyypit && kohdetiedot && kohdetiedot.length ? (
        <div>
          {muutosperustelut.muutosperusteluList &&
            (!!R.path(["tutkinnot"], changeObjects) ||
              !!R.path(["koulutukset"], changeObjects)) && (
              <FormSection
                id="yhteenveto_muutokset_perusteluineen"
                muutoshakemus={muutoshakemus}
                render={_props => (
                  <React.Fragment>
                    <p>Tähän tarvittaessa ohjeteksti...</p>
                    {!!R.prop("tutkinnot", changeObjects) && (
                      <YhteenvetoTutkinnot
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
                        koulutukset={koulutukset}
                        koulutusalat={koulutusalat}
                        koulutustyypit={koulutustyypit.data}
                        lupa={lupa}
                        maaraystyyppi={maaraystyypitState.OIKEUS}
                        muutosperustelut={muutosperustelut}
                        lomakkeet={lomakkeet.perustelut.tutkinnot}
                        stateObjects={{
                          perustelut: R.path(["perustelut", "tutkinnot"])(
                            muutoshakemus
                          ),
                          yhteenveto: R.path(["yhteenveto", "tutkinnot"])(
                            muutoshakemus
                          )
                        }}
                        {..._props}
                      />
                    )}
                    {!!R.path(["perustelut", "koulutukset"], lomakkeet) ? (
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
                        lomakkeet={lomakkeet.perustelut.koulutukset}
                        stateObject={R.path([
                          "perustelut",
                          "koulutukset",
                          "valmentavatKoulutukset"
                        ])(muutoshakemus)}
                        isReadOnly={true}
                        {..._props}
                      />
                    ) : null}
                  </React.Fragment>
                )}
                runOnStateUpdate={onStateUpdate}
                runOnChanges={onChangesUpdate}
                title={"Muutokset perusteluineen"}
              />
            )}

          {!!R.prop(["kielet"], changeObjects) ? (
            <FormSection
              id="perustelut_kielet"
              muutoshakemus={muutoshakemus}
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
                      opetuskielet={kielet.opetuskielet}
                      stateObject={R.path([
                        "perustelut",
                        "kielet",
                        "opetuskielet"
                      ])(muutoshakemus)}
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
                        perustelut:
                          R.path(
                            ["perustelut", "kielet", "tutkintokielet"],
                            changeObjects
                          ) || []
                      }}
                      kohde={R.find(
                        R.propEq("tunniste", "opetusjatutkintokieli")
                      )(kohteet)}
                      koulutukset={koulutukset}
                      maaraystyyppi={maaraystyypitState.OIKEUS}
                      maaraykset={lupa.data.maaraykset}
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
                      isReadOnly={true}
                      {..._props}
                    />
                  ) : null}
                </React.Fragment>
              )}
              runOnStateUpdate={onStateUpdate}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[1].title}
            />
          ) : null}

          {/* {!!R.prop(["muut"], changeObjects) ? (
            <FormSection
              code={5}
              id="perustelut_muut"
              muutoshakemus={muutoshakemus}
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
                      maaraykset={lupa.data.maaraykset}
                      muut={muut}
                      stateObject={R.path(["perustelut", "muut"])(
                        muutoshakemus
                      )}
                      {..._props}
                    />
                  ) : null}
                </React.Fragment>
              )}
              runOnStateUpdate={onStateUpdate}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[4].title}
            />
          ) : null} */}

          {/* {!!changeObjects.toimintaalue.length ? (
            <PerustelutToimintaalue
              changes={changeObjects.toimintaalue}
              handleChanges={handleChanges}
              headingNumber={3}
              title={kohteet[2].title}
            ></PerustelutToimintaalue>
          ) : null}

          <Section code={4} title={kohteet[3].title}></Section>

          {!!R.keys(changeObjects.muut).length ? (
            <PerustelutMuut
              changes={changeObjects.muut}
              handleChanges={handleChanges}
              kohde={kohteet.muut}
              headingNumber={lupa.kohteet[5].headingNumber}
              maaraykset={lupa.data.maaraykset}
              muut={muut}
              title={kohteet[4].title}
            />
          ) : null} */}
          {!!R.prop("taloudelliset", changeObjects) && (
            <YhteenvetoTaloudelliset
              changeObjects={changeObjects}
              kohteet={kohteet.data}
              koulutukset={koulutukset}
              koulutusalat={koulutusalat}
              koulutustyypit={koulutustyypit}
              lupa={lupa}
              maaraystyypit={maaraystyypit}
              muutoshakemus={muutoshakemus}
              muut={muut}
              onStateUpdate={onStateUpdate}
              onChangesUpdate={onChangesUpdate}
              stateObjects={{
                taloudelliset: R.path(["taloudelliset"])(muutoshakemus),
                yhteenveto: R.path(["yhteenveto", "taloudelliset"])(
                  muutoshakemus
                )
              }}
            />
          )}
        </div>
      ) : null}
    </React.Fragment>
  );
};

YhteenvetoKooste.propTypes = {
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

export default injectIntl(YhteenvetoKooste);
