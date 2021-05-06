import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { AppRoute } from "const/index";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { localizeRouteKey } from "utils/common";
import { ToastContainer } from "react-toastify";
import { useGlobalSettings } from "stores/appStore";
import SessionDialog from "SessionDialog";
import { useHistory } from "react-router-dom";
import { useIdleTimer } from "react-idle-timer";
import { sessionTimeoutInMinutes } from "modules/constants";
import { App } from "App.tsx";

import "react-toastify/dist/ReactToastify.css";

export const AppLayout = ({ localesByLang, children, organisation, user }) => {
  const history = useHistory();
  const { formatMessage, locale } = useIntl();

  const [{ isDebugModeOn }] = useGlobalSettings();
  const [isSessionDialogVisible, setSessionDialogVisible] = useState(false);

  const onSessionDialogLogout = useCallback(() => {
    history.push(localizeRouteKey(locale, AppRoute.CasLogOut, formatMessage));
  }, [formatMessage, history, locale]);

  const onSessionDialogOK = useCallback(() => {
    setSessionDialogVisible(false);
  }, []);

  const handleOnIdle = () => {
    setSessionDialogVisible(true);
  };

  useIdleTimer({
    timeout: (sessionTimeoutInMinutes / 2) * 60 * 1000, // unit: ms
    onIdle: handleOnIdle,
    debounce: 500
  });

  return (
    <React.Fragment>
      <BreadcrumbsItem
        to={localizeRouteKey(locale, AppRoute.Home, formatMessage)}>
        Oiva
      </BreadcrumbsItem>

      <ToastContainer />

      {isSessionDialogVisible && !!user ? (
        <SessionDialog
          isVisible={isSessionDialogVisible}
          onLogout={onSessionDialogLogout}
          onOK={onSessionDialogOK}
        />
      ) : null}

      {isDebugModeOn ? (
        <div className="flex">
          <div
            id="cy"
            className="z-50 r-0 t-0 bg-gray-100 w-1/3 h-auto border border-black"
            style={{ zIndex: 9000 }}></div>
          <div className="w-2/3 relative">
            {
              <App
                children={children}
                isSessionDialogVisible={isSessionDialogVisible}
                localesByLang={localesByLang}
                onLogout={onSessionDialogOK}
                onSessionDialogOK={onSessionDialogOK}
                organisation={organisation}
                user={user}
              />
            }
          </div>
        </div>
      ) : (
        <App
          children={children}
          isSessionDialogVisible={isSessionDialogVisible}
          localesByLang={localesByLang}
          onLogout={onSessionDialogOK}
          onSessionDialogOK={onSessionDialogOK}
          organisation={organisation}
          user={user}
        />
      )}
    </React.Fragment>
  );
};
