import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { useIntl } from "react-intl";
import wizardMessages from "../../i18n/definitions/wizard";
import SimpleButton from "okm-frontend-components/dist/components/00-atoms/SimpleButton";
import { WizardBottom } from "../Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/components/MuutospyyntoWizardComponents";

const isDebugOn = process.env.REACT_APP_DEBUG === "true";

const EsittelijatWizardActions = ({
  isSavingEnabled = false,
  onClose,
  onPreview,
  onSave
}) => {
  const intl = useIntl();

  return (
    <WizardBottom>
      <div
        className={`flex flex-col md:flex-row justify-between ${
          isDebugOn ? "w-2/3" : "w-full"
        }  max-w-5xl p-4 mx-auto`}>
        <div className="inline-flex">
          <div className="inline-flex mr-4">
            <Button
              color="secondary"
              disabled={!isSavingEnabled}
              className="save"
              onClick={onClose}
              variant="outlined">
              {intl.formatMessage(wizardMessages.getOut)}
            </Button>
          </div>
          <Button
            color="secondary"
            className="preview"
            onClick={onPreview}
            variant="outlined">
            {intl.formatMessage(wizardMessages.previewAndPrint)}
          </Button>
        </div>
        <SimpleButton
          color="primary"
          disabled={!isSavingEnabled}
          className="button-right save"
          onClick={onSave}
          text={intl.formatMessage(wizardMessages.saveDraft)}
        />
      </div>
    </WizardBottom>
  );
};

EsittelijatWizardActions.propTypes = {
  // Default: false
  isSavingEnabled: PropTypes.bool,
  // Will be called when user wants to close the dialog
  onClose: PropTypes.func,
  // Function will be called when user wants to see a preview of the current document
  onPreview: PropTypes.func.isRequired,
  // Function will be called when the saving button has been clicked
  onSave: PropTypes.func.isRequired
};

export default EsittelijatWizardActions;
