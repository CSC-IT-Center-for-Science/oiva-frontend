import React from "react";
import PropTypes from "prop-types";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "../DialogTitle";
import "../../../css/tailwind.css";
import CircularProgress from "@material-ui/core/CircularProgress";

const ConfirmDialog = props => {
  const {
    isConfirmDialogVisible = false,
    handleOk,
    handleCancel,
    handleExitAndAbandonChanges,
    onClose,
    messages,
    loadingSpinner = false
  } = props;

  return (
    <Dialog
      open={isConfirmDialogVisible}
      fullWidth={true}
      aria-labelledby="confirm-dialog"
      maxWidth="sm">
      <DialogTitle id="confirm-dialog" onClose={onClose}>
        {messages.title}
      </DialogTitle>
      <DialogContent>
        <div className="p-2">{messages.content}</div>
      </DialogContent>
      <DialogActions>
        <div className="flex pr-6 pb-4">
          <div className="mr-4">
            <Button onClick={handleCancel} color="primary" variant="outlined">
              {messages.cancel}
            </Button>
          </div>
          {!!handleExitAndAbandonChanges &&
            <div className="mr-4">
              <Button onClick={handleExitAndAbandonChanges} color="primary" variant="outlined">
                {messages.noSave}
              </Button>
            </div>
          }
          <Button onClick={handleOk} color="primary" variant="contained" disabled={loadingSpinner}>
            {
              loadingSpinner ?
                <CircularProgress size={20}/> :
                messages.ok
            }
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  isConfirmDialogVisible: PropTypes.bool,
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func,
  handleExitAndAbandonChanges: PropTypes.func,
  messages: PropTypes.object,
  loadingSpinner: PropTypes.bool
};

export default ConfirmDialog;
