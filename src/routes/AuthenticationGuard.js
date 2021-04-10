import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import AuthService from '../pages/auth/services/AuthService'

export default function AuthenticationGuard({ component: Component, ...rest }) {
  const authService = new AuthService()

  return (
    <Route
      {...rest}
      render={(props) => {
        if (authService.isAuthenticated()) {
          return <Component />
        } else {
          return (
            <Redirect
              to={{ pathname: '/login', state: { from: props.location } }}
            />
          )
        }
      }}
    />
  )
}
