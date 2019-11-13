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
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { MessageWrapper } from "modules/elements";
import { ROLE_KAYTTAJA } from "modules/constants";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import { LomakkeetProvider } from "../../../../../../context/lomakkeetContext";
import { saveMuutospyynto } from "../../../../../../services/muutoshakemus/actions";
import { createObjectToSave } from "../../../../../../services/muutoshakemus/utils/saving";
import { HAKEMUS_VIESTI } from "../modules/uusiHakemusFormConstants";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { toast } from "react-toastify";
import { injectIntl } from "react-intl";
import { BackendContext } from "../../../../../../context/backendContext";
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

const DialogTitle = withStyles(theme => ({
  root: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(2),
    background: "#c7dcc3"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

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
  intl,
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
  /**
   * fromBackend contains raw data from the backend. Some of the data is usable
   * as it is but some must be slightly modified for the wizard's needs.
   */
  const { state: fromBackend } = useContext(BackendContext);

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
  const kielet = useMemo(() => {
    return {
      kielet: sortLanguages(fromBackend.kielet.raw, R.toUpper(intl.locale)),
      opetuskielet: fromBackend.opetuskielet.raw
    };
  }, [fromBackend.kielet, fromBackend.opetuskielet, intl.locale]);

  const koulutusalat = useMemo(() => {
    return parseKoulutusalat(fromBackend.koulutusalat.raw);
  }, [fromBackend.koulutusalat]);

  const tutkinnot = useMemo(() => {
    return parseKoulutuksetAll(
      R.prop("raw", fromBackend.tutkinnot) || [],
      koulutusalat || [],
      koulutustyypit || []
    );
  }, [fromBackend.tutkinnot, koulutusalat, koulutustyypit]);

  const koulutukset = useMemo(() => {
    return {
      muut: R.map(
        R.compose(
          R.sortBy(R.prop("koodiArvo")),
          R.prop("raw")
        ),
        fromBackend.koulutukset.muut
      ),
      poikkeukset: R.map(R.prop("raw"), fromBackend.koulutukset.poikkeukset)
    };
  }, [fromBackend.koulutukset]);

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

  const [toimintaalueMuutokset, setToimintaalueMuutokset] = useState([]);
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
      tutkinnot: {},
      liitteet: {}
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

  const notify = (title, options) => {
    toast.success(title, options);
  };

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

  useEffect(() => {
    if (muutoshakemus.save && muutoshakemus.save.saved) {
      if (!match.params.uuid) {
        onNewDocSave(muutoshakemus);
      } else {
        notify("Muutospyyntö tallennettu!", {
          autoClose: 2000,
          position: toast.POSITION.TOP_LEFT,
          type: toast.TYPE.SUCCESS
        });

        if (changeObjects.perustelut) {
          if (changeObjects.perustelut.liitteet) {
            onSectionChangesUpdate(
              "perustelut_liitteet",
              setAttachmentUuids(
                changeObjects.perustelut.liitteet,
                muutoshakemus.save.data.data
              )
            );
          }
        }
        if (
          changeObjects.taloudelliset &&
          changeObjects.taloudelliset.liitteet
        ) {
          onSectionChangesUpdate(
            "taloudelliset_liitteet",
            setAttachmentUuids(
              changeObjects.taloudelliset.liitteet,
              muutoshakemus.save.data.data
            )
          );
        }
        if (changeObjects.yhteenveto) {
          if (changeObjects.yhteenveto.hakemuksenliitteet) {
            onSectionChangesUpdate(
              "yhteenveto_hakemuksenliitteet",
              setAttachmentUuids(
                changeObjects.yhteenveto.hakemuksenliitteet,
                muutoshakemus.save.data.data
              )
            );
          }
          if (changeObjects.yhteenveto.yleisettiedot) {
            onSectionChangesUpdate(
              "yhteenveto_yleisettiedot",
              setAttachmentUuids(
                changeObjects.yhteenveto.yleisettiedot,
                muutoshakemus.save.data.data
              )
            );
          }
        }
      }
      muutoshakemus.save.saved = false; // TODO: Check if needs other state?
    }
  }, [
    muutoshakemus,
    onSectionChangesUpdate,
    history,
    lupa,
    match.params,
    onNewDocSave
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
    setToimintaalueMuutokset(
      R.filter(
        R.pathEq(["kohde", "tunniste"], "toimintaalue"),
        backendChanges.source || []
      )
    );
  }, [backendChanges]);

  const getFiles = useCallback(() => {
    // Gets all attachment data from changeObjects
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
      return attachments;
    }
  }, [changeObjects]);

  const save = useCallback(() => {
    const attachments = getFiles();

    if (match.params.uuid) {
      saveMuutospyynto(
        createObjectToSave(
          lupa,
          changeObjects,
          backendChanges.source,
          dataBySection,
          match.params.uuid,
          muutospyynto
        ),
        attachments
      )(muutoshakemusDispatch);
    } else {
      saveMuutospyynto(
        createObjectToSave(
          lupa,
          changeObjects,
          backendChanges.source,
          dataBySection
        ),
        attachments
      )(muutoshakemusDispatch);
    }
  }, [
    changeObjects,
    dataBySection,
    getFiles,
    muutoshakemusDispatch,
    backendChanges.source,
    lupa,
    match.params.uuid,
    muutospyynto
  ]);

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
  const handleOk = useCallback(() => {
    return history.push(
      `/jarjestajat/${match.params.ytunnus}/jarjestamislupa-asia`
    );
  }, [history, match.params.ytunnus]);

  useEffect(() => {
    setPage(parseInt(match.params.page, 10));
  }, [match.params.page]);

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
    if (kielet && tutkinnot && maakuntakunnatList) {
      jsx = (
        <React.Fragment>
          <FormDialog
            open={true}
            onClose={openCancelModal}
            maxWidth={state.isHelpVisible ? "xl" : "lg"}
            fullScreen={true}
            aria-labelledby="simple-dialog-title"
          >
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
                  style={{ backgroundColor: "transparent" }}
                >
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
                    changeObjects={changeObjects}
                  >
                    <MuutospyyntoWizardMuutokset
                      changeObjects={changeObjects}
                      kielet={kielet}
                      kohteet={kohteet}
                      koulutukset={koulutukset}
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
                      toimintaalueMuutokset={toimintaalueMuutokset}
                      tutkinnot={tutkinnot}
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
                    changeObjects={changeObjects}
                  >
                    <LomakkeetProvider>
                      <MuutospyyntoWizardPerustelut
                        changeObjects={changeObjects}
                        elykeskukset={elykeskukset}
                        kielet={kielet}
                        kohteet={kohteet}
                        koulutukset={koulutukset}
                        lupa={lupa}
                        lupaKohteet={lupaKohteet}
                        maaraystyypit={maaraystyypit}
                        muut={muut}
                        muutoshakemus={dataBySection}
                        muutosperusteluList={muutosperusteluList}
                        onChangesUpdate={onSectionChangesUpdate}
                        onStateUpdate={onSectionStateUpdate}
                        tutkinnot={tutkinnot}
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
                    changeObjects={changeObjects}
                  >
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
                    muutoshakemus={dataBySection}
                  >
                    <LomakkeetProvider>
                      <MuutospyyntoWizardYhteenveto
                        changeObjects={changeObjects}
                        kielet={kielet}
                        kohteet={kohteet}
                        koulutukset={koulutukset}
                        lupa={lupa}
                        lupaKohteet={lupaKohteet}
                        maaraystyypit={maaraystyypit}
                        muut={muut}
                        muutoshakemus={dataBySection}
                        muutosperusteluList={muutosperusteluList}
                        onChangesUpdate={onSectionChangesUpdate}
                        onStateUpdate={onSectionStateUpdate}
                        tutkinnot={tutkinnot}
                      />
                    </LomakkeetProvider>
                  </WizardPage>
                )}
              </div>
            </DialogContent>
          </FormDialog>
          <Dialog
            open={isConfirmDialogVisible}
            fullWidth={true}
            aria-labelledby="confirm-dialog"
            maxWidth="sm"
          >
            <DialogTitle id="confirm-dialog">Poistutaanko?</DialogTitle>
            <DialogContent>{HAKEMUS_VIESTI.VARMISTUS.FI}</DialogContent>
            <DialogActions>
              <Button onClick={handleOk} color="primary" variant="contained">
                {HAKEMUS_VIESTI.KYLLA.FI}
              </Button>
              <Button
                onClick={handleCancel}
                color="secondary"
                variant="outlined"
              >
                {HAKEMUS_VIESTI.EI.FI}
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      );
    } else if (sessionStorage.getItem("role") !== ROLE_KAYTTAJA) {
      return (
        <MessageWrapper>
          <h3>{HAKEMUS_VIESTI.KIRJAUTUMINEN.FI}</h3>
        </MessageWrapper>
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
    handleOk,
    handlePrev,
    intl,
    isConfirmDialogVisible,
    kielet,
    kohteet,
    koulutukset,
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
    toimintaalueMuutokset,
    tutkinnot,
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

export default injectIntl(MuutospyyntoWizard);
