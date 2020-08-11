import React, {
  useEffect,
  useCallback,
  useMemo,
  useState,
  useRef
} from "react";
import StepperNavigation from "okm-frontend-components/dist/components/01-molecules/Stepper";
import WizardPage from "./WizardPage";
import DialogContent from "@material-ui/core/DialogContent";
import MuutospyyntoWizardMuutokset from "./MuutospyyntoWizardMuutokset";
import { withStyles } from "@material-ui/core/styles";
import { MessageWrapper } from "modules/elements";
import { ROLE_MUOKKAAJA, ROLE_NIMENKIRJOITTAJA } from "modules/constants";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import { createObjectToSave } from "../../../../../../services/muutoshakemus/utils/saving";
import Dialog from "@material-ui/core/Dialog";
import { useIntl } from "react-intl";
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
import { findObjectWithKey } from "../../../../../../utils/common";
import ConfirmDialog from "okm-frontend-components/dist/components/02-organisms/ConfirmDialog";
import DialogTitle from "okm-frontend-components/dist/components/02-organisms/DialogTitle";
import ProcedureHandler from "../../../../../../components/02-organisms/procedureHandler";
import { createMuutospyyntoOutput } from "../../../../../../services/muutoshakemus/utils/common";
import { useMuutospyynto } from "../../../../../../stores/muutospyynto";
import common from "../../../../../../i18n/definitions/common";
import { useParams } from "react-router-dom";

const isDebugOn = process.env.REACT_APP_DEBUG === "true";

const DialogContentWithStyles = withStyles(() => ({
  root: {
    scrollBehavior: "smooth"
  }
}))(props => {
  return <DialogContent {...props}>{props.children}</DialogContent>;
});

const FormDialog = withStyles(() => ({
  paper: {
    background: "#f8faf8",
    marginLeft: isDebugOn ? "33%" : 0,
    width: isDebugOn ? "66%" : "100%"
  }
}))(props => {
  return <Dialog {...props}>{props.children}</Dialog>;
});

const defaultProps = {
  elykeskukset: [],
  initialChangeObjects: {},
  kielet: [],
  kohteet: [],
  koulutukset: {},
  koulutusalat: [],
  koulutustyypit: [],
  kunnat: [],
  lupa: {},
  lupaKohteet: {},
  maakunnat: [],
  maakuntakunnat: [],
  maaraystyypit: [],
  muut: [],
  opetuskielet: [],
  tutkinnot: [],
  vankilat: []
};

/**
 * MuutospyyntoWizard is the tool to create a new application. It provides all
 * the needed fields and information for a user for filling out the form.
 */
const MuutospyyntoWizard = ({
  initialChangeObjects = defaultProps.initialChangeObjects,
  elykeskukset = defaultProps.elykeskukset,
  history,
  kielet = defaultProps.kielet,
  kohteet = defaultProps.kohteet,
  koulutukset = defaultProps.koulutukset,
  koulutusalat = defaultProps.koulutusalat,
  koulutustyypit = defaultProps.koulutustyypit,
  kunnat = defaultProps.kunnat,
  lupa = defaultProps.lupa,
  lupaKohteet = defaultProps.lupaKohteet,
  maakunnat = defaultProps.maakunnat,
  maakuntakunnat = defaultProps.maakuntakunnat,
  maaraystyypit = defaultProps.maaraystyypit,
  match,
  muut = defaultProps.muut,
  oivaperustelut,
  onNewDocSave,
  opetuskielet = defaultProps.opetuskielet,
  tutkinnot = defaultProps.tutkinnot,
  vankilat = defaultProps.vankilat
}) => {
  const intl = useIntl();
  const params = useParams();
  const [isSavingEnabled, setIsSavingEnabled] = useState(false);

  let { uuid } = params;

  /**
   * Visits per page is used for showing or hiding validation errors of the
   * current page.
   */
  const [visitsPerPage, setVisitsPerPage] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0
  });

  const [changeObjects, setChangeObjects] = useState(initialChangeObjects);
  const [, muutospyyntoActions] = useMuutospyynto();
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [state] = useState({
    isHelpVisible: false
  });
  const [steps, setSteps] = useState([]);

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

  const handleStep = useCallback(
    pageNumber => {
      history.push(String(pageNumber));
    },
    [history]
  );

  const onChangeObjectsUpdate = useCallback(
    ({ anchor, changes: changeObjects }) => {
      if (anchor && changeObjects) {
        setChangeObjects(R.assocPath(R.split("_", anchor), changeObjects));
      }
    },
    []
  );

  const onChangesRemove = useCallback(
    anchor => {
      return onChangeObjectsUpdate({ anchor, changes: [] });
    },
    [onChangeObjectsUpdate]
  );

  useEffect(() => {
    // TODO: add isCompleted, isFailed for validation
    setSteps([
      {
        title: intl.formatMessage(wizardMessages.pageTitle_1)
      },
      {
        title: intl.formatMessage(wizardMessages.pageTitle_2)
      },
      {
        title: intl.formatMessage(wizardMessages.pageTitle_3)
      },
      {
        title: intl.formatMessage(wizardMessages.pageTitle_4)
      }
    ]);
    return function cancel() {
      muutospyyntoActions.reset();
    };
  }, [intl, muutospyyntoActions]);

  const getFiles = useCallback(() => {
    // Gets all attachment data from changeObjects
    const files = findObjectWithKey(changeObjects, "file");
    const allAttachments = combineArrays([
      R.path(["yhteenveto", "yleisettiedot"], changeObjects) || [],
      R.path(["yhteenveto", "hakemuksenLiitteet"], changeObjects) || [],
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
    }
    return R.concat(attachments, files);
  }, [changeObjects]);

  const prevCosRef = useRef(changeObjects);

  useEffect(() => {
    // If user has made changes on the form the save action must be available.
    setIsSavingEnabled(!R.equals(prevCosRef.current, changeObjects));
  }, [changeObjects]);

  /**
   * Opens the preview.
   * @param {object} formData
   */
  const onPreview = useCallback(
    async formData => {
      const procedureHandler = new ProcedureHandler(intl.formatMessage);
      /**
       * Let's save the form without notification. Notification about saving isn't
       * needed when we're going to show a notification related to the preview.
       */
      const outputs = await procedureHandler.run(
        "muutospyynto.tallennus.tallenna",
        [formData, false] // false = Notification of save success won't be shown.
      );
      const muutospyynto =
        outputs.muutospyynto.tallennus.tallenna.output.result;
      // Let's get the path of preview (PDF) document and download the file.
      const path = await muutospyyntoActions.getDownloadPath(muutospyynto.uuid);
      if (path) {
        muutospyyntoActions.download(path, intl.formatMessage);
      }
      return muutospyynto;
    },
    [intl.formatMessage, muutospyyntoActions]
  );

  /**
   * Saves the form.
   * @param {object} formData
   * @returns {object} - Muutospyyntö
   */
  const onSave = useCallback(
    async formData => {
      const procedureHandler = new ProcedureHandler(intl.formatMessage);
      const outputs = await procedureHandler.run(
        "muutospyynto.tallennus.tallenna",
        [formData]
      );
      return outputs.muutospyynto.tallennus.tallenna.output.result;
    },
    [intl.formatMessage]
  );

  /**
   * Sends the form.
   * @param {object} formData
   */
  const onSend = useCallback(
    async formData => {
      const procedureHandler = new ProcedureHandler(intl.formatMessage);
      // Let's save the form without notification.
      const outputs = await procedureHandler.run(
        "muutospyynto.tallennus.tallenna",
        [formData, false]
      );
      if (outputs.muutospyynto.tallennus.tallenna.output.status === 200) {
        const muutospyynto =
          outputs.muutospyynto.tallennus.tallenna.output.result;
        // It's time to send the form now.
        const outputs2 = await procedureHandler.run(
          "muutospyynto.lahetys.laheta",
          [muutospyynto]
        );
        // User will be redirected to the list of muutospyynnöt.
        const nextUrl = R.path(
          ["muutospyynnot", "listaus", "output"],
          outputs2
        );
        if (nextUrl) {
          // Forcing means that the list will be reloaded when landing on the page.
          setTimeout(() => {
            history.push(`${nextUrl}?force=true`);
          });
        }
        return muutospyynto;
      } else {
        await procedureHandler.run("muutospyynto.lahetys.epaonnistui");
      }
      return false;
    },
    [history, intl.formatMessage]
  );

  const onAction = useCallback(
    async action => {
      // There must be something to save.
      const formData = createMuutospyyntoOutput(
        await createObjectToSave(
          R.toUpper(intl.locale),
          lupa,
          changeObjects,
          uuid,
          kohteet,
          maaraystyypit,
          muut,
          lupaKohteet,
          "KJ"
        ),
        getFiles()
      );

      let muutospyynto = null;

      if (action === "save") {
        muutospyynto = await onSave(formData);
      } else if (action === "preview") {
        muutospyynto = await onPreview(formData);
      } else if (action === "send") {
        muutospyynto = await onSend(formData);
      }

      /**
       * The form is saved and the requested action is run. Let's disable the
       * save button. It will be enabled after new changes.
       */
      setIsSavingEnabled(false);
      prevCosRef.current = changeObjects;

      /**
       * Next thing is to check out if this was the first save. If so we need
       * to update the url so that the user can get the unique url of the
       * freshly saved document and come back to the form later.
       **/
      if (!match.params.uuid && action !== "send") {
        if (muutospyynto && muutospyynto.uuid) {
          // It was the first save...
          onNewDocSave(muutospyynto);
        } else {
          const setAttachments = R.curry(setAttachmentUuids)(
            muutospyynto.liitteet
          );

          const selectionChanged = (path, key) => {
            const objs = R.path(path, changeObjects);
            if (objs) {
              onChangeObjectsUpdate(key, setAttachments(objs));
            }
          };

          selectionChanged(["perustelut", "liitteet"], "perustelut_liitteet");
          selectionChanged(
            ["taloudelliset", "liitteet"],
            "taloudelliset_liitteet"
          );
          selectionChanged(
            ["yhteenveto", "hakemuksenLiitteet"],
            "yhteenveto_hakemuksenLiitteet"
          );
          selectionChanged(
            ["yhteenveto", "yleisetliitteet"],
            "yhteenveto_yleisettiedot"
          );
        }
      }
    },
    [
      changeObjects,
      getFiles,
      intl.locale,
      kohteet,
      lupa,
      lupaKohteet,
      maaraystyypit,
      match.params.uuid,
      muut,
      onNewDocSave,
      onPreview,
      onSave,
      onChangeObjectsUpdate,
      onSend,
      uuid
    ]
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

  const page = useMemo(() => {
    return parseInt(match.params.page, 10);
  }, [match.params.page]);

  useEffect(() => {
    setVisitsPerPage(prevVisits => {
      return R.assoc(page, prevVisits[page] + 1, prevVisits);
    });
  }, [page]);

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
  } else {
    return (
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
          <div
            aria-labelledby="navigate-between-pages"
            className="lg:px-16 max-w-7xl mx-auto w-full">
            <StepperNavigation
              activeStep={page - 1}
              stepProps={steps}
              handleStepChange={handleStep}
            />
          </div>
          <div className="border-b border-gray-400 w-full" />
          <DialogContentWithStyles>
            <div
              id="wizard-content"
              className="lg:px-16 max-w-7xl m-auto mb-20">
              {page === 1 && (
                <WizardPage
                  pageNumber={1}
                  onAction={onAction}
                  onNext={handleNext}
                  lupa={lupa}
                  changeObjects={changeObjects}
                  isSavingEnabled={isSavingEnabled}>
                  <MuutospyyntoWizardMuutokset
                    changeObjects={changeObjects}
                    kielet={kielet}
                    kohteet={kohteet}
                    koulutukset={koulutukset}
                    koulutusalat={koulutusalat}
                    koulutustyypit={koulutustyypit}
                    kunnat={kunnat}
                    maakuntakunnat={maakuntakunnat}
                    maakunnat={maakunnat}
                    lupa={lupa}
                    lupaKohteet={lupaKohteet}
                    maaraystyypit={maaraystyypit}
                    muut={muut}
                    onChangesRemove={onChangesRemove}
                    onChangesUpdate={onChangeObjectsUpdate}
                    opetuskielet={opetuskielet}
                    tutkinnot={tutkinnot}
                  />
                </WizardPage>
              )}
              {page === 2 && (
                <WizardPage
                  pageNumber={2}
                  onAction={onAction}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  lupa={lupa}
                  changeObjects={changeObjects}
                  isSavingEnabled={isSavingEnabled}>
                  <MuutospyyntoWizardPerustelut
                    changeObjects={changeObjects}
                    elykeskukset={elykeskukset}
                    kielet={kielet}
                    kohteet={kohteet}
                    koulutukset={koulutukset}
                    koulutusalat={koulutusalat}
                    koulutustyypit={koulutustyypit}
                    lupa={lupa}
                    lupaKohteet={lupaKohteet}
                    maakuntakunnat={maakuntakunnat}
                    maaraystyypit={maaraystyypit}
                    muut={muut}
                    oivaperustelut={oivaperustelut}
                    onChangesRemove={onChangesRemove}
                    onChangesUpdate={onChangeObjectsUpdate}
                    opetuskielet={opetuskielet}
                    tutkinnot={tutkinnot}
                    vankilat={vankilat}
                    visits={visitsPerPage[2]}
                  />
                </WizardPage>
              )}
              {page === 3 && (
                <WizardPage
                  pageNumber={3}
                  onAction={onAction}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  lupa={lupa}
                  changeObjects={changeObjects}
                  isSavingEnabled={isSavingEnabled}>
                  <MuutospyyntoWizardTaloudelliset
                    changeObjects={changeObjects}
                    onChangesRemove={onChangesRemove}
                    onChangesUpdate={onChangeObjectsUpdate}
                    isFirstVisit={visitsPerPage[3] === 1}
                  />
                </WizardPage>
              )}
              {page === 4 && (
                <WizardPage
                  pageNumber={4}
                  onAction={onAction}
                  onPrev={handlePrev}
                  lupa={lupa}
                  isSavingEnabled={isSavingEnabled}>
                  <MuutospyyntoWizardYhteenveto
                    changeObjects={changeObjects}
                    elykeskukset={elykeskukset}
                    kielet={kielet}
                    kohteet={kohteet}
                    koulutukset={koulutukset}
                    koulutusalat={koulutusalat}
                    koulutustyypit={koulutustyypit}
                    lupa={lupa}
                    lupaKohteet={lupaKohteet}
                    maaraystyypit={maaraystyypit}
                    muut={muut}
                    oivaperustelut={oivaperustelut}
                    onChangesRemove={onChangesRemove}
                    onChangesUpdate={onChangeObjectsUpdate}
                    opetuskielet={opetuskielet}
                    tutkinnot={tutkinnot}
                    isFirstVisit={visitsPerPage[4] === 1}
                  />
                </WizardPage>
              )}
            </div>
          </DialogContentWithStyles>
        </FormDialog>
        <ConfirmDialog
          isConfirmDialogVisible={isConfirmDialogVisible}
          messages={{
            content: intl.formatMessage(common.confirmExitMuutoshakemusWizard),
            ok: intl.formatMessage(common.yes),
            cancel: intl.formatMessage(common.no),
            title: intl.formatMessage(
              common.confirmExitMuutoshakemusWizardTitle
            )
          }}
          handleOk={closeWizard}
          handleCancel={handleCancel}
        />
      </React.Fragment>
    );
  }
};

MuutospyyntoWizard.propTypes = {
  elykeskukset: PropTypes.array,
  history: PropTypes.object,
  initialChangeObjects: PropTypes.object,
  kielet: PropTypes.array,
  koulutukset: PropTypes.object,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  kunnat: PropTypes.array,
  lupa: PropTypes.object,
  lupKohteet: PropTypes.object,
  maakunnat: PropTypes.array,
  maakuntakunnat: PropTypes.array,
  maaraystyypit: PropTypes.array,
  match: PropTypes.object,
  muut: PropTypes.array,
  oivaperustelut: PropTypes.array,
  onNewDocSave: PropTypes.func,
  opetuskielet: PropTypes.array,
  tutkinnot: PropTypes.array,
  vankilat: PropTypes.array
};

export default MuutospyyntoWizard;
