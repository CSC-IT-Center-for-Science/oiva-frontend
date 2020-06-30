import React, { useState } from "react";
import { WizardBottom } from "./MuutospyyntoWizardComponents";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { useIntl } from "react-intl";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import ConfirmDialog from "okm-frontend-components/dist/components/02-organisms/ConfirmDialog";
import { ROLE_NIMENKIRJOITTAJA } from "../../../../../../modules/constants";
import { useMuutospyynto } from "../../../../../../stores/muutospyynto";
import { path } from "ramda";
import common from "../../../../../../i18n/definitions/common";

const isDebugOn = process.env.REACT_APP_DEBUG === "true";

const WizardActions = props => {
  const intl = useIntl();
  const [muutospyynto] = useMuutospyynto();
  const [isConfirmDialogVisible, setConfirmDialogVisible] = useState(false);

  const onPrevClick = () => {
    props.onPrev(props.pageNumber);
  };

  const onNextClick = () => {
    props.onNext(props.pageNumber);
  };

  const onSendClick = () => {
    props.onSend();
  };

  const handleCancel = () => {
    setConfirmDialogVisible(false);
  };

  const handleOk = () => {
    setConfirmDialogVisible(false);
    onSendClick();
  };

  return (
    <WizardBottom>
      <ConfirmDialog
        isConfirmDialogVisible={isConfirmDialogVisible}
        messages={{
          content: intl.formatMessage(common.confirmSendMuutoshakemus),
          ok: intl.formatMessage(common.yes),
          cancel: intl.formatMessage(common.no),
          title: intl.formatMessage(common.confirmSendMuutoshakemusTitle)
        }}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
      <div
        className={`flex flex-col md:flex-row justify-between ${
          isDebugOn ? "w-2/3" : "w-full"
        }  max-w-5xl p-4 mx-auto`}>
        <div className="flex flex-col md:w-48">
          <Button
            color="secondary"
            variant="outlined"
            className={`previous button-left ${
              !props.onPrev ? "invisible h-0" : ""
            }`}
            onClick={onPrevClick}>
            {intl.formatMessage(wizardMessages.previous)}
          </Button>
        </div>
        <div className="flex flex-col md:flex-row justify-between md:w-5/12 xl:w-2/6">
          <Button
            color="secondary"
            disabled={!props.isSavingEnabled}
            className="save"
            onClick={props.onSave}>
            {intl.formatMessage(wizardMessages.saveDraft)}
          </Button>
          <Button
            color="secondary"
            className="preview"
            onClick={props.onPreview}>
            {intl.formatMessage(wizardMessages.preview)}
          </Button>
        </div>
        <div className="flex flex-col md:w-48 md:flex-row-reverse">
          {sessionStorage.getItem("role") === ROLE_NIMENKIRJOITTAJA &&
            !props.onNext && (
              <Button
                color="primary"
                disabled={path(["data", "tila"], muutospyynto) === "AVOIN"}
                variant="contained"
                className={`next button-right`}
                onClick={() => setConfirmDialogVisible(true)}>
                {intl.formatMessage(wizardMessages.send)}
              </Button>
            )}
          {props.onNext && (
            <Button
              color="secondary"
              variant="outlined"
              className={`next button-right`}
              onClick={onNextClick}>
              {intl.formatMessage(wizardMessages.next)}
            </Button>
          )}
        </div>
      </div>
    </WizardBottom>
  );
};

WizardActions.propTypes = {
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  pageNumber: PropTypes.number,
  isSavingEnabled: PropTypes.bool,
  save: PropTypes.func
};

export default WizardActions;
