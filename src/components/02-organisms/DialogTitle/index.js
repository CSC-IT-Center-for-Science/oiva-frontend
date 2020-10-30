import {withStyles} from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import PropTypes from "prop-types";

const DialogTitle = withStyles(theme => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(3),
    paddingBottom: 0,
    background: "#ffffff"
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
    color: theme.palette.grey[500]
  }
}))(props => {
  const { children, classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

DialogTitle.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
};


export default DialogTitle;
