import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import DialogTitle from "../../components/02-organisms/DialogTitle";
import ConfirmDialog from "../../components/02-organisms/ConfirmDialog";
import wizardMessages from "../../i18n/definitions/wizard";
import { withStyles } from "@material-ui/styles";
import { Dialog, DialogContent } from "@material-ui/core";
import EsittelijatWizardActions from "./EsittelijatWizardActions";
import { useHistory, useParams } from "react-router-dom";
import { createMuutospyyntoOutput } from "../../services/muutoshakemus/utils/common";
import ProcedureHandler from "../../components/02-organisms/procedureHandler";
import Lomake from "../../components/02-organisms/Lomake";
import { useMuutospyynto } from "../../stores/muutospyynto";
import Opetustehtavat from "./lomake/1-Opetustehtavat";
import FormSection from "./formSection";
import { useEsiJaPerusopetus } from "stores/esiJaPerusopetus";
import OpetustaAntavatKunnat from "./lomake/2-OpetustaAntavatKunnat";
import Opetuskieli from "./lomake/3-Opetuskieli";
import OpetuksenJarjestamismuoto from "./lomake/4-OpetuksenJarjestamismuoto";
import ErityisetKoulutustehtavat from "./lomake/5-ErityisetKoulutustehtavat";
import Opiskelijamaarat from "./lomake/6-Opiskelijamaarat";
import MuutEhdot from "./lomake/7-MuutEhdot";
import Rajoitteet from "./lomake/9-Rajoitteet";
import * as R from "ramda";
import common from "../../i18n/definitions/common";
import education from "../../i18n/definitions/education";
import { createObjectToSave } from "./saving";
import {
  useChangeObjects,
  useChangeObjectsByAnchorWithoutUnderRemoval,
  useUnderRemovalChangeObjects,
  useUnsavedChangeObjects
} from "../AmmatillinenKoulutus/store";
import { getSavedChangeObjects } from "../../helpers/ammatillinenKoulutus/commonUtils";
import SimpleButton from "../../components/00-atoms/SimpleButton";

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

const constants = {
  formLocation: {
    paatoksenTiedot: ["esiJaPerusopetus", "paatoksenTiedot"]
  }
};

const defaultProps = {
  ensisijaisetOpetuskieletOPH: [],
  kielet: [],
  kohteet: [],
  koulutukset: {
    muut: {},
    poikkeukset: {}
  },
  koulutusalat: {},
  koulutustyypit: {},
  kunnat: [],
  lisatiedot: [],
  lupa: {},
  lupaKohteet: {},
  maakunnat: [],
  maakuntakunnat: [],
  maaraystyypit: [],
  muut: [],
  opetuksenJarjestamismuodot: [],
  opetuskielet: [],
  opetustehtavakoodisto: {},
  organisation: {},
  poErityisetKoulutustehtavat: [],
  poMuutEhdot: [],
  toissijaisetOpetuskieletOPH: [],
  tutkinnot: []
};

const UusiAsiaDialog = ({
  ensisijaisetOpetuskieletOPH = defaultProps.ensisijaisetOpetuskieletOPH,
  kohteet = defaultProps.kohteet,
  kunnat = defaultProps.kunnat,
  lisatiedot = defaultProps.lisatiedot,
  lupa = defaultProps.lupa,
  lupaKohteet = defaultProps.lupaKohteet,
  maakunnat = defaultProps.maakunnat,
  maakuntakunnat = defaultProps.maakuntakunnat,
  maaraystyypit = defaultProps.maaraystyypit,
  muut = defaultProps.muut,
  onNewDocSave,
  opetuksenJarjestamismuodot = defaultProps.opetuksenJarjestamismuodot,
  opetustehtavakoodisto = defaultProps.opetustehtavakoodisto,
  organisation = defaultProps.organisation,
  poErityisetKoulutustehtavat = defaultProps.poErityisetKoulutustehtavat,
  poMuutEhdot = defaultProps.poMuutEhdot,
  toissijaisetOpetuskieletOPH = defaultProps.toissijaisetOpetuskieletOPH
}) => {
  const [paatoksentiedotCo] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "paatoksentiedot"
  });
  const [toimintaalueCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "toimintaalue"
  });
  const [opetustehtavatCo] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "opetustehtavat"
  });

  const [state] = useEsiJaPerusopetus();
  const [{ changeObjects }, { initializeChanges }] = useChangeObjects();

  const intl = useIntl();
  const params = useParams();
  let history = useHistory();
  let { uuid } = params;

  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [unsavedChangeObjects] = useUnsavedChangeObjects();
  const [underRemovalChangeObjects] = useUnderRemovalChangeObjects();
  const [, muutospyyntoActions] = useMuutospyynto();

  const valtakunnallinenMaarays = R.find(
    R.propEq("koodisto", "nuts1"),
    R.prop("maaraykset", lupa) || []
  );

  const organisationPhoneNumber = R.head(
    R.values(R.find(R.prop("numero"), organisation.yhteystiedot))
  );

  const organisationEmail = R.head(
    R.values(R.find(R.prop("email"), organisation.yhteystiedot))
  );

  const organisationWebsite = R.head(
    R.values(R.find(R.prop("www"), organisation.yhteystiedot))
  );

  const leaveOrOpenCancelModal = () => {
    !R.isEmpty(unsavedChangeObjects)
      ? setIsConfirmDialogVisible(true)
      : history.push(`/esi-ja-perusopetus/asianhallinta/avoimet?force=true`);
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
    return history.push(`/esi-ja-perusopetus/asianhallinta/avoimet?force=true`);
  }, [history, muutospyyntoActions]);

  const isSavingEnabled = useMemo(() => {
    const hasUnsavedChanges = unsavedChangeObjects
      ? !R.isEmpty(unsavedChangeObjects)
      : false;
    const hasChangesUnderRemoval = underRemovalChangeObjects
      ? !R.isEmpty(underRemovalChangeObjects)
      : false;
    return hasUnsavedChanges || hasChangesUnderRemoval;
  }, [underRemovalChangeObjects, unsavedChangeObjects]);

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
            paatoksentiedot: paatoksentiedotCo,
            opetustehtavat: opetustehtavatCo,
            toimintaalue: toimintaalueCO
          },
          uuid,
          kohteet,
          maaraystyypit,
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
      initializeChanges,
      intl.locale,
      kohteet,
      lupa,
      maaraystyypit,
      onNewDocSave,
      onPreview,
      onSave,
      opetustehtavatCo,
      organisation,
      paatoksentiedotCo,
      toimintaalueCO,
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
            <div className="bg-vaalenharmaa px-16 w-full m-auto mb-20 border-b border-xs border-harmaa">
              <div className="py-4">
                <h1>
                  {organisation.nimi[intl.locale] ||
                    R.last(R.values(organisation.nimi))}
                </h1>
                <p>
                  {organisation.kayntiosoite.osoite},{" "}
                  {organisation.postiosoite.osoite}{" "}
                  {organisation.kayntiosoite.postitoimipaikka}
                </p>
                <p>
                  {organisationPhoneNumber && (
                    <React.Fragment>
                      <a
                        href={`tel:${organisationPhoneNumber}`}
                        className="underline">
                        {organisationPhoneNumber}
                      </a>{" "}
                      |{" "}
                    </React.Fragment>
                  )}
                  {organisationPhoneNumber && (
                    <React.Fragment>
                      <a
                        href={`mailto:${organisationEmail}`}
                        className="underline">
                        {organisationEmail}
                      </a>{" "}
                      |{" "}
                    </React.Fragment>
                  )}
                  {organisation.ytunnus} |{" "}
                  {organisationWebsite && (
                    <a href={organisationWebsite} className="underline">
                      {organisationWebsite}
                    </a>
                  )}
                </p>
              </div>
            </div>
            <div
              id="wizard-content"
              className="px-16 xl:w-3/4 max-w-7xl m-auto mb-20">
              <div className="w-1/3" style={{ marginLeft: "-2rem" }}>
                <h2 className="p-8">
                  {intl.formatMessage(common.decisionDetails)}
                </h2>
                <Lomake
                  isInExpandableRow={false}
                  anchor="paatoksentiedot"
                  data={{ formatMessage: intl.formatMessage, uuid }}
                  path={constants.formLocation.paatoksenTiedot}></Lomake>
              </div>

              <form onSubmit={() => {}}>
                <FormSection
                  render={props => <Rajoitteet {...props} />}
                  sectionId="rajoitteet"
                  title={"Lupaan kohdistuvat rajoitteet"}></FormSection>

                <FormSection
                  code={1}
                  render={props => (
                    <Opetustehtavat
                      opetustehtavakoodisto={opetustehtavakoodisto}
                      {...props}
                    />
                  )}
                  sectionId="opetustehtavat"
                  title={
                    opetustehtavakoodisto.metadata[R.toUpper(intl.locale)]
                      .kuvaus
                  }></FormSection>

                <FormSection
                  code={2}
                  render={props => (
                    <OpetustaAntavatKunnat
                      changeObjects={state.changeObjects.toimintaalue}
                      lupakohde={lupaKohteet[3]}
                      kunnat={kunnat}
                      lisatiedot={lisatiedot}
                      maakuntakunnat={maakuntakunnat}
                      maakunnat={maakunnat}
                      valtakunnallinenMaarays={valtakunnallinenMaarays}
                      {...props}
                    />
                  )}
                  sectionId={"toimintaalue"}
                  title={intl.formatMessage(
                    education.opetustaAntavatKunnat
                  )}></FormSection>

                <FormSection
                  code={3}
                  render={props => (
                    <Opetuskieli
                      changeObjects={state.changeObjects.opetuskielet}
                      ensisijaisetOpetuskieletOPH={ensisijaisetOpetuskieletOPH}
                      lisatiedot={lisatiedot}
                      toissijaisetOpetuskieletOPH={toissijaisetOpetuskieletOPH}
                      {...props}
                    />
                  )}
                  sectionId={"opetuskielet"}
                  title={intl.formatMessage(common.opetuskieli)}></FormSection>

                <FormSection
                  code={4}
                  render={props => (
                    <OpetuksenJarjestamismuoto
                      lisatiedot={lisatiedot}
                      opetuksenJarjestamismuodot={opetuksenJarjestamismuodot}
                      {...props}
                    />
                  )}
                  sectionId={"opetuksenJarjestamismuodot"}
                  title={intl.formatMessage(
                    education.opetuksenJarjestamismuoto
                  )}></FormSection>

                <FormSection
                  code={5}
                  render={props => (
                    <ErityisetKoulutustehtavat
                      poErityisetKoulutustehtavat={poErityisetKoulutustehtavat}
                      lisatiedot={lisatiedot}
                      {...props}
                    />
                  )}
                  sectionId={"erityisetKoulutustehtavat"}
                  title={"Erityinen koulutustehtävä"}></FormSection>

                <FormSection
                  code={6}
                  render={props => (
                    <Opiskelijamaarat
                      lisatiedot={lisatiedot}
                      changeObjects={state.changeObjects.opiskelijamaarat}
                      {...props}
                    />
                  )}
                  sectionId={"opiskelijamaarat"}
                  title={intl.formatMessage(
                    education.oppilasOpiskelijamaarat
                  )}></FormSection>

                <FormSection
                  code={7}
                  render={props => (
                    <MuutEhdot
                      lisatiedot={lisatiedot}
                      poMuutEhdot={poMuutEhdot}
                      {...props}
                    />
                  )}
                  sectionId={"muutEhdot"}
                  title={intl.formatMessage(
                    education.muutEhdotTitle
                  )}></FormSection>
              </form>
            </div>
          </DialogContentWithStyles>
          <div className="fixed w-full bg-gray-100 border-t border-gray-300 bottom-0">
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
          </div>
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
  lisatiedot: PropTypes.array,
  lupa: PropTypes.object,
  lupaKohteet: PropTypes.object,
  maakunnat: PropTypes.array,
  maakuntakunnat: PropTypes.array,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  onNewDocSave: PropTypes.func,
  opetuskielet: PropTypes.array,
  opetustehtavakoodisto: PropTypes.object,
  organisation: PropTypes.object,
  poErityisetKoulutustehtavat: PropTypes.array,
  poMuutEhdot: PropTypes.array,
  tutkinnot: PropTypes.array
};

export default UusiAsiaDialog;
