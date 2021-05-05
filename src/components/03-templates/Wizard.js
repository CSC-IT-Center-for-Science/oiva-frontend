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
import WizardActions from "components/02-organisms/WizardActions/index";
import common from "i18n/definitions/common";
import { useMuutospyynto } from "stores/muutospyynto";
import PropTypes from "prop-types";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/app-routes";
import { FIELDS } from "locales/uusiHakemusFormConstants";

const isDebugOn = process.env.REACT_APP_DEBUG === "true";

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
        aria-labelledby="simple-dialog-title"
      >
        <div className={"w-full m-auto"}>
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
          <OrganisationInfo
            isPreviewModeOn={isPreviewModeOn}
            organisation={organisation}
          />
          <div className="w-full xxl:w-4/5 xxl:max-w-9/10 m-auto mb-32">
            {!isEmpty(organisation) ? (
              <div
                id="wizard-content"
                className={`mx-auto ${isPreviewModeOn ? "" : "max-w-7xl"}`}
              >
                <div className={isPreviewModeOn ? "" : "max-w-7xl mx-auto"}>
                  {steps && (
                    <div className="px-8 xxl:px-0">
                      <StepperNavigation
                        activeStep={page - 1}
                        stepProps={steps}
                        handleStepChange={handleStep}
                      />
                    </div>
                  )}
                  <div className="flex">
                    <div
                      className={`${
                        isPreviewModeOn ? "hidden xxl:block" : ""
                      } flex-1`}
                      style={{
                        transform: "translate3d(0, 0, 0)",
                        height: isPreviewModeOn ? "100vh" : "84vh"
                      }}
                    >
                      <section
                        className={`px-8 xxl:px-0 pb-32 fixed w-full ${
                          isPreviewModeOn ? "border-r border-gray-300" : ""
                        }`}
                      >
                        <div className={`border-b border-gray-300`}>
                          <Typography component="h2" variant="h2">
                            {intl.formatMessage(common.decisionDetails)}
                          </Typography>
                        </div>
                        <div
                          attr="inner-scroll"
                          className={`${
                            isPreviewModeOn ? "overflow-auto" : "pb-32"
                          }`}
                          style={{ height: isPreviewModeOn ? "86vh" : "auto" }}
                        >
                          {page === 1 && page1}
                          {page === 2 && page2}
                          {page === 3 && page3}
                          {page === 4 && page4}
                        </div>
                      </section>
                    </div>
                    {isPreviewModeOn ? (
                      <div
                        className="flex-1"
                        style={{
                          transform: "translate3d(0, 0, 0)",
                          height: "100vh"
                        }}
                      >
                        <section
                          className={`fixed w-full ${
                            isPreviewModeOn ? "border-l border-gray-300" : ""
                          }`}
                        >
                          <div className="border-b border-gray-300 px-6">
                            <Typography component="h2" variant="h2">
                              {intl.formatMessage(common.esikatselu)}
                            </Typography>
                          </div>
                          <div
                            className="pt-6 px-6 pb-32 overflow-auto"
                            style={{
                              height: isPreviewModeOn ? "86vh" : "auto"
                            }}
                          >
                            {page === 1 && previews.page1}
                            {page === 2 && previews.page2}
                            {page === 3 && previews.page3}
                            {page === 4 && previews.page4}
                          </div>
                        </section>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <WizardActions
            isPreviewModeOn={isPreviewModeOn}
            isSavingEnabled={isSavingEnabled}
            onClose={leaveOrOpenCancelModal}
            onPreview={() => {
              return onAction("preview");
            }}
            onSave={() => {
              return onAction("save", false, tila);
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
  page1: PropTypes.object
};
