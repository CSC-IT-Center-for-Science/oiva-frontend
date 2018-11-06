import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logoutUser } from 'routes/Login/modules/user'
import styled from 'styled-components'

const LogoutText = styled.div`
  padding: 14px 20px;
  line-height: 18px;
  width:1200px;
  margin:auto;
`

class Logout extends Component {
    componentWillMount() {
        this.props.logoutUser()
    }

    render() {
        return (
            <LogoutText>
              <p>Olet kirjautunut ulos.</p>
            </LogoutText>
        )
    }
}

function mapStateToProps(state) {
    return { user: state.user }
}

function mapDispatchToProps(dispatch) {
    return {
        logoutUser: () => dispatch(logoutUser())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout)