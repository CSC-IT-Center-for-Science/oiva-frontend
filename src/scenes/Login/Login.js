import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { useIntl } from "react-intl";
import common from "../../i18n/definitions/common";

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
  const intl = useIntl();
  return (
    <div>
      <Helmet htmlAttributes={{ lang: intl.locale }}>
        <title>Oiva | Kirjaudu sisään</title>
      </Helmet>
      <BreadcrumbsItem to="/">
        {intl.formatMessage(common.frontpage)}
      </BreadcrumbsItem>
      <BreadcrumbsItem to="/kirjaudu">Kirjaudu sisään</BreadcrumbsItem>
      <h1>Kirjautuminen</h1>
      <FakeButton>
        <Link to="/cas-auth">CAS-Kirjautuminen</Link>
      </FakeButton>
    </div>
  );
};

export default Login;
