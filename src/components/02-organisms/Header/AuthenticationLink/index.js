import { NavLink } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";

const AuthenticationLink = ({ authenticationLink, navLinkClasses = "" }) => {
  const baseClasses =
    "inline-block no-underline text-white hover:underline hover:text-gray-100";
  const classes = `${baseClasses} ${navLinkClasses}`;
  return (
    <NavLink to={authenticationLink.path} exact={false} className={classes}>
      <span className="font-normal">{authenticationLink.text[0]} </span>
      {authenticationLink.text[1] && (
        <span className="font-medium">{authenticationLink.text[1]}</span>
      )}
    </NavLink>
  );
};

AuthenticationLink.propTypes = {
  authenticationLink: PropTypes.object,
  navLinkClasses: PropTypes.string
};

export default AuthenticationLink;
