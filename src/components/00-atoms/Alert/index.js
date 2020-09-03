import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
/**
 * AlertMessage wraps a Alert
 * https://material-ui.com/components/alert/
 * Uses handleClick to call callback.
 * @param props
 *    ariaLabel: aria-label as string
 *    title: title as string
 *    message: message as string
 *    type: type of alert info (default), warning, error, success
 *    handleLinkClick: click call back function (if a link)
 *    linkText: link text as string
 *    payload: Custom object defined by user
 * @returns {*}
 * @constructor
 */

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    },
    "& .MuiTypography-gutterBottom": {
      margin: 0 // removes extra margin especially if no message but only title
    },
    "& .MuiAlert-icon": {
      paddingTop: "8px" // overrides default 7px to center icon better with margin 0 of text
    },
    "& .MuiAlert-root": {
      display: "flex"
    },
    "& .MuiAlert-action": {
      marginLeft: 0,
      paddingLeft: "0.5em",
      flexGrow: "1"
    },
    "& .MuiButtonBase-root": {
      marginLeft: "auto !important"
    },
    "& .MuiLink-root": {
      color: "green",
      padding: "2px 0.5em 0 0"
    }
  }
}));

const AlertMessage = React.memo(
  props => {
    const classes = useStyles();
    const [isVisible, setVisible] = useState(true);

    const clickCallback = e => {
      e.preventDefault();
      return props.handleLinkClick();
    };

    return (
      <div className={`${classes.root} ${isVisible ? "" : "hidden"}`}>
        <Collapse in={props.isVisible}>
          <Alert
            id={props.id}
            aria-label={props.ariaLabel}
            severity={props.type}
            variant="outlined"
            action={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%"
                }}>
                {props.linkUrl && props.linkText && (
                  <Link
                    href={props.linkUrl}
                    style={{ cursor: "pointer", textDecoration: "underline" }}>
                    {props.linkText}
                  </Link>
                )}
                {!props.linkUrl && props.handleLinkClick && props.linkText && (
                  <Link
                    onClick={clickCallback}
                    style={{ cursor: "pointer", textDecoration: "underline" }}>
                    {props.linkText}
                  </Link>
                )}
                <IconButton
                  style={{ marginLeft: "1em" }}
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setVisible(false)}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </div>
            }>
            {props.title && <AlertTitle>{props.title}</AlertTitle>}
            <p>{props.message && props.message}</p>
          </Alert>
        </Collapse>
      </div>
    );
  },
  (pp, cp) => {
    return pp.payload === cp.payload;
  }
);

AlertMessage.defaultProps = {
  id: "Alert",
  type: "info",
  ariaLabel: "alert",
  linkText: "<missing linkText prop>",
  isVisible: true
};

AlertMessage.propTypes = {
  id: PropTypes.string,
  /** aria-label as string */
  ariaLabel: PropTypes.string,
  /** title as string */
  title: PropTypes.string,
  /** message as string */
  message: PropTypes.string,
  /** type of alert info (default), warning, error, success */
  type: PropTypes.string,
  /** link url as string (optional) */
  linkUrl: PropTypes.string,
  /** link text as string (optional) */
  linkText: PropTypes.string,
  /** link clicking call back function (if no linkUrl given) */
  handleLinkClick: PropTypes.func,
  /** Custom object defined by user. */
  payload: PropTypes.object
};

export default AlertMessage;
