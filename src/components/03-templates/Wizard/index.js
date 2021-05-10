import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from "react";
import ConfirmDialog from "components/02-organisms/ConfirmDialog/index";
import OrganisationInfo from "components/02-organisms/OrganisationInfo/index";
import { withStyles } from "@material-ui/styles";
import { assocPath, isEmpty, isNil, map, reject } from "ramda";
import DialogTitle from "components/02-organisms/DialogTitle/index";
import { DialogContent, Dialog, Typography } from "@material-ui/core";
import {
  useChangeObjects,
  useUnderRemovalChangeObjects,
  useUnsavedChangeObjects
} from "stores/muutokset";
import { useIntl } from "react-intl";
import { useHistory, useParams } from "react-router-dom";
import SimpleButton from "components/00-atoms/SimpleButton/index";
import wizard from "i18n/definitions/wizard";
import StepperNavigation from "components/01-molecules/Stepper/index";
import common from "i18n/definitions/common";
import { useMuutospyynto } from "stores/muutospyynto";
import PropTypes from "prop-types";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/app-routes";
import { FIELDS } from "locales/uusiHakemusFormConstants";
import Button from "@material-ui/core/Button";

const isDebugOn = process.env.REACT_APP_DEBUG === "true";

const DialogContentWithStyles = withStyles(() => ({
  root: {
    backgroundColor: "#ffffff",
    padding: 0
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

export const Wizard = ({
  isSaving,
  koulutusmuoto,
  onAction,
  organisation,
  page1,
  page2,
  page3,
  page4,
  steps,
  tila,
  title,
  urlOnClose
}) => {
  const intl = useIntl();
  const params = useParams();
  let history = useHistory();
  let { id, page: pageParam, uuid } = params;

  const [page, setPage] = useState();

  useEffect(() => {
    setPage(pageParam ? parseInt(pageParam, 10) : 1);
  }, [pageParam]);

  const [{ isPreviewModeOn }] = useChangeObjects();
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [unsavedChangeObjects] = useUnsavedChangeObjects();
  const [underRemovalChangeObjects] = useUnderRemovalChangeObjects();
  const [, muutospyyntoActions] = useMuutospyynto();

  const [scrollMemory, setScrollMemory] = useState();

  const DialogTitleWithStyles = withStyles(() => ({
    root: {
      backgroundColor:
        tila === FIELDS.TILA.VALUES.KORJAUKSESSA ? "#B66011" : "#c8dcc3",
      color: tila === FIELDS.TILA.VALUES.KORJAUKSESSA ? "#ffffff" : "#000000",
      paddingBottom: "1rem",
      paddingTop: "1rem",
      width: "100%"
    }
  }))(props => {
    return <DialogTitle {...props}>{props.children}</DialogTitle>;
  });

  const getScrollElementAndPosition = useMemo(() => {
    const rootElement = document.querySelector("div.MuiDialogContent-root");
    if (rootElement) {
      const innerElement = document.querySelector("div[attr='inner-scroll']");
      const initialHeight = 243; // MuiDialogTitle-root height + MuiTypography-root height + MuiTypography-h2 height
      if (isPreviewModeOn) {
        if (window.innerWidth > 1599) {
          rootElement.scrollTop = 183; // MuiDialogTitle-root height + MuiTypography-root height
          setScrollMemory(rootElement.scrollTop - initialHeight);
          return innerElement;
        } else {
          setScrollMemory(rootElement.scrollTop);
        }
      } else if (window.innerWidth > 1599) {
        setScrollMemory(innerElement.scrollTop + initialHeight);
      }
      return rootElement;
    }
    return undefined;
  }, [isPreviewModeOn]);

  useLayoutEffect(() => {
    const elem = getScrollElementAndPosition;
    if (elem) {
      elem.scrollTo({ top: scrollMemory, behavior: "instant" });
    }
  }, [getScrollElementAndPosition, isPreviewModeOn, scrollMemory]);

  /**
   * User is redirected to the following path when the form is closed.
   */
  const closeWizard = useCallback(async () => {
    setIsDialogOpen(false);
    setIsConfirmDialogVisible(false);
    // Let's empty some store content on close.
    muutospyyntoActions.reset();
    return history.push(urlOnClose);
  }, [history, muutospyyntoActions, urlOnClose]);

  const hasUnsavedChanges = unsavedChangeObjects
    ? !isEmpty(unsavedChangeObjects)
    : false;

  const hasChangesUnderRemoval = underRemovalChangeObjects
    ? !isEmpty(underRemovalChangeObjects)
    : false;

  const isSavingEnabled =
    !isSaving && (hasUnsavedChanges || hasChangesUnderRemoval);

  function handleCancel() {
    setIsConfirmDialogVisible(false);
  }

  const handleStep = useCallback(
    pageNumber => {
      history.push(
        localizeRouteKey(
          intl.locale,
          uuid ? AppRoute.Hakemus : AppRoute.UusiHakemus,
          intl.formatMessage,
          {
            id,
            koulutusmuoto: koulutusmuoto.kebabCase,
            language: "fi",
            page: pageNumber,
            uuid
          }
        )
      );
    },
    [id, intl.formatMessage, intl.locale, history, koulutusmuoto, uuid]
  );

  const leaveOrOpenCancelModal = () => {
    !isEmpty(unsavedChangeObjects)
      ? setIsConfirmDialogVisible(true)
      : history.push(urlOnClose);
  };

  const previews = map(
    assocPath(["props", "isPreviewModeOn"], true),
    reject(isNil, {
      page1,
      page2,
      page3,
      page4
    })
  );

  return (
    <div className="max-w-7xl">
      <FormDialog
        open={isDialogOpen}
        onClose={leaveOrOpenCancelModal}
        maxWidth={"lg"}
        fullScreen={true}
        aria-labelledby="simple-dialog-title">
        <div
          className={`${
            isPreviewModeOn ? "w-full xxl:w-1/2" : "w-full m-auto"
          }`}>
          <DialogTitleWithStyles id="customized-dialog-title">
            <div className="flex items-baseline">
              <div className="flex-1 text-lg font-normal">{title}</div>
              <div>
                <SimpleButton
                  buttonStyles={
                    tila === FIELDS.TILA.VALUES.KORJAUKSESSA
                      ? { color: "#ffffff" }
                      : {}
                  }
                  text={`${intl.formatMessage(wizard.getOut)} X`}
                  onClick={leaveOrOpenCancelModal}
                  variant={"text"}
                />
              </div>
            </div>
          </DialogTitleWithStyles>
        </div>
        <DialogContentWithStyles>
          <div
            className={`grid ${isPreviewModeOn ? "xxl:w-1/2" : "grid-cols-2"}`}>
            {steps && (
              <div className="bg-white fixed col-span-2 px-8 xxl:px-0 w-full z-10 shadow-xl">
                <div className="flex justify-center max-w-7xl w-4/5 m-auto">
                  <StepperNavigation
                    activeStep={page - 1}
                    stepProps={steps}
                    handleStepChange={handleStep}
                  />
                </div>
              </div>
            )}
            <div className={`${isPreviewModeOn ? "" : "col-span-2"}`}>
              {!steps && (
                <OrganisationInfo
                  isPreviewModeOn={isPreviewModeOn}
                  organisation={organisation}
                />
              )}
              <section
                className={`px-8 xxl:px-0 pb-32 ${
                  isPreviewModeOn
                    ? "border-r border-gray-300"
                    : "max-w-7xl m-auto"
                } ${steps ? "pt-20" : ""}`}>
                <div
                  className={`${
                    isPreviewModeOn ? "px-8" : ""
                  } pt-8 border-b border-gray-300`}>
                  <Typography component="h2" variant="h2">
                    {intl.formatMessage(common.decisionDetails)}
                  </Typography>
                </div>
                <div
                  attr="inner-scroll"
                  className={`${
                    isPreviewModeOn ? "px-8 overflow-auto" : "pb-32"
                  }`}>
                  {page === 1 && page1}
                  {page === 2 && page2}
                  {page === 3 && page3}
                  {page === 4 && page4}
                </div>
              </section>
            </div>
            {isPreviewModeOn ? (
              <div
                className={`h-screen overflow-auto fixed z-10 ${
                  isPreviewModeOn ? "w-full xxl:w-1/2 bg-white" : "w-full"
                } right-0 w-1/2 top-0 border-l-2`}>
                <section
                  className={`w-full overflow-auto ${
                    isPreviewModeOn ? "border-l border-gray-300" : ""
                  }`}>
                  <div className="border-b border-gray-300 px-6 pt-2">
                    <Typography component="h2" variant="h2">
                      {intl.formatMessage(common.esikatselu)}
                    </Typography>
                  </div>
                  <div className="pt-6 px-6 pb-32 overflow-auto">
                    {page === 1 && previews.page1}
                    {page === 2 && previews.page2}
                    {page === 3 && previews.page3}
                    {page === 4 && previews.page4}
                  </div>
                </section>
              </div>
            ) : null}
          </div>
          <div
            className={`z-10 ${
              isPreviewModeOn ? "w-full px-8 xxl:w-1/2" : "w-full"
            } fixed bottom-0 bg-gray-100 border-t-2 border-gray-200 ${
              isDebugOn ? "w-2/3" : ""
            } py-4 mx-auto`}>
            <div
              className={`flex justify-between px-8 xxl:px-0 max-w-7xl m-auto`}>
              <div className={`inline-flex ${isPreviewModeOn ? "m-auto" : ""}`}>
                <div
                  className={`inline-flex mr-4 ${
                    isPreviewModeOn ? "hidden xxl:block" : ""
                  }`}>
                  <Button
                    color="secondary"
                    className="save"
                    onClick={leaveOrOpenCancelModal}
                    variant="outlined">
                    {intl.formatMessage(wizard.getOut)}
                  </Button>
                </div>
                <Button
                  color="secondary"
                  className="preview"
                  onClick={() => onAction("preview")}
                  variant="outlined">
                  {isPreviewModeOn
                    ? intl.formatMessage(wizard.closePreview)
                    : intl.formatMessage(wizard.previewAndPrint)}
                </Button>
              </div>
              <div className={isPreviewModeOn ? "hidden xxl:block" : ""}>
                <SimpleButton
                  color="primary"
                  isDisabled={!isSavingEnabled}
                  className="button-right save"
                  onClick={() => onAction("save", false, tila)}
                  text={intl.formatMessage(wizard.saveDraft)}
                />
              </div>
            </div>
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
          await onAction("save", false, tila);
          closeWizard();
        }}
        handleCancel={handleCancel}
        handleExitAndAbandonChanges={closeWizard}
      />
    </div>
  );
};

Wizard.propTypes = {
  children: PropTypes.object,
  isSaving: PropTypes.bool,
  koulutusmuoto: PropTypes.object,
  onAction: PropTypes.func,
  organisation: PropTypes.object,
  page1: PropTypes.object,
  page2: PropTypes.object,
  page3: PropTypes.object,
  page4: PropTypes.object,
  steps: PropTypes.array,
  tila: PropTypes.string,
  title: PropTypes.string,
  urlOnClose: PropTypes.string
};
