
import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Login from './pages/auth'
import ListMusics from './pages/music'
import DeletedMusics from './pages/music/deteled'

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/musics/deleted" component={DeletedMusics} />
        <Route path="/musics" component={ListMusics} />
        <Route path="/login" component={Login} />
        <Route path="/" exact component={ListMusics} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes