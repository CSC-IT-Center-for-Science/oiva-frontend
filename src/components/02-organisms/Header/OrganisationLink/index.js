import { NavLink } from "react-router-dom";
import common from "../../../../i18n/definitions/common";
import React from "react";
import PropTypes from "prop-types";
import AuthenticationLink from "../AuthenticationLink";

const OrganisationLink = ({
  organisationLink,
  formatMessage,
  navLinkClasses
}) => {
  const baseClasses =
    "link-to-own-organisation text-white border p-2 rounded-lg hover:bg-white hover:text-green-500";
  const classes = `${baseClasses} ${navLinkClasses}`;
  return (
    <NavLink
      className={classes}
      to={organisationLink.path}
      exact={false}
      activeClassName="bg-green-600"
    >
      {formatMessage(common.omaSivu)}
    </NavLink>
  );
};

AuthenticationLink.propTypes = {
  organisationLink: PropTypes.object,
  navLinkClasses: PropTypes.string
};

export default OrganisationLink;
