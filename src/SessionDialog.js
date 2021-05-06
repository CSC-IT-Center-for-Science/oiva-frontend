import React, { useState, useEffect, useCallback } from "react";
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
import localforage from "localforage";
import { sessionTimeoutInMinutes } from "modules/constants";

const timeLeftInitial = (sessionTimeoutInMinutes / 2) * 60; // unit: seconds

const SessionDialog = ({ isVisible, onLogout, onOK }) => {
  const intl = useIntl();
  const [timeLeft, setTimeLeft] = useState(timeLeftInitial); // In seconds
  const [timerHandle, setTimerHandle] = useState();

  const countDown = useCallback(() => {
    setTimeLeft(prevState => {
      return Math.max(prevState - 1, 0);
    });
  }, []);

  function continueAsLoggedIn() {
    clearInterval(timerHandle);
    return onOK();
  }

  const logout = useCallback(
    isAutomatic => {
      clearInterval(timerHandle);
      if (isAutomatic) {
        localforage.setItem("sessionTimeout", true).then(onLogout);
      } else {
        onLogout();
      }
    },
    [onLogout, timerHandle]
  );

  useEffect(() => {
    if (timeLeft === 0) {
      logout(true);
    }
  }, [logout, timeLeft]);

  useEffect(() => {
    if (isVisible && !timerHandle) {
      const timerHandle = setInterval(() => {
        return countDown();
      }, 1000);
      setTimerHandle(timerHandle);
    }
  }, [countDown, isVisible, timerHandle]);

  return (
    <Dialog
      open={true}
      aria-labelledby="simple-dialog-title"
      PaperProps={{ style: { overflowY: "visible" } }}>
      <DialogTitle id="customized-dialog-title" onClose={continueAsLoggedIn}>
        {intl.formatMessage(auth.sessionDialogTitle)}
      </DialogTitle>
      <DialogContent style={{ overflowY: "visible" }}>
        <p className="mx-8 my-6">
          {intl.formatMessage(auth.sessionDialogCountdown, {
            time: `${Math.floor(timeLeft / 60)} m ${(timeLeft % 60)
              .toString()
              .padStart(2, 0)} s`
          })}
        </p>
      </DialogContent>
      <DialogActions>
        <div className="flex pr-6 pb-4">
          <div className="mr-4">
            <Button
              onClick={() => logout(false)}
              color="primary"
              variant="outlined">
              {intl.formatMessage(auth.logOut)}
            </Button>
          </div>
          <Button
            onClick={() => {
              return continueAsLoggedIn();
            }}
            color="primary"
            variant="contained">
            {intl.formatMessage(auth.jatkaKirjautuneena)}
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

SessionDialog.propTypes = {
  isVisible: PropTypes.bool,
  onOK: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default SessionDialog;
