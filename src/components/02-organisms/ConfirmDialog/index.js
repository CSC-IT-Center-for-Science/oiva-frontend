import DialogContent from "@material-ui/core/DialogContent";
import {HAKEMUS_VIESTI} from "../../../scenes/Jarjestajat/Jarjestaja/Hakemukset/Muutospyynto/modules/uusiHakemusFormConstants";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import React from "react";
import PropTypes from "prop-types";
import DialogTitle from "../DialogTitle";

const ConfirmDialog = ({isConfirmDialogVisible, handleOk, handleCancel, title, content}) => {
  return (
    <Dialog
      open={isConfirmDialogVisible}
      fullWidth={true}
      aria-labelledby="confirm-dialog"
      maxWidth="sm"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>
        <Button onClick={handleOk} color="primary" variant="contained">
          {HAKEMUS_VIESTI.KYLLA.FI}
        </Button>
        <Button
          onClick={handleCancel}
          color="secondary"
          variant="outlined"
        >
          {HAKEMUS_VIESTI.EI.FI}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmDialog.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  isConfirmDialogVisible: PropTypes.bool,
  handleOk: PropTypes.func,
  handleCancel: PropTypes.func,
};

export default ConfirmDialog;
