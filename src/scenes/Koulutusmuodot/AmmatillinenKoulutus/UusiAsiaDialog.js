import React, { useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import DialogTitle from "components/02-organisms/DialogTitle";
import ConfirmDialog from "components/02-organisms/ConfirmDialog";
import wizardMessages from "i18n/definitions/wizard";
import { withStyles } from "@material-ui/styles";
import { DialogContent, Dialog } from "@material-ui/core";
import EsittelijatWizardActions from "./EsittelijatWizardActions";
import { useHistory, useParams } from "react-router-dom";
import SimpleButton from "components/00-atoms/SimpleButton";
import { createMuutospyyntoOutput } from "services/muutoshakemus/utils/common";
import ProcedureHandler from "components/02-organisms/procedureHandler";
import { useMuutospyynto } from "stores/muutospyynto";
import common from "i18n/definitions/common";
import * as R from "ramda";
import {
  useChangeObjects,
  useChangeObjectsByAnchorWithoutUnderRemoval,
  useUnderRemovalChangeObjects,
  useUnsavedChangeObjects
} from "stores/muutokset";
import { createObjectToSave } from "helpers/ammatillinenKoulutus/tallentaminen/esittelijat";
import { getSavedChangeObjects } from "helpers/ammatillinenKoulutus/commonUtils";
import equal from "react-fast-compare";
import { useAllSections, useValidity } from "stores/lomakedata";
import StepperNavigation from "components/01-molecules/Stepper";
import MuutospyyntoWizardTaloudelliset from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardTaloudelliset";
import MuutospyyntoWizardYhteenveto from "./Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardYhteenveto";
import OrganisationInfo from "components/02-organisms/OrganisationInfo";
import EsittelijatMuutospyynto from "./EsittelijatMuutospyynto";

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
  kohteet: [],
  koulutukset: {
    muut: {},
    poikkeukset: {}
  },
  koulutusalat: {},
  koulutustyypit: {},
  lupa: {},
  lupaKohteet: {},
  maaraystyypit: [],
  muut: [],
  opetuskielet: [],
  organisation: {}
};

const UusiAsiaDialog = React.memo(
  ({
    kohteet = defaultProps.kohteet,
    koulutukset = defaultProps.koulutukset,
    koulutusalat = defaultProps.koulutusalat,
    koulutustyypit = defaultProps.koulutustyypit,
    lupa = defaultProps.lupa,
    lupaKohteet = defaultProps.lupaKohteet,
    maaraystyypit = defaultProps.maaraystyypit,
    muut = defaultProps.muut,
    onNewDocSave,
    organisation = defaultProps.organisation,
    role
  }) => {
    const intl = useIntl();
    const params = useParams();
    let history = useHistory();
    let { page: pageParam, uuid } = params;

    const [page, setPage] = useState();

    useEffect(() => {
      setPage(pageParam ? parseInt(pageParam, 10) : 1);
    }, [pageParam]);

    const [validity] = useValidity();

    const isLupaValid = useMemo(() => {
      return !R.includes(false, R.values(validity));
    }, [validity]);

    const [{ changeObjects }, { initializeChanges }] = useChangeObjects();
    const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(true);
    const [unsavedChangeObjects] = useUnsavedChangeObjects();
    const [underRemovalChangeObjects] = useUnderRemovalChangeObjects();
    const [, muutospyyntoActions] = useMuutospyynto();
    const [lomakedata] = useAllSections();
    const [steps] = useState([
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
    // const [rajoitteetCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    //   anchor: "rajoitteet"
    // });

    const handleStep = useCallback(
      pageNumber => {
        history.push(String(pageNumber));
      },
      [history]
    );

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
        : history.push(
            `/ammatillinenkoulutus/asianhallinta/avoimet?force=true`
          );
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
              // rajoitteet: rajoitteetCO
            },
            uuid,
            kohteet,
            maaraystyypit,
            muut,
            lupaKohteet,
            lomakedata
          )
        );

        let muutospyynto = null;

        if (action === "save") {
          muutospyynto = await onSave(formData);
        } else if (action === "preview") {
          muutospyynto = await onPreview(formData);
        }

        if (!!muutospyynto && R.prop("uuid", muutospyynto)) {
          if (!uuid && !fromDialog && !!onNewDocSave) {
            // Jos kyseessä on ensimmäinen tallennus...
            onNewDocSave(muutospyynto.uuid);
          } else {
            /**
             * Kun muutospyyntolomakkeen tilaa muokataan tässä vaiheessa,
             * vältytään tarpeelta tehdä sivun täydellistä uudelleen latausta.
             **/
            const changeObjectsFromBackend = getSavedChangeObjects(
              muutospyynto
            );
            initializeChanges(changeObjectsFromBackend);
          }
        }
      },
      [
        kohteet,
        initializeChanges,
        intl.locale,
        koulutuksetCO,
        lomakedata,
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
        // rajoitteetCO,
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
            aria-labelledby="simple-dialog-title"
          >
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
              <OrganisationInfo organisation={organisation} />
              <div className="w-full xxl:w-4/5 max-w-8xl m-auto mb-32">
                {role === "KJ" && (
                  <StepperNavigation
                    activeStep={page - 1}
                    stepProps={steps}
                    handleStepChange={handleStep}
                  />
                )}
                {!R.isEmpty(organisation) ? (
                  <div
                    className={`border-t-2 ${
                      isLupaValid ? "border-green-500" : "border-red-500"
                    }`}
                  >
                    <div
                      id="wizard-content"
                      className="px-8 xxl:p-0 max-w-7xl m-auto mb-20"
                    >
                      {page === 1 && (
                        <EsittelijatMuutospyynto
                          kohteet={kohteet}
                          koulutukset={koulutukset}
                          koulutusalat={koulutusalat}
                          koulutustyypit={koulutustyypit}
                          maaraykset={lupa.maaraykset}
                          lupaKohteet={lupaKohteet}
                          maaraystyypit={maaraystyypit}
                          mode={"modification"}
                          muut={muut}
                          role={role}
                          title={intl.formatMessage(common.changesText)}
                        />
                      )}
                      {page === 2 && (
                        <EsittelijatMuutospyynto
                          kohteet={kohteet}
                          koulutukset={koulutukset}
                          koulutusalat={koulutusalat}
                          koulutustyypit={koulutustyypit}
                          maaraykset={lupa.maaraykset}
                          lupaKohteet={lupaKohteet}
                          maaraystyypit={maaraystyypit}
                          mode={"reasoning"}
                          muut={muut}
                          role={role}
                          title={intl.formatMessage(wizardMessages.pageTitle_2)}
                        />
                      )}
                      {page === 3 && (
                        <MuutospyyntoWizardTaloudelliset
                          isReadOnly={false}
                          tutkinnotCO={tutkinnotCO}
                          // isFirstVisit={visitsPerPage[3] === 1}
                        />
                      )}
                      {page === 4 && (
                        <MuutospyyntoWizardYhteenveto
                          history={history}
                          kohteet={kohteet}
                          koulutukset={koulutukset}
                          koulutusalat={koulutusalat}
                          koulutustyypit={koulutustyypit}
                          lupa={lupa}
                          lupaKohteet={lupaKohteet}
                          maaraykset={lupa.maaraykset}
                          maaraystyypit={maaraystyypit}
                          mode="reasoning"
                          muut={muut}
                          tutkinnotCO={tutkinnotCO}
                          // isFirstVisit={visitsPerPage[4] === 1}
                        />
                      )}
                    </div>
                  </div>
                ) : null}
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
  },
  (cp, np) => {
    return equal(cp, np);
  }
);

UusiAsiaDialog.propTypes = {
  history: PropTypes.object,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  onChangeObjectsUpdate: PropTypes.func,
  onNewDocSave: PropTypes.func,
  opetuskielet: PropTypes.array,
  organisation: PropTypes.object,
  role: PropTypes.string
};

export default UusiAsiaDialog;
