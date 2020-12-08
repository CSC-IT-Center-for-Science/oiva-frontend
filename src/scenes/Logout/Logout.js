import React, { useEffect, useState } from "react";
import { MessageWrapper } from "../../modules/elements";
import localforage from "localforage";
import auth from "../../i18n/definitions/auth";
import { useIntl } from "react-intl";
import SimpleButton from "../../components/00-atoms/SimpleButton";
import { useHistory } from "react-router-dom";
import { sessionTimeoutInMinutes } from "modules/constants";
import { Typography } from "@material-ui/core";

const Logout = () => {
  const history = useHistory();
  const intl = useIntl();

  useEffect(() => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("oid");
    sessionStorage.removeItem("role");
  }, []);

  const [sessionTimeout, setSessionTimeout] = useState(false);

  useEffect(() => {
    localforage.getItem("sessionTimeout").then(flag => {
      setSessionTimeout(flag);
    });

    return () => {
      localforage.removeItem("sessionTimeout");
    };
  }, []);

  const localizationKeyPrefix = sessionTimeout
    ? "sessionTimeout"
    : "endOfSession";

  return (
    <div className="mx-4 sm:mx-24">
      <MessageWrapper>
        <Typography component="h1" variant="h1" className="mb-4">
          {intl.formatMessage(auth[`${localizationKeyPrefix}Title`])}
        </Typography>
        <p className="mb-4">
          {intl.formatMessage(auth[`${localizationKeyPrefix}Info`], {
            time: sessionTimeoutInMinutes
          })}
        </p>
        <div>
          <SimpleButton
            text={intl.formatMessage(auth.logIn)}
            onClick={() => history.push("/cas-auth")}></SimpleButton>
        </div>
      </MessageWrapper>
    </div>
  );
};

export default Logout;
