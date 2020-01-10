import React, {
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useState
} from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import WizardPage from "./WizardPage";
import DialogContent from "@material-ui/core/DialogContent";
import MuutospyyntoWizardMuutokset from "./MuutospyyntoWizardMuutokset";
import { withStyles } from "@material-ui/core/styles";
import { MessageWrapper } from "modules/elements";
import { ROLE_MUOKKAAJA, ROLE_NIMENKIRJOITTAJA } from "modules/constants";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import { LomakkeetProvider } from "../../../../../../context/lomakkeetContext";
import {
  saveAndSubmitMuutospyynto,
  saveMuutospyynto
} from "../../../../../../services/muutoshakemus/actions";
import { createObjectToSave } from "../../../../../../services/muutoshakemus/utils/saving";
import { HAKEMUS_VIESTI } from "../modules/uusiHakemusFormConstants";
import Dialog from "@material-ui/core/Dialog";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { MuutoshakemusContext } from "../../../../../../context/muutoshakemusContext";
import * as R from "ramda";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";
import MuutospyyntoWizardPerustelut from "./MuutospyyntoWizardPerustelut";
import MuutospyyntoWizardTaloudelliset from "./MuutospyyntoWizardTaloudelliset";
import MuutospyyntoWizardYhteenveto from "./MuutospyyntoWizardYhteenveto";

import {
  setAttachmentUuids,
  combineArrays
} from "../../../../../../utils/muutospyyntoUtil";
import { sortLanguages } from "../../../../../../utils/kieliUtil";
import {
  parseKoulutuksetAll,
  parseKoulutusalat
} from "../../../../../../utils/koulutusParser";
import { getMaakuntakunnatList } from "../../../../../../utils/toimialueUtil";
import Loading from "../../../../../../modules/Loading";
import { findObjectWithKey } from "../../../../../../utils/common";
import ConfirmDialog from "../../../../../../components/02-organisms/ConfirmDialog";
import DialogTitle from "../../../../../../components/02-organisms/DialogTitle";
import { useKielet } from "../../../../../../stores/kielet";
import { useOpetuskielet } from "../../../../../../stores/opetuskielet";
import { useKoulutusalat } from "../../../../../../stores/koulutusalat";
import { useTutkinnot } from "../../../../../../stores/tutkinnot";
import { useKoulutukset } from "../../../../../../stores/koulutukset";
import { mapObjIndexed, prop, sortBy } from "ramda";

const FormDialog = withStyles(() => ({
  paper: {
    background: "#f8faf8"
  }
}))(props => {
  return <Dialog {...props}>{props.children}</Dialog>;
});

/**
 * MuutospyyntoWizard is the tool to create a new application. It provides all
 * the needed fields and information for a user for filling out the form.
 * @param {Object} backendChanges - Backend known changes of the current application
 */
const MuutospyyntoWizard = ({
  backendChanges = {},
  elykeskukset = [],
  history = {},
  kohteet = [],
  koulutustyypit = [],
  kunnat = [],
  lupa = {},
  lupaKohteet = {},
  maakunnat = [],
  maakuntakunnat = [],
  maaraystyypit = [],
  match,
  muut = [],
  muutosperusteluList = [],
  muutospyynto = {},
  onNewDocSave,
  vankilat = []
}) => {
  const intl = useIntl();

  /**
   * We are going to create new objects based on these definitions.
   */
  const [kielet] = useKielet();
  const [opetuskielet] = useOpetuskielet();
  const [koulutusalat] = useKoulutusalat();
  const [tutkinnot] = useTutkinnot();
  const [koulutukset] = useKoulutukset();

  /**
   * Muutoshakemus context is used only for some actions so we might get rid of
   * this at some point. Form data is saved in to dataBySection state.
   */
  const { state: muutoshakemus, dispatch: muutoshakemusDispatch } = useContext(
    MuutoshakemusContext
  );

  /**
   * Basic data for the wizard is created here. The following functions modify
   * the backend data for the wizard. E.g. the most used languages can be
   * moved to the top of the languages list.
   *
   * Some wizard related data is fine as it is and doesn't need to be modified.
   * That kind of data is passed to this wizard using properties.
   */
  const kieletAndOpetuskielet = useMemo(() => {
    return {
      kielet: sortLanguages(kielet.data, R.toUpper(intl.locale)),
      opetuskielet: opetuskielet.data
    };
  }, [kielet.data, opetuskielet.data, intl.locale]);

  const parsedKoulutusalat = useMemo(() => {
    return parseKoulutusalat(koulutusalat.data);
  }, [koulutusalat.data]);

  const parsedTutkinnot = useMemo(() => {
    return parseKoulutuksetAll(
      tutkinnot.data || [],
      parsedKoulutusalat || [],
      koulutustyypit || []
    );
  }, [tutkinnot.data, parsedKoulutusalat, koulutustyypit]);

  const parsedKoulutukset = useMemo(() => {
    return {
      muut: mapObjIndexed((num, key, obj) => {
        return sortBy(prop("koodiArvo"), obj[key].data);
      }, koulutukset.muut),
      poikkeukset: mapObjIndexed((num, key, obj) => {
        return obj[key].data;
      }, koulutukset.poikkeukset)
    };
  }, [koulutukset]);

  const maakuntakunnatList = useMemo(() => {
    return getMaakuntakunnatList(maakuntakunnat, R.toUpper(intl.locale));
  }, [intl.locale, maakuntakunnat]);

  /**
   * The wizard is splitted in to multiple sections. dataBySection contains
   * all the basic settings of the sections. It doesn't contain any changes
   * that user makes to the form.
   */
  const [dataBySection, setDataBySection] = useState({
    kielet: {},
    koulutukset: {},
    muut: {},
    opiskelijavuodet: [],
    toimintaalue: {},
    tutkinnot: {},
    perustelut: {
      koulutukset: {},
      tutkinnot: {}
    }
  });

  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [state] = useState({
    isHelpVisible: false
  });
  const [steps, setSteps] = useState([]);
  const [page, setPage] = useState(1);
  /**
   * ChangeObjects contains all changes of the form by section.
   */
  const [changeObjects, setChangeObjects] = useState({
    kielet: {
      opetuskielet: [],
      tutkintokielet: []
    },
    koulutukset: {
      ammatilliseenTehtavaanValmistavatKoulutukset: {},
      valmentavatKoulutukset: []
    },
    perustelut: {
      liitteet: {},
      toimintaalue: {},
      tutkinnot: {}
    },
    taloudelliset: {
      yleisettiedot: {},
      investoinnit: {},
      tilinpaatostiedot: {},
      liitteet: {}
    },
    yhteenveto: {
      yleisettiedot: [],
      hakemuksenliitteet: []
    }
  });

  /**
   * The function is mainly called by FormSection.
   */
  const onSectionChangesUpdate = useCallback(
    (id, changeObjects) => {
      if (id && changeObjects) {
        setChangeObjects(prevState => {
          const nextState =
            changeObjects.length > 0
              ? R.assocPath(R.split("_", id), changeObjects, prevState)
              : R.dissocPath(R.split("_", id), prevState);
          console.info("Next changeObjects:", id, nextState);
          return nextState;
        });
      }
    },
    [setChangeObjects]
  );

  const handlePrev = useCallback(
    pageNumber => {
      if (pageNumber !== 1) {
        history.push(String(pageNumber - 1));
      }
    },
    [history]
  );

  const handleNext = useCallback(
    pageNumber => {
      if (pageNumber !== 4) {
        history.push(String(pageNumber + 1));
      }
    },
    [history]
  );

  const showPreviewFile = url => {
    let a = document.createElement("a");
    a.setAttribute("type", "hidden");
    a.href = url;
    a.download = true;
    a.click();
    a.remove();
  };

  useEffect(() => {
    if (R.path(["save", "hasErrored"], muutoshakemus) === true) {
      toast.error("Virhe muutospyynnön käsittelyssä", {
        autoClose: 2000,
        position: toast.POSITION.TOP_LEFT
      });
    } else if (R.path(["save", "saved"], muutoshakemus) === true) {
      toast.success("Muutospyyntö tallennettu!", {
        autoClose: 2000,
        position: toast.POSITION.TOP_LEFT
      });
    }
  }, [muutoshakemus]);

  useEffect(() => {
    if (muutoshakemus.save && muutoshakemus.save.saved) {
      if (muutoshakemus.save.triggerPreview) {
        showPreviewFile(
          `/api/pdf/esikatsele/muutospyynto/${muutoshakemus.save.data.data.uuid}`
        );
      }
      if (!match.params.uuid) {
        onNewDocSave(muutoshakemus);
      } else {
        const setAttachments = R.curry(setAttachmentUuids)(
          R.path(["save", "data", "data", "liitteet"], muutoshakemus)
        );

        const selectionChanged = (path, key) => {
          const objs = R.path(path, changeObjects);
          if (objs) {
            onSectionChangesUpdate(key, setAttachments(objs));
          }
        };

        selectionChanged(["perustelut", "liitteet"], "perustelut_liitteet");
        selectionChanged(
          ["taloudelliset", "liitteet"],
          "taloudelliset_liitteet"
        );
        selectionChanged(
          ["yhteenveto", "hakemuksenliitteet"],
          "yhteenveto_hakemuksenliitteet"
        );
        selectionChanged(
          ["yhteenveto", "yleisetliitteet"],
          "yhteenveto_yleisettiedot"
        );
      }
      muutoshakemus.save.saved = false; // TODO: Check if needs other state?
    }
  }, [
    muutoshakemus,
    onSectionChangesUpdate,
    history,
    lupa,
    match.params,
    onNewDocSave,
    changeObjects
    // cannot add these, as some might be empty
    // changeObjects.perustelut,
    // changeObjects.taloudelliset,
    // changeObjects.yhteenveto
  ]);

  useEffect(() => {
    setSteps([
      intl.formatMessage(wizardMessages.pageTitle_1),
      intl.formatMessage(wizardMessages.pageTitle_2),
      intl.formatMessage(wizardMessages.pageTitle_3),
      intl.formatMessage(wizardMessages.pageTitle_4)
    ]);
  }, [intl]);

  useEffect(() => {
    console.info("Backend changes: ", backendChanges);
    setChangeObjects(backendChanges.changeObjects);
  }, [backendChanges]);

  const getFiles = useCallback(() => {
    // Gets all attachment data from changeObjects
    const files = findObjectWithKey(changeObjects, "file");
    const allAttachments = combineArrays([
      R.path(["yhteenveto", "yleisettiedot"], changeObjects) || [],
      R.path(["yhteenveto", "hakemuksenliitteet"], changeObjects) || [],
      R.path(["taloudelliset", "liitteet"], changeObjects) || [],
      R.path(["perustelut", "liitteet"], changeObjects) || [],
      R.flatten(
        R.path(
          ["perustelut", "koulutukset", "kuljettajakoulutukset"],
          changeObjects
        ) || []
      ) || []
    ]);
    // Returns only attachments
    let attachments = [];
    if (allAttachments) {
      R.forEachObjIndexed(obj => {
        if (obj.properties.attachments) {
          R.forEachObjIndexed(file => {
            attachments.push(file);
          }, obj.properties.attachments);
        }
      }, allAttachments);
      console.info(attachments, files);
    }
    return R.concat(attachments, files);
  }, [changeObjects]);

  const save = useCallback(
    options => {
      let saveFunction = saveMuutospyynto;
      if (options.setAsSent === true) {
        saveFunction = saveAndSubmitMuutospyynto;
      }
      const attachments = getFiles();
      saveFunction(
        createObjectToSave(
          lupa,
          changeObjects,
          backendChanges.source,
          dataBySection,
          match.params.uuid
        ),
        attachments,
        options.triggerPreview
      )(muutoshakemusDispatch);
    },
    [
      changeObjects,
      dataBySection,
      getFiles,
      muutoshakemusDispatch,
      backendChanges.source,
      lupa,
      match.params.uuid
    ]
  );

  const setChangesBySection = useCallback(
    (sectionId, changes) => {
      setChangesBySection(sectionId, changes)(muutoshakemusDispatch);
    },
    [muutoshakemusDispatch]
  );

  const openCancelModal = () => {
    setIsConfirmDialogVisible(true);
  };

  function handleCancel() {
    setIsConfirmDialogVisible(false);
  }

  /**
   * User is redirected to the following path when the form is closed.
   */
  const closeWizard = useCallback(() => {
    return history.push(
      `/jarjestajat/${match.params.ytunnus}/jarjestamislupa-asia`
    );
  }, [history, match.params.ytunnus]);

  useEffect(() => {
    setPage(parseInt(match.params.page, 10));
  }, [match.params.page]);

  useEffect(() => {
    if (muutoshakemus.readyToCloseWizard === true) {
      setTimeout(closeWizard, 2000);
    }
  }, [muutoshakemus.readyToCloseWizard, closeWizard]);

  /** The function is called by sections with different payloads. */
  const onSectionStateUpdate = useCallback(
    (id, state) => {
      if (id && state) {
        setDataBySection(prevData => {
          const nextData = R.assocPath(R.split("_", id), state, prevData);
          console.info("Next state objects: ", nextData);
          return nextData;
        });
      }
    },
    [setDataBySection]
  );

  const view = useMemo(() => {
    let jsx = <React.Fragment></React.Fragment>;
    if (!sessionStorage.getItem("role")) {
      return (
        <MessageWrapper>
          <h3>{intl.formatMessage(wizardMessages.notSignedIn)}</h3>
        </MessageWrapper>
      );
    } else if (
      sessionStorage.getItem("role") !== ROLE_MUOKKAAJA &&
      sessionStorage.getItem("role") !== ROLE_NIMENKIRJOITTAJA
    ) {
      return (
        <MessageWrapper>
          <h3>{intl.formatMessage(wizardMessages.noRights)}</h3>
        </MessageWrapper>
      );
    } else if (
      parsedKoulutukset &&
      kieletAndOpetuskielet &&
      parsedTutkinnot &&
      maakuntakunnatList
    ) {
      jsx = (
        <React.Fragment>
          <FormDialog
            open={true}
            onClose={openCancelModal}
            maxWidth={state.isHelpVisible ? "xl" : "lg"}
            fullScreen={true}
            aria-labelledby="simple-dialog-title">
            <DialogTitle id="customized-dialog-title" onClose={openCancelModal}>
              {intl.formatMessage(wizardMessages.formTitle_new)}
            </DialogTitle>
            <DialogContent>
              <div className="lg:px-16 lg:py-4 max-w-6xl m-auto mb-10">
                <Stepper
                  activeStep={page - 1}
                  orientation={
                    window.innerWidth >= 768 ? "horizontal" : "vertical"
                  }
                  style={{ backgroundColor: "transparent" }}>
                  {steps.map(label => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                      <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                {page === 1 && (
                  <WizardPage
                    pageNumber={1}
                    onNext={handleNext}
                    onSave={save}
                    lupa={lupa}
                    changeObjects={changeObjects}>
                    <MuutospyyntoWizardMuutokset
                      changeObjects={changeObjects}
                      kielet={kieletAndOpetuskielet}
                      kohteet={kohteet}
                      koulutukset={parsedKoulutukset}
                      kunnat={kunnat}
                      maakuntakunnatList={maakuntakunnatList}
                      maakunnat={maakunnat}
                      lupa={lupa}
                      lupaKohteet={lupaKohteet}
                      maaraystyypit={maaraystyypit}
                      muut={muut}
                      muutoshakemus={dataBySection}
                      onChangesUpdate={onSectionChangesUpdate}
                      onStateUpdate={onSectionStateUpdate}
                      setChangesBySection={setChangesBySection}
                      tutkinnot={parsedTutkinnot}
                    />
                  </WizardPage>
                )}
                {page === 2 && (
                  <WizardPage
                    pageNumber={2}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onSave={save}
                    lupa={lupa}
                    changeObjects={changeObjects}>
                    <LomakkeetProvider>
                      <MuutospyyntoWizardPerustelut
                        changeObjects={changeObjects}
                        elykeskukset={elykeskukset}
                        kielet={kieletAndOpetuskielet}
                        kohteet={kohteet}
                        koulutukset={parsedKoulutukset}
                        lupa={lupa}
                        lupaKohteet={lupaKohteet}
                        maaraystyypit={maaraystyypit}
                        muut={muut}
                        muutoshakemus={dataBySection}
                        muutosperusteluList={muutosperusteluList}
                        onChangesUpdate={onSectionChangesUpdate}
                        onStateUpdate={onSectionStateUpdate}
                        tutkinnot={parsedTutkinnot}
                        vankilat={vankilat}
                      />
                    </LomakkeetProvider>
                  </WizardPage>
                )}
                {page === 3 && (
                  <WizardPage
                    pageNumber={3}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onSave={save}
                    lupa={lupa}
                    muutoshakemus={dataBySection}
                    changeObjects={changeObjects}>
                    <MuutospyyntoWizardTaloudelliset
                      changeObjects={changeObjects}
                      muutoshakemus={dataBySection}
                      onChangesUpdate={onSectionChangesUpdate}
                      onStateUpdate={onSectionStateUpdate}
                    />
                  </WizardPage>
                )}
                {page === 4 && (
                  <WizardPage
                    pageNumber={4}
                    onPrev={handlePrev}
                    onSave={save}
                    lupa={lupa}
                    muutoshakemus={dataBySection}>
                    <LomakkeetProvider>
                      <MuutospyyntoWizardYhteenveto
                        changeObjects={changeObjects}
                        kielet={kieletAndOpetuskielet}
                        kohteet={kohteet}
                        koulutukset={parsedKoulutukset}
                        lupa={lupa}
                        lupaKohteet={lupaKohteet}
                        maaraystyypit={maaraystyypit}
                        muut={muut}
                        muutoshakemus={dataBySection}
                        muutosperusteluList={muutosperusteluList}
                        onChangesUpdate={onSectionChangesUpdate}
                        onStateUpdate={onSectionStateUpdate}
                        tutkinnot={parsedTutkinnot}
                      />
                    </LomakkeetProvider>
                  </WizardPage>
                )}
              </div>
            </DialogContent>
          </FormDialog>
          <ConfirmDialog
            isConfirmDialogVisible={isConfirmDialogVisible}
            title={"Poistutaanko?"}
            content={HAKEMUS_VIESTI.VARMISTUS.FI}
            handleOk={closeWizard}
            handleCancel={handleCancel}
          />
        </React.Fragment>
      );
    } else {
      jsx = <Loading />;
    }
    return jsx;
  }, [
    changeObjects,
    dataBySection,
    elykeskukset,
    handleNext,
    closeWizard,
    handlePrev,
    intl,
    isConfirmDialogVisible,
    kieletAndOpetuskielet,
    kohteet,
    parsedKoulutukset,
    kunnat,
    lupa,
    lupaKohteet,
    maakunnat,
    maakuntakunnatList,
    maaraystyypit,
    muut,
    muutosperusteluList,
    onSectionChangesUpdate,
    onSectionStateUpdate,
    page,
    save,
    setChangesBySection,
    state.isHelpVisible,
    steps,
    parsedTutkinnot,
    vankilat
  ]);

  return view;
};

MuutospyyntoWizard.propTypes = {
  backendChanges: PropTypes.object,
  elykeskukset: PropTypes.array,
  history: PropTypes.object,
  koulutustyypit: PropTypes.array,
  kunnat: PropTypes.array,
  lupa: PropTypes.object,
  lupKohteet: PropTypes.object,
  maakunnat: PropTypes.array,
  maakuntakunnat: PropTypes.array,
  maaraystyypit: PropTypes.array,
  match: PropTypes.object,
  muut: PropTypes.array,
  muutosperusteluList: PropTypes.array,
  muutospyynto: PropTypes.object,
  onNewDocSave: PropTypes.func,
  vankilat: PropTypes.array
};

export default MuutospyyntoWizard;
