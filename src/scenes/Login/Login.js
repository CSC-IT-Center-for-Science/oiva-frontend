import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { useIntl } from "react-intl";
import auth from "../../i18n/definitions/auth";
import common from "../../i18n/definitions/common";
import { Typography } from "@material-ui/core";
import { localizeRouteKey } from "utils/common";
import { AppRoute } from "const/index";

// import LoginForm from 'routes/Login/components/LoginForm'

const FakeButton = styled.div`
  border: 1px solid #ccc;
  margin: 30px 0;
  padding: 12px 24px;
  display: inline-block;
  cursor: pointer;
  text-transform: uppercase;
  color: white;
  background-color: #aaa;

  a,
  a:visited {
    color: white;
    text-decoration: none;
  }
`;

const Login = () => {
  const { formatMessage, locale } = useIntl();
  return (
    <div>
      <Helmet htmlAttributes={{ lang: locale }}>
        <title>Oiva | {formatMessage(auth.logIn)}</title>
      </Helmet>
      <BreadcrumbsItem
        to={localizeRouteKey(locale, AppRoute.Home, formatMessage)}
      >
        {formatMessage(common.frontpage)}
      </BreadcrumbsItem>
      <BreadcrumbsItem to="/kirjaudu">
        {formatMessage(common.logIn)}
      </BreadcrumbsItem>
      <Typography component="h1" variant="h1">
        Kirjautuminen
      </Typography>
      <FakeButton>
        <Link to="/cas-auth">CAS-Kirjautuminen</Link>
      </FakeButton>
    </div>
  );
};

export default Login;
