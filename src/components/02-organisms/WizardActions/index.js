import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { useIntl } from "react-intl";
import wizardMessages from "i18n/definitions/wizard";
import SimpleButton from "components/00-atoms/SimpleButton";
import { WizardBottom } from "components/03-templates/Jarjestaja/MuutospyyntoWizardComponents";

const isDebugOn = process.env.REACT_APP_DEBUG === "true";

const defaultProps = {
  isPreviewModeOn: false,
  isSavingEnabled: false
};

const WizardActions = ({
  isPreviewModeOn = defaultProps.isPreviewModeOn,
  isSavingEnabled = defaultProps.isSavingEnabled,
  onClose,
  onPreview,
  onSave
}) => {
  const { formatMessage } = useIntl();

  return (
    <WizardBottom>
      <div
        className={`flex flex-col md:flex-row justify-between ${
          isDebugOn ? "w-2/3" : "w-full"
        }  max-w-5xl p-4 mx-auto`}
      >
        <div className="inline-flex">
          <div className="inline-flex mr-4">
            <Button
              color="secondary"
              className="save"
              onClick={onClose}
              variant="outlined"
            >
              {formatMessage(wizardMessages.getOut)}
            </Button>
          </div>
          <Button
            color="secondary"
            className="preview"
            onClick={onPreview}
            variant="outlined"
          >
            {isPreviewModeOn
              ? formatMessage(wizardMessages.closePreview)
              : formatMessage(wizardMessages.previewAndPrint)}
          </Button>
        </div>
        <SimpleButton
          color="primary"
          isDisabled={!isSavingEnabled}
          className="button-right save"
          onClick={onSave}
          text={formatMessage(wizardMessages.saveDraft)}
        />
      </div>
    </WizardBottom>
  );
};

WizardActions.propTypes = {
  // Default: false
  isPreviewModeOn: PropTypes.bool,
  // Default: false
  isSavingEnabled: PropTypes.bool,
  // Will be called when user wants to close the dialog
  onClose: PropTypes.func,
  // Function will be called when user wants to see a preview of the current document
  onPreview: PropTypes.func.isRequired,
  // Function will be called when the saving button has been clicked
  onSave: PropTypes.func.isRequired
};

export default WizardActions;
