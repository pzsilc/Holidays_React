import React from 'react';
import { BrowserRouter, Switch } from "react-router-dom";
import { AuthRoute, GuestRoute } from './middlewares/index';
import { Header, Footer } from './components/layout';
import { Login, Logout } from './components/auth';
import { Home, EmployeesManagement } from './components/pages';

const App = () => {
    return(
        <div>
            <Header/>
            <BrowserRouter>
                <Switch>
                    <AuthRoute exact path="/" component={Home} />
                    <GuestRoute path="/login" component={Login} />
                    <AuthRoute path="/employees/management" component={EmployeesManagement} />
                    <AuthRoute path="/logout" component={Logout} />
                </Switch>
            </BrowserRouter>
            <Footer/>
        </div>
    )
}

export default App;
