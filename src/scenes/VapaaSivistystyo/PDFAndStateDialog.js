import React from "react";
import { PropTypes } from "prop-types";
import { useIntl } from "react-intl";
import DialogTitle from "okm-frontend-components/dist/components/02-organisms/DialogTitle";
import common from "../../i18n/definitions/common";
import {
  DialogContent,
  Dialog,
  DialogActions,
  Button
} from "@material-ui/core";

const PDFAndStateDialog = ({ isVisible, onClose, onOK }) => {
  const intl = useIntl();

  return (
    <Dialog
      open={isVisible}
      aria-labelledby="simple-dialog-title"
      PaperProps={{ style: { overflowY: "visible" } }}>
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        {intl.formatMessage(common.titleOfPDFAndStateDialog)}
      </DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <p>{intl.formatMessage(common.textOfPDFAndStateDialog)}</p>
      </DialogContent>
      <DialogActions>
        <div className="flex pr-6 pb-4">
          <div className="mr-4">
            <Button onClick={onClose} color="primary" variant="outlined">
              {intl.formatMessage(common.cancel)}
            </Button>
          </div>
          <Button
            onClick={() => {
              return onOK();
            }}
            color="primary"
            variant="contained">
            {intl.formatMessage(common.downloadPDFAndChangeState)}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

PDFAndStateDialog.propTypes = {
  // Boolean that tells if the dialog is open or closed.
  isVisible: PropTypes.bool,
  // Function that will be called when the dialog is going to be closed / hided.
  onOK: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PDFAndStateDialog;
