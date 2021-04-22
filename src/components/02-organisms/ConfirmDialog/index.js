import React from "react";
import PropTypes from "prop-types";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "../DialogTitle/index";
import "../../../css/tailwind.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  }
}))(MuiDialogActions);

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
      maxWidth="sm"
      className="min-w-64"
    >
      <DialogTitle id="confirm-dialog" onClose={onClose}>
        <span className="mr-12">{messages.title}</span>
      </DialogTitle>
      <DialogContent>
        <div className="py-2 px-8">{messages.content}</div>
      </DialogContent>
      <DialogActions>
        <div className="flex flex-col sm:flex-row flex-grow sm:flex-grow-0">
          <Button
            onClick={handleCancel}
            color="primary"
            variant="outlined"
            className="mb-4" // sm:mr-4 ei toimi, koska se ylikirjoittuu
          >
            {messages.cancel}
          </Button>
          {!!handleExitAndAbandonChanges && (
            <Button
              onClick={handleExitAndAbandonChanges}
              color="primary"
              variant="outlined"
            >
              {messages.noSave}
            </Button>
          )}
          <Button
            onClick={handleOk}
            color="primary"
            variant="contained"
            disabled={loadingSpinner}
          >
            {loadingSpinner ? <CircularProgress size={20} /> : messages.ok}
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
