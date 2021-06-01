import React from 'react';
import { BrowserRouter, Switch } from "react-router-dom";
import { AuthRoute, GuestRoute } from './middlewares/index';
import { Header, Footer } from './components/layout';
import { Login, Logout } from './components/auth';
import { Home, EmployeesManagement } from './components/pages';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './sass/app.scss';


const App = () => {
    return(
        <BrowserRouter>
            <Header/>
            <ReactNotification />
            <main>
                <Switch>
                    <AuthRoute exact path="/" component={Home} />
                    <GuestRoute path="/login" component={Login} />
                    <AuthRoute path="/employees/management" component={EmployeesManagement} />
                    <AuthRoute path="/logout" component={Logout} />
                </Switch>
            </main>
            <Footer/>
        </BrowserRouter>
    )
}

export default App;
