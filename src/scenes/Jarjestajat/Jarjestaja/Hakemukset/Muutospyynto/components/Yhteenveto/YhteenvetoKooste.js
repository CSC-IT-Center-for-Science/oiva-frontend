import React, { useContext, useEffect, useState } from "react";
import PerustelutKoulutukset from "../Perustelut/PerustelutKoulutukset";
import PerustelutMuut from "../Perustelut/PerustelutMuut";
import PerustelutOpiskelijavuodet from "../Perustelut/PerustelutOpiskelijavuodet";
import PerustelutOpetuskielet from "../Perustelut/PerustelutOpetuskielet";
import PerustelutTutkintokielet from "../Perustelut/PerustelutTutkintokielet";
import PerustelutTutkinnot from "../Perustelut/PerustelutTutkinnot";
import PerustelutLiitteet from "../Perustelut/PerustelutLiitteet";
import { LomakkeetContext } from "../../../../../../../context/lomakkeetContext";
import PropTypes from "prop-types";
import { injectIntl } from "react-intl";
import * as R from "ramda";
import PerustelutToimintaalue from "../Perustelut/PerustelutToimintaalue";
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
  maaraystyypit,
  muut,
  muutosperusteluList = [],
  lupa,
  lupaKohteet,
  muutoshakemus,
  onChangesUpdate,
  onStateUpdate,
  tutkinnot
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
      R.toUpper(intl.locale),
      true // isReadOnly
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

  return (
    <React.Fragment>
      {muutoshakemus && kohdetiedot && kohdetiedot.length ? (
        <React.Fragment>
          {muutosperusteluList &&
            (!!R.path(["tutkinnot"], changeObjects) ||
              !!R.path(["koulutukset"], changeObjects)) && (
              <FormSection
                code={1}
                id="yhteenveto_muutokset_perusteluineen"
                muutoshakemus={muutoshakemus}
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
                        isReadOnly={true}
                        kohde={R.find(
                          R.propEq("tunniste", "tutkinnotjakoulutukset")
                        )(kohteet)}
                        koulutukset={koulutukset}
                        lomakkeet={lomakkeet.perustelut.tutkinnot}
                        lupa={lupa}
                        lupaKohteet={lupaKohteet}
                        maaraystyyppi={maaraystyypitState.OIKEUS}
                        stateObject={R.path(["perustelut", "tutkinnot"])(
                          muutoshakemus
                        )}
                        tutkinnot={tutkinnot}
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
                    {/* Attachments for Tutkinnot ja koulutukset */}
                    <FormSection
                      id="perustelut_liitteet"
                      className="my-0"
                      render={_props => (
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
                          isReadOnly={true}
                          {..._props}
                        />
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
          {!!R.prop(["kielet"], changeObjects) ? (
            <FormSection
              code={2}
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
                      tutkinnot={tutkinnot}
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
          {!!R.prop(["toimintaalue"], changeObjects) ? (
            <FormSection
              code={3}
              id="perustelut_toimintaalue"
              muutoshakemus={muutoshakemus}
              render={_props => (
                <React.Fragment>
                  {!!R.path(["toimintaalue"], changeObjects) ? (
                    <PerustelutToimintaalue
                      changeObjects={{
                        toimintaalue: R.path(["toimintaalue"], changeObjects),
                        perustelut: R.path(
                          ["perustelut", "toimintaalue"],
                          changeObjects
                        )
                      }}
                      stateObjects={{
                        perustelut: R.path(["perustelut", "toimintaalue"])(
                          muutoshakemus
                        )
                      }}
                      isReadOnly={true}
                      {..._props}
                    />
                  ) : null}
                </React.Fragment>
              )}
              runOnStateUpdate={onStateUpdate}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[2].title}
            />
          ) : null}
          {!!R.prop(["opiskelijavuodet"], changeObjects) &&
          muutosperusteluList ? (
            <FormSection
              code={4}
              id="perustelut_opiskelijavuodet"
              muutoshakemus={muutoshakemus}
              render={_props => (
                <React.Fragment>
                  {!!R.path(["opiskelijavuodet"], changeObjects) ? (
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
                      isReadOnly={true}
                    />
                  ) : null}
                </React.Fragment>
              )}
              runOnStateUpdate={onStateUpdate}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[3].title}
            />
          ) : null}

          {!!R.prop(["muut"], changeObjects) ? (
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
                      maaraykset={lupa.maaraykset}
                      muut={muut}
                      stateObject={R.path(["perustelut", "muut"])(
                        muutoshakemus
                      )}
                      isReadOnly={true}
                      {..._props}
                    />
                  ) : null}
                </React.Fragment>
              )}
              runOnStateUpdate={onStateUpdate}
              runOnChanges={onChangesUpdate}
              title={kohdetiedot[4].title}
            />
          ) : null}

          {!!R.prop("taloudelliset", changeObjects) && (
            <YhteenvetoTaloudelliset
              changeObjects={changeObjects}
              muutoshakemus={muutoshakemus}
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
  muutoshakemus: PropTypes.object,
  onChangesUpdate: PropTypes.func,
  onStateUpdate: PropTypes.func,
  tutkinnot: PropTypes.object
};

export default injectIntl(YhteenvetoKooste);
