import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { login } from '../actions'
import LoginForm from '../components/LoginForm'


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

class Kirjautuminen extends Component {
  render() {
    return (
      <div>
        <h1>Kirjautuminen</h1>
        <FakeButton>
          <Link to="/cas-auth">CAS-Kirjautuminen</Link>
        </FakeButton>
        <LoginForm />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { user: state.user.user }
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (user) => dispatch(login(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Kirjautuminen)
