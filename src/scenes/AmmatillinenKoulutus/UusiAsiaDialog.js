import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import DialogTitle from "../../components/02-organisms/DialogTitle";
import ConfirmDialog from "../../components/02-organisms/ConfirmDialog";
import wizardMessages from "../../i18n/definitions/wizard";
import { withStyles } from "@material-ui/styles";
import { DialogContent, Dialog } from "@material-ui/core";
import EsittelijatWizardActions from "./EsittelijatWizardActions";
import { useHistory, useParams } from "react-router-dom";
import SimpleButton from "../../components/00-atoms/SimpleButton";
import { createMuutospyyntoOutput } from "../../services/muutoshakemus/utils/common";
import ProcedureHandler from "../../components/02-organisms/procedureHandler";
import { useMuutospyynto } from "../../stores/muutospyynto";
import common from "../../i18n/definitions/common";
import * as R from "ramda";
import {
  useChangeObjects,
  useChangeObjectsByAnchorWithoutUnderRemoval,
  useUnderRemovalChangeObjects,
  useUnsavedChangeObjects
} from "./store";
import Lupanakyma from "./Esittelijat/Lupanakyma";
import { createObjectToSave } from "helpers/ammatillinenKoulutus/tallentaminen/esittelijat";
import { getSavedChangeObjects } from "helpers/ammatillinenKoulutus/commonUtils";

const isDebugOn = process.env.REACT_APP_DEBUG === "true";

const DialogTitleWithStyles = withStyles(() => ({
  root: {
    backgroundColor: "#c8dcc3",
    paddingBottom: "1rem",
    paddingTop: "1rem",
    width: "100%"
  }
}))(props => {
  return <DialogTitle {...props}>{props.children}</DialogTitle>;
});

const DialogContentWithStyles = withStyles(() => ({
  root: {
    backgroundColor: "#ffffff",
    padding: 0,
    scrollBehavior: "smooth"
  }
}))(props => {
  return <DialogContent {...props}>{props.children}</DialogContent>;
});

const FormDialog = withStyles(() => ({
  paper: {
    background: "#ffffff",
    marginLeft: isDebugOn ? "33%" : 0,
    width: isDebugOn ? "66%" : "100%"
  }
}))(props => {
  return <Dialog {...props}>{props.children}</Dialog>;
});

const defaultProps = {
  kielet: [],
  kohteet: [],
  koulutukset: {
    muut: {},
    poikkeukset: {}
  },
  koulutusalat: {},
  koulutustyypit: {},
  kunnat: [],
  lupa: {},
  lupaKohteet: {},
  maakunnat: [],
  maakuntakunnat: [],
  maaraystyypit: [],
  muut: [],
  opetuskielet: [],
  organisation: {},
  tutkinnot: []
};

const UusiAsiaDialog = ({
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
  muut = defaultProps.muut,
  onNewDocSave,
  organisation = defaultProps.organisation,
  tutkinnot = defaultProps.tutkinnot
}) => {
  const intl = useIntl();
  const params = useParams();
  let history = useHistory();
  let { uuid } = params;

  const [{ changeObjects }, { initializeChanges }] = useChangeObjects();
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [unsavedChangeObjects] = useUnsavedChangeObjects();
  const [underRemovalChangeObjects] = useUnderRemovalChangeObjects();
  const [, muutospyyntoActions] = useMuutospyynto();

  // Relevantit muutosobjektit osioittain (tarvitaan tallennettaessa)
  const [topThreeCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "topthree"
  });
  const [tutkinnotCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "tutkinnot"
  });
  const [koulutuksetCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "koulutukset"
  });
  const [opetuskieletCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "kielet_opetuskielet"
  });
  const [tutkintokieletCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "kielet_tutkintokielet"
  });
  const [toimintaalueCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "toimintaalue"
  });
  const [opiskelijavuodetCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "opiskelijavuodet"
  });
  const [muutCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "muut"
  });

  const isSavingEnabled = useMemo(() => {
    const hasUnsavedChanges = unsavedChangeObjects
      ? !R.isEmpty(unsavedChangeObjects)
      : false;
    const hasChangesUnderRemoval = underRemovalChangeObjects
      ? !R.isEmpty(underRemovalChangeObjects)
      : false;
    return hasUnsavedChanges || hasChangesUnderRemoval;
  }, [underRemovalChangeObjects, unsavedChangeObjects]);

  const leaveOrOpenCancelModal = () => {
    !R.isEmpty(unsavedChangeObjects)
      ? setIsConfirmDialogVisible(true)
      : history.push(`/ammatillinenkoulutus/asianhallinta/avoimet?force=true`);
  };

  function handleCancel() {
    setIsConfirmDialogVisible(false);
  }

  /**
   * User is redirected to the following path when the form is closed.
   */
  const closeWizard = useCallback(async () => {
    setIsDialogOpen(false);
    setIsConfirmDialogVisible(false);
    // Let's empty some store content on close.
    muutospyyntoActions.reset();
    return history.push(
      `/ammatillinenkoulutus/asianhallinta/avoimet?force=true`
    );
  }, [history, muutospyyntoActions]);

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
        "muutospyynto.tallennus.tallennaEsittelijanToimesta",
        [formData, false] // false = Notification of save success won't be shown.
      );
      const muutospyynto =
        outputs.muutospyynto.tallennus.tallennaEsittelijanToimesta.output
          .result;
      // Let's get the path of preview (PDF) document and download the file.
      const path = await muutospyyntoActions.getLupaPreviewDownloadPath(
        muutospyynto.uuid
      );
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
        "muutospyynto.tallennus.tallennaEsittelijanToimesta",
        [formData]
      );
      return outputs.muutospyynto.tallennus.tallennaEsittelijanToimesta.output
        .result;
    },
    [intl.formatMessage]
  );

  const onAction = useCallback(
    async (action, fromDialog = false) => {
      const formData = createMuutospyyntoOutput(
        await createObjectToSave(
          R.toUpper(intl.locale),
          organisation,
          lupa,
          {
            koulutukset: koulutuksetCO,
            muut: muutCO,
            opetuskielet: opetuskieletCO,
            opiskelijavuodet: opiskelijavuodetCO,
            toimintaalue: toimintaalueCO,
            topthree: topThreeCO,
            tutkinnot: tutkinnotCO,
            tutkintokielet: tutkintokieletCO
          },
          uuid,
          kohteet,
          maaraystyypit,
          muut,
          lupaKohteet,
          "ESITTELIJA"
        )
      );

      let muutospyynto = null;

      if (action === "save") {
        muutospyynto = await onSave(formData);
      } else if (action === "preview") {
        muutospyynto = await onPreview(formData);
      }

      if (!!muutospyynto && R.prop("uuid", muutospyynto)) {
        if (!uuid && !fromDialog) {
          // Jos kyseessä on ensimmäinen tallennus...
          onNewDocSave(muutospyynto.uuid);
        } else {
          /**
           * Kun muutospyyntolomakkeen tilaa muokataan tässä vaiheessa,
           * vältytään tarpeelta tehdä sivun täydellistä uudelleen latausta.
           **/
          const changeObjectsFromBackend = getSavedChangeObjects(muutospyynto);
          initializeChanges(changeObjectsFromBackend);
        }
      }
    },
    [
      kohteet,
      initializeChanges,
      intl.locale,
      koulutuksetCO,
      lupa,
      lupaKohteet,
      maaraystyypit,
      muut,
      muutCO,
      onNewDocSave,
      onPreview,
      onSave,
      opetuskieletCO,
      opiskelijavuodetCO,
      organisation,
      toimintaalueCO,
      topThreeCO,
      tutkinnotCO,
      tutkintokieletCO,
      uuid
    ]
  );

  return (
    changeObjects !== null && (
      <div className="max-w-7xl">
        <FormDialog
          open={isDialogOpen}
          onClose={leaveOrOpenCancelModal}
          maxWidth={"lg"}
          fullScreen={true}
          aria-labelledby="simple-dialog-title">
          <div className={"w-full m-auto"}>
            <DialogTitleWithStyles id="customized-dialog-title">
              <div className="flex">
                <div className="flex-1">
                  {intl.formatMessage(
                    wizardMessages.esittelijatMuutospyyntoDialogTitle
                  )}
                </div>
                <div>
                  <SimpleButton
                    text={`${intl.formatMessage(wizardMessages.getOut)} X`}
                    onClick={leaveOrOpenCancelModal}
                    variant={"text"}
                  />
                </div>
              </div>
            </DialogTitleWithStyles>
          </div>
          <DialogContentWithStyles>
            <div className="mb-20">
              <Lupanakyma
                history={history}
                kielet={kielet}
                kohteet={kohteet}
                koulutukset={koulutukset}
                koulutusalat={koulutusalat}
                koulutustyypit={koulutustyypit}
                kunnat={kunnat}
                maaraykset={lupa.maaraykset}
                lupaKohteet={lupaKohteet}
                maakunnat={maakunnat}
                maakuntakunnat={maakuntakunnat}
                maaraystyypit={maaraystyypit}
                muut={muut}
                onNewDocSave={onNewDocSave}
                organisation={organisation}
                tutkinnot={tutkinnot}
              />
            </div>
            <EsittelijatWizardActions
              isSavingEnabled={isSavingEnabled}
              onClose={leaveOrOpenCancelModal}
              onPreview={() => {
                return onAction("preview");
              }}
              onSave={() => {
                return onAction("save");
              }}
            />
          </DialogContentWithStyles>
        </FormDialog>
        <ConfirmDialog
          isConfirmDialogVisible={isConfirmDialogVisible}
          messages={{
            content: intl.formatMessage(
              common.confirmExitEsittelijaMuutoshakemusWizard
            ),
            ok: intl.formatMessage(common.save),
            noSave: intl.formatMessage(common.noSave),
            cancel: intl.formatMessage(common.cancel),
            title: intl.formatMessage(
              common.confirmExitEsittelijaMuutoshakemusWizardTitle
            )
          }}
          handleOk={async () => {
            await onAction("save", true);
            closeWizard();
          }}
          handleCancel={handleCancel}
          handleExitAndAbandonChanges={closeWizard}
        />
      </div>
    )
  );
};

UusiAsiaDialog.propTypes = {
  history: PropTypes.object,
  kielet: PropTypes.array,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  kunnat: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  maakunnat: PropTypes.array,
  maakuntakunnat: PropTypes.array,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  onChangeObjectsUpdate: PropTypes.func,
  onNewDocSave: PropTypes.func,
  opetuskielet: PropTypes.array,
  organisation: PropTypes.object,
  tutkinnot: PropTypes.array
};

export default UusiAsiaDialog;
