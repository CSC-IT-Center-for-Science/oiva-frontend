import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { fetchLuvat } from '../actions'

class Luvat extends Component {
  componentWillMount() {
    this.props.fetchLuvat()
  }

  renderPermits() {
    return _.map(this.props.luvat, lupa => {
      return (
        <tr key={lupa.id}>
          <th><a href={`http://localhost:8099/api/pdf/${lupa.diaarinumero}`} target="_blank">{lupa.diaarinumero}</a></th>
          <th>{lupa.jarjestajaOid}</th>
          <th>{lupa.meta.esittelija}</th>
        </tr>
      )
    })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Lupavaranto | Oiva</title>
        </Helmet>
        <h4>LUVAT</h4>
        <table>
          <thead>
            <tr>
              <th>Diaarinumero</th>
              <th>Järjestäjä</th>
              <th>Esittelijä</th>
            </tr>
          </thead>
          <tbody>
            {this.renderPermits()}  
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return { luvat: state.luvat }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLuvat: () => dispatch(fetchLuvat())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Luvat)
