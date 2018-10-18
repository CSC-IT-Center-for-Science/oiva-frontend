import _ from 'lodash'
import React from 'react'
import { Route } from 'react-router-dom'

//import RequireCasAuth from 'routes/Login/components/RequireCasAuth'
//import CasAuthenticated from 'routes/Login/containers/CasAuthenticated'
//import Login from 'routes/Login'
//import Logout from 'routes/Logout'
//import DestroyCasAuth from "./Logout/components/DestroyCasAuth";

import Home from 'routes/Home'
import Jarjestajat from 'routes/Jarjestajat'
import Asiat from 'routes/Asiat'
import Jarjestaja from '../routes/Jarjestajat/Jarjestaja'
import Valmistelu from '../routes/Asiat/Valmistelu'


const appRoutes = _.union(
  Home,
  //Login,
  //Logout,
  Jarjestaja,
  Jarjestajat,
  Asiat,
  Valmistelu
)

const Routes = () => {
  return (
    <div>
      {appRoutes.map((route, i) => <Route key={i} {...route} />)}
      {/*
      {<Route path="/cas-auth" component={RequireCasAuth} />}
      {<Route path="/cas-ready" component={CasAuthenticated} />}
      {<Route path="/cas-logout" component={DestroyCasAuth} />}
      */}
    </div>
  )
}

export default Routes
