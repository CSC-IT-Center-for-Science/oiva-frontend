import React, { useCallback, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import ConfirmDialog from "components/02-organisms/ConfirmDialog";
import wizardMessages from "i18n/definitions/wizard";
import { withStyles } from "@material-ui/styles";
import { Button, Dialog, DialogContent, Typography } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { createMuutospyyntoOutput } from "services/muutoshakemus/utils/common";
import ProcedureHandler from "components/02-organisms/procedureHandler";
import { useMuutospyynto } from "stores/muutospyynto";
import * as R from "ramda";
import common from "i18n/definitions/common";
import { createObjectToSave } from "../../../saving";
import {
  useChangeObjects,
  useChangeObjectsByAnchorWithoutUnderRemoval,
  useUnderRemovalChangeObjects,
  useUnsavedChangeObjects
} from "stores/muutokset";
import { getSavedChangeObjects } from "helpers/ammatillinenKoulutus/commonUtils";
import SimpleButton from "components/00-atoms/SimpleButton";
import { useValidity } from "stores/lomakedata";
import LupanakymaA from "../../../lupanakymat/LupanakymaA";

const isDebugOn = process.env.REACT_APP_DEBUG === "true";

const DialogContentWithStyles = withStyles(() => ({
  root: {
    backgroundColor: "#ffffff",
    scrollBehavior: "smooth"
  }
}))(props => {
  return (
    <DialogContent {...props} style={{ padding: 0 }}>
      {props.children}
    </DialogContent>
  );
});

const FormDialog = withStyles(() => ({
  paper: {
    background: "#ffffff",
    marginLeft: isDebugOn ? "33%" : 0,
    width: isDebugOn ? "66%" : "100%",
    transform: "translate3d(0, 0, 0)" // Tämä on fixed-asetusta varten
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
  lisatiedot: [],
  lupa: {},
  lupaKohteet: {},
  maakunnat: [],
  maakuntakunnat: [],
  maaraystyypit: [],
  opetuskielet: [],
  opetustehtavakoodisto: {},
  organisation: {},
  tutkinnot: []
};

const UusiAsiaDialog = ({
  kohteet = defaultProps.kohteet,
  kunnat = defaultProps.kunnat,
  lisatiedot = defaultProps.lisatiedot,
  lupa = defaultProps.lupa,
  lupaKohteet = defaultProps.lupaKohteet,
  maakunnat = defaultProps.maakunnat,
  maakuntakunnat = defaultProps.maakuntakunnat,
  maaraystyypit = defaultProps.maaraystyypit,
  onNewDocSave,
  opetustehtavakoodisto = defaultProps.opetustehtavakoodisto,
  organisation = defaultProps.organisation
}) => {
  const [paatoksentiedotCo] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "paatoksentiedot"
  });
  const [toimintaalueCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "toimintaalue"
  });
  const [opetuskieletCO] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "opetuskielet"
  });
  const [opetustehtavatCo] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "opetustehtavat"
  });
  const [
    opetuksenJarjestamismuodotCo
  ] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "opetuksenJarjestamismuodot"
  });
  const [
    erityisetKoulutustehtavatCO
  ] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "erityisetKoulutustehtavat"
  });
  const [opiskelijamaaratCo] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "opiskelijamaarat"
  });
  const [muutEhdotCo] = useChangeObjectsByAnchorWithoutUnderRemoval({
    anchor: "muutEhdot"
  });

  const [{ changeObjects }, { initializeChanges }] = useChangeObjects();

  const intl = useIntl();
  const params = useParams();
  let history = useHistory();
  let { uuid } = params;

  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [isPreviewModeOn, setPreviewMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [unsavedChangeObjects] = useUnsavedChangeObjects();
  const [underRemovalChangeObjects] = useUnderRemovalChangeObjects();
  const [, muutospyyntoActions] = useMuutospyynto();
  const [validity] = useValidity();

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
    return (
      (hasUnsavedChanges || hasChangesUnderRemoval) && validity.paatoksentiedot
    );
  }, [validity, underRemovalChangeObjects, unsavedChangeObjects]);

  /**
   * Opens the preview.
   * @param {object} formData
   */
  const onPreview = useCallback(async () => {
    setPreviewMode(isPreviewModeOn => !isPreviewModeOn);
  }, []);

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
            erityisetKoulutustehtavat: erityisetKoulutustehtavatCO,
            muutEhdot: muutEhdotCo,
            opetuksenJarjestamismuodot: opetuksenJarjestamismuodotCo,
            opetuskielet: opetuskieletCO,
            opetustehtavat: opetustehtavatCo,
            opiskelijamaarat: opiskelijamaaratCo,
            paatoksentiedot: paatoksentiedotCo,
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

      if (action === "save") {
        if (!!muutospyynto && R.prop("uuid", muutospyynto)) {
          if (!uuid && !fromDialog) {
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
      }
    },
    [
      erityisetKoulutustehtavatCO,
      initializeChanges,
      intl.locale,
      kohteet,
      lupa,
      maaraystyypit,
      muutEhdotCo,
      onNewDocSave,
      onPreview,
      onSave,
      opetuksenJarjestamismuodotCo,
      opetuskieletCO,
      opetustehtavatCo,
      opiskelijamaaratCo,
      organisation,
      paatoksentiedotCo,
      toimintaalueCO,
      uuid
    ]
  );

  return (
    changeObjects !== null && (
      <div>
        <FormDialog
          open={isDialogOpen}
          onClose={leaveOrOpenCancelModal}
          maxWidth={"lg"}
          fullScreen={true}
          aria-labelledby="simple-dialog-title">
          {isPreviewModeOn ? null : (
            <div className="flex m-auto items-center w-full px-12 bg-vaalenvihrea">
              <div className="flex-1">
                <Typography component="h2" variant="h2">
                  {intl.formatMessage(
                    wizardMessages.esittelijatMuutospyyntoDialogTitle
                  )}
                </Typography>
              </div>
              <div>
                <SimpleButton
                  text={`${intl.formatMessage(wizardMessages.getOut)} X`}
                  onClick={leaveOrOpenCancelModal}
                  variant={"text"}
                />
              </div>
            </div>
          )}
          <DialogContentWithStyles>
            {isPreviewModeOn ? null : (
              <div className="bg-vaalenharmaa px-16 w-full m-auto mb-4 border-b border-xs border-harmaa">
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
            )}
            <div
              id="wizard-content"
              className={`mx-auto ${
                isPreviewModeOn ? "kk:w-4/5 kkk:w-2/3" : "max-w-7xl"
              }`}>
              <form
                onSubmit={() => {}}
                className={isPreviewModeOn ? "" : "max-w-7xl mx-auto"}>
                <div className="flex">
                  <div
                    className={`${
                      isPreviewModeOn ? "hidden xxl:block" : ""
                    } flex-1`}
                    style={{
                      transform: "translate3d(0, 0, 0)",
                      height: isPreviewModeOn ? "100vh" : "84vh"
                    }}>
                    <section
                      className={`fixed w-full ${
                        isPreviewModeOn ? "border-r border-gray-300" : ""
                      }`}>
                      <div className={`border-b border-gray-300 px-12`}>
                        <Typography component="h2" variant="h2">
                          {intl.formatMessage(common.decisionDetails)}
                        </Typography>
                      </div>
                      <div
                        className={`${
                          isPreviewModeOn ? "overflow-auto" : "pb-32"
                        }`}
                        style={{ height: isPreviewModeOn ? "86vh" : "auto" }}>
                        <LupanakymaA
                          isPreviewModeOn={false}
                          kunnat={kunnat}
                          lisatiedot={lisatiedot}
                          lupakohteet={lupaKohteet}
                          maakunnat={maakunnat}
                          maakuntakunnat={maakuntakunnat}
                          opetustehtavakoodisto={opetustehtavakoodisto}
                          uuid={uuid}
                          valtakunnallinenMaarays={valtakunnallinenMaarays}
                        />
                      </div>
                    </section>
                  </div>
                  {isPreviewModeOn ? (
                    <div
                      className="flex-1"
                      style={{
                        transform: "translate3d(0, 0, 0)",
                        height: "100vh"
                      }}>
                      <section
                        className={`fixed w-full ${
                          isPreviewModeOn ? "border-l border-gray-300" : ""
                        }`}>
                        <div className="border-b border-gray-300 px-12">
                          <Typography component="h2" variant="h2">
                            {intl.formatMessage(common.esikatselu)}
                          </Typography>
                        </div>
                        <div
                          className="p-6 bg-gray-100 overflow-auto"
                          style={{ height: isPreviewModeOn ? "86vh" : "auto" }}>
                          <LupanakymaA
                            isPreviewModeOn={true}
                            kunnat={kunnat}
                            lisatiedot={lisatiedot}
                            lupakohteet={lupaKohteet}
                            maakunnat={maakunnat}
                            maakuntakunnat={maakuntakunnat}
                            opetustehtavakoodisto={opetustehtavakoodisto}
                            valtakunnallinenMaarays={valtakunnallinenMaarays}
                          />
                        </div>
                      </section>
                    </div>
                  ) : null}
                </div>
              </form>
            </div>
          </DialogContentWithStyles>
          <div className="fixed w-full bg-gray-100 border-t border-gray-300 bottom-0">
            <div
              className={`flex flex-col md:flex-row justify-between ${
                isDebugOn ? "w-2/3" : "w-full"
              }  max-w-5xl p-4 mx-auto`}>
              <div className="inline-flex">
                <div className="inline-flex mr-4">
                  {isPreviewModeOn ? null : (
                    <Button
                      color="secondary"
                      className="save"
                      onClick={leaveOrOpenCancelModal}
                      variant="outlined">
                      {intl.formatMessage(wizardMessages.getOut)}
                    </Button>
                  )}
                </div>
                <Button
                  color="secondary"
                  className="preview"
                  onClick={() => {
                    return onAction("preview");
                  }}
                  variant="outlined">
                  {isPreviewModeOn
                    ? intl.formatMessage(wizardMessages.closePreview)
                    : intl.formatMessage(wizardMessages.preview)}
                </Button>
              </div>
              {isPreviewModeOn ? null : (
                <SimpleButton
                  color="primary"
                  disabled={!isSavingEnabled}
                  className="button-right save"
                  onClick={() => {
                    return onAction("save");
                  }}
                  text={intl.formatMessage(wizardMessages.saveDraft)}
                />
              )}
            </div>
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
