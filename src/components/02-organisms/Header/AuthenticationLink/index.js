import React, { useState } from "react";
import PropTypes from "prop-types";
import LoginInfoDialog from "LoginInfoDialog";
import SimpleButton from "components/00-atoms/SimpleButton";
import { indexOf } from "ramda";
import { NavLink } from "react-router-dom";

const AuthenticationLink = ({ authenticationLink, navLinkClasses = "" }) => {
  const [isLoginInfoDialogVisible, setLoginInfoDialogVisible] = useState();
  const isLogOutLink = indexOf("logout", authenticationLink.path) !== -1;

  const baseClasses =
    "inline-block no-underline text-white hover:underline hover:text-gray-100";
  const classes = `${baseClasses} ${navLinkClasses}`;

  return (
    <React.Fragment>
      {isLoginInfoDialogVisible && (
        <LoginInfoDialog
          isVisible={isLoginInfoDialogVisible}
          linkToExternalLogInPage={authenticationLink.path}
          onCancel={() => {
            setLoginInfoDialogVisible(false);
          }}
        />
      )}

      {isLogOutLink ? (
        <NavLink exact={false} className={classes} to={authenticationLink.path}>
          <span className="font-normal">{authenticationLink.text[0]} </span>
          {authenticationLink.text[1] && (
            <span className="font-medium">{authenticationLink.text[1]}</span>
          )}
        </NavLink>
      ) : (
        <SimpleButton
          onClick={setLoginInfoDialogVisible}
          text={authenticationLink.text[0]}
          styleAsALink={true}
        ></SimpleButton>
      )}
    </React.Fragment>
  );
};

AuthenticationLink.propTypes = {
  authenticationLink: PropTypes.object,
  navLinkClasses: PropTypes.string
};

export default AuthenticationLink;
