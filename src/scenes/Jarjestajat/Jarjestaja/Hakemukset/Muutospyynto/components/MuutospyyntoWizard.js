import React, { useContext, useEffect, useCallback, useState } from "react";
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
import PropTypes from "prop-types";
import { LomakkeetProvider } from "../../../../../../context/lomakkeetContext";
import { MuutoshakemusContext } from "../../../../../../context/muutoshakemusContext";
import { saveMuutospyynto } from "../../../../../../services/muutoshakemus/actions";
import { createObjectToSave } from "../../../../../../services/muutoshakemus/utils/saving";
import { HAKEMUS_VIESTI } from "../modules/uusiHakemusFormConstants";
import { MuutoshakemusProvider } from "context/muutoshakemusContext";
import { MuutosperustelutProvider } from "../../../../../../context/muutosperustelutContext";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { toast } from "react-toastify";
import { injectIntl } from "react-intl";
import * as R from "ramda";

import "react-toastify/dist/ReactToastify.css";
import MuutospyyntoWizardPerustelut from "./MuutospyyntoWizardPerustelut";
import MuutospyyntoWizardTaloudelliset from "./MuutospyyntoWizardTaloudelliset";
import MuutospyyntoWizardYhteenveto from "./MuutospyyntoWizardYhteenveto";

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

const MuutospyyntoWizard = props => {
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
  const {
    intl: { formatMessage }
  } = props;
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
      valmentavatKoulutukset: {}
    },
    perustelut: {
      tutkinnot: {}
    },
    yhteenveto: {
      yleisettiedot: [],
      hakemuksenliitteet: []
    }
  });

  const notify = (title, options) => {
    toast.success(title, options);
  };

  const { state: muutoshakemus, dispatch: muutoshakemusDispatch } = useContext(
    MuutoshakemusContext
  );

  useEffect(() => {
    if (muutoshakemus.save && muutoshakemus.save.saved) {
      if (!props.match.params.uuid) {
        notify(
          "Muutospyyntö tallennettu! Voit jatkaa pian dokumentin muokkaamista.",
          {
            autoClose: 2000,
            position: toast.POSITION.TOP_LEFT,
            type: toast.TYPE.SUCCESS
          }
        );
        const page = parseInt(props.match.params.page, 10);
        const url = `/jarjestajat/${props.match.params.ytunnus}`;
        const uuid = muutoshakemus.save.data.data.uuid;
        let newurl = url + "/hakemukset-ja-paatokset/" + uuid + "/" + page;
        setTimeout(() => {
          props.history.replace(newurl);
        });
      } else {
        notify("Muutospyyntö tallennettu!", {
          autoClose: 2000,
          position: toast.POSITION.TOP_LEFT,
          type: toast.TYPE.SUCCESS
        });
      }
      muutoshakemus.save.saved = false; // TODO: Check if needs other state?
    }
  }, [muutoshakemus, props.history, props.match.params]);

  const handlePrev = pageNumber => {
    if (pageNumber !== 1) {
      props.history.push(String(pageNumber - 1));
    }
  };

  const handleNext = pageNumber => {
    if (pageNumber !== 4) {
      props.history.push(String(pageNumber + 1));
    }
  };

  useEffect(() => {
    setSteps([
      formatMessage(wizardMessages.pageTitle_1),
      formatMessage(wizardMessages.pageTitle_2),
      formatMessage(wizardMessages.pageTitle_3),
      formatMessage(wizardMessages.pageTitle_4)
    ]);
  }, [formatMessage]);

  useEffect(() => {
    console.info("Backend changes: ", props.backendChanges);
    setChangeObjects(props.backendChanges.changeObjects);
    setToimintaalueMuutokset(
      R.filter(
        R.pathEq(["kohde", "tunniste"], "toimintaalue"),
        props.backendChanges.source || []
      )
    );
  }, [props.backendChanges]);

  const getFiles = () => {
    // Gets all attachment data from changeObjects
    const allAttachments = (
      R.path(["yhteenveto", "yleisettiedot"], changeObjects) || []
    ).concat(
      (R.path(["yhteenveto", "yleisettiedot"], changeObjects) || []).concat(
        (
          R.path(["yhteenveto", "hakemuksenliitteet"], changeObjects) || []
        ).concat(R.path(["taloudelliset", "liitteet"], changeObjects) || [])
      )
    );
    // Returns only binary files
    let attachments;
    if (allAttachments) {
      attachments = R.map(obj => {
        if (obj.properties.attachments)
          return R.map(file => {
            return file;
          }, obj.properties.attachments);
        else return null;
      }, allAttachments);
      return attachments;
    } else {
      return null;
    }
  };

  const save = () => {
    const attachments = getFiles();
    if (props.match.params.uuid) {
      saveMuutospyynto(
        createObjectToSave(
          props.lupa,
          changeObjects,
          props.backendChanges.source,
          dataBySection,
          props.match.params.uuid,
          props.muutospyynnot.muutospyynto
        ),
        attachments
      )(muutoshakemusDispatch);
    } else {
      saveMuutospyynto(
        createObjectToSave(
          props.lupa,
          changeObjects,
          props.backendChanges.source,
          dataBySection
        ),
        attachments
      )(muutoshakemusDispatch);
    }
  };

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

  function handleOk() {
    props.history.push(`/jarjestajat/${props.match.params.ytunnus}`);
  }

  useEffect(() => {
    setPage(parseInt(props.match.params.page, 10));
  }, [props.match.params.page]);

  /**
   * The function is called by FormSection.
   */
  const onSectionChangesUpdate = useCallback(
    (id, changeObjects) => {
      if (id && changeObjects) {
        setChangeObjects(prevState => {
          const nextState = R.assocPath(
            R.split("_", id),
            changeObjects,
            prevState
          );
          console.info("Next changeObjects:", nextState);
          return nextState;
        });
      }
    },
    [setChangeObjects]
  );

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

  if (sessionStorage.getItem("role") !== ROLE_KAYTTAJA) {
    return (
      <MessageWrapper>
        <h3>{HAKEMUS_VIESTI.KIRJAUTUMINEN.FI}</h3>
      </MessageWrapper>
    );
  }

  return (
    <MuutoshakemusProvider>
      <FormDialog
        open={true}
        onClose={openCancelModal}
        maxWidth={state.isHelpVisible ? "xl" : "lg"}
        fullScreen={true}
        aria-labelledby="simple-dialog-title"
      >
        <DialogTitle id="customized-dialog-title" onClose={openCancelModal}>
          {formatMessage(wizardMessages.formTitle_new)}
        </DialogTitle>
        <DialogContent>
          <div className="lg:px-16 lg:py-4 max-w-6xl m-auto mb-10">
            <Stepper
              activeStep={page - 1}
              orientation={window.innerWidth >= 768 ? "horizontal" : "vertical"}
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
                lupa={props.lupa}
                changeObjects={changeObjects}
              >
                <MuutospyyntoWizardMuutokset
                  changeObjects={changeObjects}
                  kielet={props.kielet}
                  kohteet={props.kohteet.data}
                  koulutukset={props.koulutukset}
                  koulutusalat={props.koulutusalat}
                  koulutustyypit={props.koulutustyypit}
                  kunnat={props.kunnat}
                  maakuntakunnat={props.maakuntakunnat}
                  maakunnat={props.maakunnat}
                  lupa={props.lupa}
                  maaraystyypit={props.maaraystyypit}
                  muut={props.muut}
                  muutoshakemus={dataBySection}
                  onChangesUpdate={onSectionChangesUpdate}
                  onStateUpdate={onSectionStateUpdate}
                  setChangesBySection={setChangesBySection}
                  opiskelijavuodet={props.opiskelijavuodet}
                  toimintaalueMuutokset={toimintaalueMuutokset}
                />
              </WizardPage>
            )}
            {page === 2 && (
              <WizardPage
                pageNumber={2}
                onPrev={handlePrev}
                onNext={handleNext}
                onSave={save}
                lupa={props.lupa}
                changeObjects={changeObjects}
              >
                <MuutosperustelutProvider>
                  <LomakkeetProvider>
                    <MuutospyyntoWizardPerustelut
                      changeObjects={changeObjects}
                      kielet={props.kielet}
                      kohteet={props.kohteet.data}
                      koulutukset={props.koulutukset}
                      koulutusalat={props.koulutusalat}
                      koulutustyypit={props.koulutustyypit}
                      lupa={props.lupa}
                      maaraystyypit={props.maaraystyypit}
                      muut={props.muut}
                      muutoshakemus={dataBySection}
                      onChangesUpdate={onSectionChangesUpdate}
                      onStateUpdate={onSectionStateUpdate}
                    />
                  </LomakkeetProvider>
                </MuutosperustelutProvider>
              </WizardPage>
            )}
            {page === 3 && (
              <WizardPage
                pageNumber={3}
                onPrev={handlePrev}
                onNext={handleNext}
                onSave={save}
                lupa={props.lupa}
                muutoshakemus={dataBySection}
                changeObjects={changeObjects}
              >
                <MuutospyyntoWizardTaloudelliset
                  changeObjects={changeObjects}
                  kohteet={props.kohteet.data}
                  koulutukset={props.koulutukset}
                  koulutusalat={props.koulutusalat}
                  koulutustyypit={props.koulutustyypit}
                  lupa={props.lupa}
                  maaraystyypit={props.maaraystyypit}
                  muut={props.muut}
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
                lupa={props.lupa}
                muutoshakemus={dataBySection}
              >
                <MuutosperustelutProvider>
                  <LomakkeetProvider>
                    <MuutospyyntoWizardYhteenveto
                      changeObjects={changeObjects}
                      kielet={props.kielet}
                      kohteet={props.kohteet.data}
                      koulutukset={props.koulutukset}
                      koulutusalat={props.koulutusalat}
                      koulutustyypit={props.koulutustyypit}
                      lupa={props.lupa}
                      maaraystyypit={props.maaraystyypit}
                      muut={props.muut}
                      muutoshakemus={dataBySection}
                      onChangesUpdate={onSectionChangesUpdate}
                      onStateUpdate={onSectionStateUpdate}
                    />
                  </LomakkeetProvider>
                </MuutosperustelutProvider>
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
          <Button onClick={handleCancel} color="secondary" variant="outlined">
            {HAKEMUS_VIESTI.EI.FI}
          </Button>
        </DialogActions>
      </Dialog>
    </MuutoshakemusProvider>
  );
};

MuutospyyntoWizard.propTypes = {
  backendChanges: PropTypes.object,
  kielet: PropTypes.object,
  kohteet: PropTypes.object,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.object,
  koulutustyypit: PropTypes.object,
  kunnat: PropTypes.array,
  maakuntakunnat: PropTypes.object,
  maakunnat: PropTypes.array,
  maaraystyypit: PropTypes.array,
  muutospyynnot: PropTypes.object,
  opiskelijavuodet: PropTypes.object,
  muut: PropTypes.object,
  lupa: PropTypes.object
};

export default injectIntl(MuutospyyntoWizard);
