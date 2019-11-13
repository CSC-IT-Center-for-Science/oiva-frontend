import React, {useState} from "react";
import {
  WizardBottom,
} from "./MuutospyyntoWizardComponents";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { injectIntl } from "react-intl";
import wizardMessages from "../../../../../../i18n/definitions/wizard";
import {HAKEMUS_VIESTI} from "../modules/uusiHakemusFormConstants";
import ConfirmDialog from "../../../../../../components/02-organisms/ConfirmDialog";

const WizardActions = props => {
  const [isConfirmDialogVisible, setConfirmDialogVisible] = useState(false);

  const onPrevClick = () => {
    props.onPrev(props.pageNumber);
  };

  const onNextClick = () => {
    props.onNext(props.pageNumber);
  };

  const onSaveClick = () => {
    props.onSave(false);
  };

  const onPreviewClick  = () => {
    props.onSave(true);
  };

  const handleCancel = () => {
    setConfirmDialogVisible(false);
  }

  const handleOk = () => {
    onSaveClick();
    setConfirmDialogVisible(false);
  }

  const {
    intl: { formatMessage }
  } = props;

  return (
    <WizardBottom>
      <ConfirmDialog
        isConfirmDialogVisible={isConfirmDialogVisible}
        title={HAKEMUS_VIESTI.VARMISTUS_LÄHETÄ_HEADER.FI}
        content={HAKEMUS_VIESTI.VARMISTUS_LÄHETÄ.FI}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
      <div className="flex flex-col md:flex-row justify-between w-full max-w-5xl p-4 mx-auto">
        <div className="flex flex-col md:w-48">
          <Button
            color="secondary"
            variant="outlined"
            className={`previous button-left ${
              !props.onPrev ? "invisible h-0" : ""
              }`}
            onClick={onPrevClick}
          >
            {formatMessage(wizardMessages.previous)}
          </Button>
        </div>
        <div className="flex flex-col md:flex-row justify-between md:w-5/12 xl:w-2/6">
          <Button
            color="secondary"
            disabled={!props.isSavingEnabled}
            onClick={onSaveClick}
          >
            {formatMessage(wizardMessages.saveDraft)}
          </Button>
          <Button
            color="secondary"
            onClick={onPreviewClick}
          >
            {formatMessage(wizardMessages.preview)}
          </Button>
        </div>
        <div className="flex flex-col md:w-48 md:flex-row-reverse">
          <Button
            color={props.onNext ?
              "secondary"
              :
              "primary"
            }
            variant={props.onNext ?
              "outlined"
              :
              "contained"
            }
            className={`next button-right`}
            onClick={props.onNext ?
              onNextClick
              :
              () => setConfirmDialogVisible(true) // todo: Lähetä
            }
          >
            {props.onNext ?
              formatMessage(wizardMessages.next)
              :
              formatMessage(wizardMessages.send)
            }
          </Button>
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

export default injectIntl(WizardActions);
