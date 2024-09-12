import React from "react";
import { PropTypes } from "prop-types";
import { useIntl } from "react-intl";
import DialogTitle from "./components/02-organisms/DialogTitle";
import auth from "./i18n/definitions/auth";
import {
  DialogContent,
  Dialog,
  DialogActions,
  Button
} from "@material-ui/core";
import common from "i18n/definitions/common";

const LoginInfoDialog = ({ linkToExternalLogInPage, onCancel }) => {
  const { formatMessage } = useIntl();

  return (
    <Dialog
      open={true}
      aria-labelledby="simple-dialog-title"
      PaperProps={{ style: { overflowY: "visible" } }}>
      <DialogTitle id="customized-dialog-title" onClose={onCancel}>
        {formatMessage(auth.loginInfoDialogTitle)}
      </DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <p className="mx-8 my-6">{formatMessage(auth.loginInfoDialogText)}</p>
      </DialogContent>
      <DialogActions>
        <div className="flex pr-6 pb-4">
          <div className="mr-4">
            <Button onClick={onCancel} color="primary" variant="outlined">
              {formatMessage(common.cancel)}
            </Button>
          </div>
          <Button
            onClick={() => {
              window.location.href = linkToExternalLogInPage;
            }}
            color="primary"
            variant="contained">
            {formatMessage(auth.jatkaKirjautumiseen)}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

LoginInfoDialog.propTypes = {
  linkToExternalLogInPage: PropTypes.string,
  onCancel: PropTypes.func.isRequired
};

export default LoginInfoDialog;
