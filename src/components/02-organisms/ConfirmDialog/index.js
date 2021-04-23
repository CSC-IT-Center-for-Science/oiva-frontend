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
import { makeStyles } from "@material-ui/core/styles";

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  }
}))(MuiDialogActions);

const useStyles = makeStyles(theme => ({
  paper: { minWidth: "360px" },
  root: {
    minWidth: "300px",
    "& > *:not(:last-child)": {
      marginBottom: "20px",
      [theme.breakpoints.up("sm")]: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(0)
      }
    }
  }
}));

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

  const classes = useStyles();

  return (
    <Dialog
      open={isConfirmDialogVisible}
      fullWidth={true}
      aria-labelledby="confirm-dialog"
      maxWidth="sm"
      classes={{ paper: classes.paper }}
    >
      <DialogTitle id="confirm-dialog" onClose={onClose}>
        <span className="mr-12">{messages.title}</span>
      </DialogTitle>
      <DialogContent>
        <div className="py-2 px-8">{messages.content}</div>
      </DialogContent>
      <DialogActions>
        <div
          className={
            classes.root + " flex flex-col sm:flex-row flex-grow sm:flex-grow-0"
          }
        >
          <Button onClick={handleCancel} color="primary" variant="outlined">
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
