import React, { Component } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import LoginForm from 'routes/Login/components/LoginForm'

const FakeButton = styled.div`
  border: 1px solid #CCC;
  margin: 30px 0;
  padding: 12px 24px;
  display: inline-block;
  cursor: pointer;
  text-transform: uppercase;
  color: white;
  background-color: #AAA;

  a,
  a:visited {
    color: white;
    text-decoration: none;
  }
`

class Login extends Component {
  render() {
    return (
      <div>
        <Helmet>
          <title>Kirjaudu sisään | Oiva</title>
        </Helmet>
        <h1>Kirjautuminen</h1>
        <FakeButton>
          <Link to="/cas-auth">CAS-Kirjautuminen</Link>
        </FakeButton>
        <LoginForm />
      </div>
    )
  }
}

export default Login
