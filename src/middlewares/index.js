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
                <Redirect to={{ pathname: '/', state: { from: props.location } }} />
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
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
              )
            }
        />
    )
}


export {
    GuestRoute,
    AuthRoute
}