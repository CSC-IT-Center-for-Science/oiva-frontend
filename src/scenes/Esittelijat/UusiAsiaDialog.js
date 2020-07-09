import React, {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect
} from "react";
import { useChangeObjects } from "../../stores/changeObjects";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import * as R from "ramda";
import { mapObjIndexed, prop, sortBy } from "ramda";
import { useKoulutukset } from "../../stores/koulutukset";
import DialogTitle from "okm-frontend-components/dist/components/02-organisms/DialogTitle";
import ConfirmDialog from "okm-frontend-components/dist/components/02-organisms/ConfirmDialog";
import wizardMessages from "../../i18n/definitions/wizard";
import { withStyles } from "@material-ui/styles";
import { DialogContent, Dialog } from "@material-ui/core";
import EsittelijatWizardActions from "./EsittelijatWizardActions";
import EsittelijatMuutospyynto from "./EsittelijatMuutospyynto";
import { useHistory, useParams } from "react-router-dom";
import SimpleButton from "okm-frontend-components/dist/components/00-atoms/SimpleButton";
import { createObjectToSave } from "../../services/muutoshakemus/utils/saving";
import { createMuutospyyntoOutput } from "../../services/muutoshakemus/utils/common";
import { findObjectWithKey } from "../../utils/common";
import ProcedureHandler from "../../components/02-organisms/procedureHandler";
import Lomake from "../../components/02-organisms/Lomake";
import { getRules } from "../../services/lomakkeet/esittelija/rules";
import { useMuutospyynto } from "../../stores/muutospyynto";
import common from "../../i18n/definitions/common";

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
  tutkinnot: {}
};

const UusiAsiaDialog = React.memo(
  ({
    kielet = defaultProps.kielet,
    kohteet = defaultProps.kohteet,
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
    opetuskielet = defaultProps.opetuskielet,
    organisation = defaultProps.organisation,
    tutkinnot = defaultProps.tutkinnot
  }) => {
    const intl = useIntl();
    let history = useHistory();
    const params = useParams();
    const [cos, coActions] = useChangeObjects(); // cos means change objects
    const [koulutukset] = useKoulutukset();
    const [, muutospyyntoActions] = useMuutospyynto();

    const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
    const [isSavingEnabled, setIsSavingEnabled] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(true);

    let { uuid } = params;

    const organisationPhoneNumber = R.head(
      R.values(R.find(R.prop("numero"), organisation.yhteystiedot))
    );

    const organisationEmail = R.head(
      R.values(R.find(R.prop("email"), organisation.yhteystiedot))
    );

    const organisationWebsite = R.head(
      R.values(R.find(R.prop("www"), organisation.yhteystiedot))
    );

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
      setIsDialogOpen(false);
      setIsConfirmDialogVisible(false);
      // Let's empty some store content on close.
      const procedureHandler = new ProcedureHandler();
      procedureHandler.run("muutospyynto.muutokset.poista", [coActions]);
      muutospyyntoActions.reset();
      return history.push(`/asiat?force=true`);
    }, [coActions, history, muutospyyntoActions]);

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
        "muutospyynto.tallennus.tallennaEsittelijanToimesta",
        [formData]
      );
      return outputs.muutospyynto.tallennus.tallennaEsittelijanToimesta.output
        .result;
    }, []);

    const onAction = useCallback(
      async (action, fromDialog = false) => {
        const formData = createMuutospyyntoOutput(
          await createObjectToSave(
            R.toUpper(intl.locale),
            lupa,
            cos,
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

        /**
         * The form is saved and the requested action is run. Let's disable the
         * save button. It will be enabled after new changes.
         */
        setIsSavingEnabled(false);
        prevAnchorsRef.current = anchors;

        if (!uuid && !fromDialog) {
          if (muutospyynto && muutospyynto.uuid) {
            // It was the first save...
            onNewDocSave(muutospyynto);
          }
        }
      },
      [
        anchors,
        cos,
        kohteet,
        intl.locale,
        lupa,
        lupaKohteet,
        maaraystyypit,
        muut,
        onNewDocSave,
        onPreview,
        onSave,
        uuid
      ]
    );

    return (
      <div className="max-w-7xl">
        <FormDialog
          open={isDialogOpen}
          onClose={openCancelModal}
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
                    onClick={openCancelModal}
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
                      <a href={`tel:${organisationPhoneNumber}`}>
                        {organisationPhoneNumber}
                      </a>{" "}
                      |{" "}
                    </React.Fragment>
                  )}
                  {organisationPhoneNumber && (
                    <React.Fragment>
                      <a href={`mailto:${organisationEmail}`}>
                        {organisationEmail}
                      </a>{" "}
                      |{" "}
                    </React.Fragment>
                  )}
                  {organisation.ytunnus} |{" "}
                  {organisationWebsite && (
                    <a href={organisationWebsite}>{organisationWebsite}</a>
                  )}
                </p>
              </div>
            </div>
            <div
              id="wizard-content"
              className="px-16 xl:w-3/4 max-w-7xl m-auto mb-20">
              <div className="w-1/3" style={{ marginLeft: "-2rem" }}>
                <Lomake
                  anchor="topthree"
                  changeObjects={cos.topthree}
                  onChangesUpdate={payload =>
                    onSectionChangesUpdate(payload.anchor, payload.changes)
                  }
                  path={["esittelija", "topThree"]}
                  rules={getRules()}></Lomake>
              </div>
              <EsittelijatMuutospyynto
                kielet={kielet}
                kohteet={kohteet}
                koulutukset={parsedKoulutukset}
                koulutusalat={koulutusalat}
                koulutustyypit={koulutustyypit}
                kunnat={kunnat}
                maakuntakunnat={maakuntakunnat}
                maakunnat={maakunnat}
                lupa={lupa}
                lupaKohteet={lupaKohteet}
                maaraystyypit={maaraystyypit}
                muut={muut}
                onChangesUpdate={onSectionChangesUpdate}
                opetuskielet={opetuskielet}
                tutkinnot={tutkinnot}
              />
              <EsittelijatWizardActions
                isSavingEnabled={isSavingEnabled}
                onClose={openCancelModal}
                onPreview={() => {
                  return onAction("preview");
                }}
                onSave={() => {
                  return onAction("save");
                }}
              />
            </div>
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
    );
  },
  (cp, np) => {
    return (
      R.equals(cp.koulutusalat, np.koulutusalat) &&
      R.equals(cp.koulutustyypit, np.koulutustyypit) &&
      R.equals(cp.lupa, np.lupa) &&
      R.equals(cp.muut, np.muut) &&
      R.equals(cp.tutkinnot, np.tutkinnot)
    );
  }
);

UusiAsiaDialog.propTypes = {
  history: PropTypes.object,
  kielet: PropTypes.array,
  koulutusalat: PropTypes.array,
  koulutustyypit: PropTypes.array,
  kunnat: PropTypes.array,
  lupa: PropTypes.object,
  lupKohteet: PropTypes.object,
  maakunnat: PropTypes.array,
  maakuntakunnat: PropTypes.array,
  maaraystyypit: PropTypes.array,
  muut: PropTypes.array,
  onNewDocSave: PropTypes.func,
  opetuskielet: PropTypes.array,
  organisation: PropTypes.object,
  tutkinnot: PropTypes.array
};

export default UusiAsiaDialog;
