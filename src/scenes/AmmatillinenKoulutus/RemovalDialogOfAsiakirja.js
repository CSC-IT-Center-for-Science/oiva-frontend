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

const RemovalDialogOfAsiakirja = ({ isVisible, onClose, onOK, removeAsia }) => {
  const intl = useIntl();

  return (
    <Dialog
      open={isVisible}
      aria-labelledby="simple-dialog-title"
      PaperProps={{ style: { overflowY: "visible" } }}>
      <DialogTitle id="customized-dialog-title" onClose={onClose}>
        {removeAsia
          ? intl.formatMessage(common.titleOfPoistetaankoKokoAsia)
          : intl.formatMessage(common.titleOfPoistetaankoAsiakirja)}
      </DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <p>
          {removeAsia
            ? intl.formatMessage(common.poistetaankoKokoAsia)
            : intl.formatMessage(common.poistetaankoAsiakirja)}
        </p>
      </DialogContent>
      <DialogActions>
        <div className="flex pr-6 pb-4">
          <div className="mr-4">
            <Button onClick={onClose} color="primary" variant="outlined">
              {intl.formatMessage(common.doNotRemove)}
            </Button>
          </div>
          <Button
            onClick={() => {
              return onOK();
            }}
            color="primary"
            variant="contained">
            {intl.formatMessage(common.poista)}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

RemovalDialogOfAsiakirja.propTypes = {
  // Boolean that tells if the dialog is open or closed.
  isVisible: PropTypes.bool,
  // Function that will be called when the dialog is going to be closed / hided.
  onOK: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  removeAsia: PropTypes.bool
};

export default RemovalDialogOfAsiakirja;
