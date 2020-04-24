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
import { HAKEMUS_VIESTI } from "../modules/uusiHakemusFormConstants";
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
import { sortLanguages } from "../../../../../../utils/kieliUtil";
import {
  parseKoulutuksetAll,
  parseKoulutusalat
} from "../../../../../../utils/koulutusParser";
import { getMaakuntakunnatList } from "../../../../../../utils/toimialueUtil";
import Loading from "../../../../../../modules/Loading";
import { findObjectWithKey } from "../../../../../../utils/common";
import ConfirmDialog from "okm-frontend-components/dist/components/02-organisms/ConfirmDialog";
import DialogTitle from "okm-frontend-components/dist/components/02-organisms/DialogTitle";
import { useKielet } from "../../../../../../stores/kielet";
import { useOpetuskielet } from "../../../../../../stores/opetuskielet";
import { useKoulutusalat } from "../../../../../../stores/koulutusalat";
import { useTutkinnot } from "../../../../../../stores/tutkinnot";
import { useKoulutukset } from "../../../../../../stores/koulutukset";
import { mapObjIndexed, prop, sortBy } from "ramda";
import { useChangeObjects } from "../../../../../../stores/changeObjects";
import { useLomakkeet } from "../../../../../../stores/lomakkeet";
import ProcedureHandler from "../../../../../../components/02-organisms/procedureHandler";
import { createMuutospyyntoOutput } from "../../../../../../services/muutoshakemus/utils/common";
import { useMuutospyynto } from "../../../../../../stores/muutospyynto";

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

/**
 * MuutospyyntoWizard is the tool to create a new application. It provides all
 * the needed fields and information for a user for filling out the form.
 * @param {Object} backendChanges - Backend known changes of the current application
 */
const MuutospyyntoWizard = ({
  backendMuutokset = [],
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
  onNewDocSave,
  vankilat = []
}) => {
  const intl = useIntl();

  const [isSavingEnabled, setIsSavingEnabled] = useState(false);

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

  /**
   * We are going to create new objects based on these definitions.
   */
  const [cos, coActions] = useChangeObjects(); // cos means change objects
  const [kielet] = useKielet();
  const [opetuskielet] = useOpetuskielet();
  const [koulutusalat] = useKoulutusalat();
  const [tutkinnot] = useTutkinnot();
  const [koulutukset] = useKoulutukset();
  const [, muutospyyntoActions] = useMuutospyynto();

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

  // All forms of KJ Wizard
  const [lomakkeet] = useLomakkeet();

  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [state] = useState({
    isHelpVisible: false
  });
  const [steps, setSteps] = useState([]);

  /**
   * The function is mainly called by FormSection.
   */
  const onSectionChangesUpdate = useCallback(
    (id, changeObjects) => {
      if (id && changeObjects) {
        coActions.set(id, changeObjects);
      }
    },
    [coActions]
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

  const handleStep = useCallback(
    pageNumber => {
      history.push(String(pageNumber));
    },
    [history]
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
      // Let's empty some store content on close.
      const procedureHandler = new ProcedureHandler();
      procedureHandler.run("muutospyynto.muutokset.poista", [coActions]);
      muutospyyntoActions.reset();
    };
  }, [coActions, intl, muutospyyntoActions]);

  const getFiles = useCallback(() => {
    // Gets all attachment data from changeObjects
    const files = findObjectWithKey(cos, "file");
    const allAttachments = combineArrays([
      R.path(["yhteenveto", "yleisettiedot"], cos) || [],
      R.path(["yhteenveto", "hakemuksenLiitteet"], cos) || [],
      R.path(["taloudelliset", "liitteet"], cos) || [],
      R.path(["perustelut", "liitteet"], cos) || [],
      R.flatten(
        R.path(["perustelut", "koulutukset", "kuljettajakoulutukset"], cos) ||
          []
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
  }, [cos]);

  const anchors = useMemo(() => {
    return findObjectWithKey(cos, "anchor");
  }, [cos]);

  const prevAnchorsRef = useRef(anchors);

  useEffect(() => {
    // If user has made changes on the form the save action must be available.
    setIsSavingEnabled(!R.equals(prevAnchorsRef.current, anchors));
  }, [anchors]);

  /**
   * Opens the preview.
   * @param {object} formData
   */
  const onPreview = useCallback(
    async formData => {
      const procedureHandler = new ProcedureHandler();
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
        muutospyyntoActions.download(path);
      }
      return muutospyynto;
    },
    [muutospyyntoActions]
  );

  /**
   * Saves the form.
   * @param {object} formData
   * @returns {object} - Muutospyyntö
   */
  const onSave = useCallback(async formData => {
    const procedureHandler = new ProcedureHandler();
    const outputs = await procedureHandler.run(
      "muutospyynto.tallennus.tallenna",
      [formData]
    );
    return outputs.muutospyynto.tallennus.tallenna.output.result;
  }, []);

  /**
   * Sends the form.
   * @param {object} formData
   */
  const onSend = useCallback(
    async formData => {
      const procedureHandler = new ProcedureHandler();
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
    [history]
  );

  const onAction = useCallback(
    async action => {
      // There must be something to save.
      const formData = createMuutospyyntoOutput(
        createObjectToSave(
          lupa,
          cos,
          backendMuutokset,
          match.params.uuid,
          kohteet,
          maaraystyypit,
          muut,
          lupaKohteet
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
      prevAnchorsRef.current = anchors;

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
            const objs = R.path(path, cos);
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
      anchors,
      cos,
      backendMuutokset,
      getFiles,
      kohteet,
      lupa,
      lupaKohteet,
      maaraystyypit,
      match.params.uuid,
      muut,
      onNewDocSave,
      onPreview,
      onSave,
      onSectionChangesUpdate,
      onSend
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
  } else if (
    parsedKoulutukset &&
    kieletAndOpetuskielet &&
    parsedTutkinnot &&
    maakuntakunnatList
  ) {
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
            className="lg:px-16 max-w-6xl mx-auto w-full">
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
              className="lg:px-16 max-w-6xl m-auto mb-20">
              {page === 1 && (
                <WizardPage
                  pageNumber={1}
                  onAction={onAction}
                  onNext={handleNext}
                  lupa={lupa}
                  changeObjects={cos}
                  isSavingEnabled={isSavingEnabled}>
                  <MuutospyyntoWizardMuutokset
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
                    lomakkeet={lomakkeet}
                    onChangesUpdate={onSectionChangesUpdate}
                    tutkinnot={parsedTutkinnot}
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
                  changeObjects={cos}
                  isSavingEnabled={isSavingEnabled}>
                  <MuutospyyntoWizardPerustelut
                    changeObjects={cos}
                    elykeskukset={elykeskukset}
                    kielet={kieletAndOpetuskielet}
                    kohteet={kohteet}
                    koulutukset={parsedKoulutukset}
                    lupa={lupa}
                    lupaKohteet={lupaKohteet}
                    maaraystyypit={maaraystyypit}
                    muut={muut}
                    lomakkeet={lomakkeet}
                    muutosperusteluList={muutosperusteluList}
                    onChangesUpdate={onSectionChangesUpdate}
                    tutkinnot={parsedTutkinnot}
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
                  changeObjects={cos}
                  isSavingEnabled={isSavingEnabled}>
                  <MuutospyyntoWizardTaloudelliset
                    changeObjects={cos}
                    lomakkeet={lomakkeet}
                    onChangesUpdate={onSectionChangesUpdate}
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
                    changeObjects={cos}
                    kielet={kieletAndOpetuskielet}
                    kohteet={kohteet}
                    koulutukset={parsedKoulutukset}
                    lupa={lupa}
                    lupaKohteet={lupaKohteet}
                    maaraystyypit={maaraystyypit}
                    muut={muut}
                    lomakkeet={lomakkeet}
                    muutosperusteluList={muutosperusteluList}
                    onChangesUpdate={onSectionChangesUpdate}
                    tutkinnot={parsedTutkinnot}
                    isFirstVisit={visitsPerPage[4] === 1}
                  />
                </WizardPage>
              )}
            </div>
          </DialogContentWithStyles>
        </FormDialog>
        <ConfirmDialog
          isConfirmDialogVisible={isConfirmDialogVisible}
          title={"Poistutaanko?"}
          content={HAKEMUS_VIESTI.VARMISTUS.FI}
          yesMessage={HAKEMUS_VIESTI.KYLLA.FI}
          noMessage={HAKEMUS_VIESTI.EI.FI}
          handleOk={closeWizard}
          handleCancel={handleCancel}
        />
      </React.Fragment>
    );
  } else {
    return <Loading />;
  }
};

MuutospyyntoWizard.propTypes = {
  backendMuutokset: PropTypes.array,
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
  onNewDocSave: PropTypes.func,
  vankilat: PropTypes.array
};

export default MuutospyyntoWizard;
