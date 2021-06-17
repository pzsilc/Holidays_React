import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getUser } from '../requests';


const GuestRoute = ({ component: Component, ...rest }) => {
    let isLogged = getUser();
    return(
        <Route
            {...rest}
            render={props =>
              isLogged ? (
                <Redirect to={{ pathname: '/holidays/', state: { from: props.location } }} />
              ) : (
                <Component {...props} />
              )
            }
        />
    )
}


const AuthRoute = ({ component: Component, ...rest }) => {
    let isLogged = getUser();
    return(
        <Route
            {...rest}
            render={props =>
              isLogged ? (
                <Component {...props} />
              ) : (
                <Redirect to={{ pathname: '/holidays/login', state: { from: props.location } }} />
              )
            }
        />
    )
}


const AdminRoute = ({ component: Component, ...rest }) => {
  var isAdmin = false;
  let logged = getUser();
  if(logged && logged.is_admin){
    isAdmin = true;
  }
  return(
      <Route
          {...rest}
          render={props =>
            isAdmin ? (
              <Component {...props} />
            ) : (
              <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )
          }
      />
  )
}


export {
    GuestRoute,
    AuthRoute,
    AdminRoute
}