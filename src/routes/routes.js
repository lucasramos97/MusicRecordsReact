
import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Login from '../pages/auth/Login'
import ListMusics from '../pages/musics/ListMusics'
import DeletedMusics from '../pages/musics/deteledMusic'
import AuthenticationGuard from './AuthenticationGuard'

const Routes = (props) => {

  return (
    <BrowserRouter>
      <Switch>
        <AuthenticationGuard path="/" exact component={ListMusics} />
        <Route path="/login" component={Login} />
        <AuthenticationGuard path="/musics" exact component={ListMusics} />
        <AuthenticationGuard path="/musics/deleted" component={DeletedMusics} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes