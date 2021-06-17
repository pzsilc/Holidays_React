import React from 'react';
import { BrowserRouter, Switch } from "react-router-dom";
import { AuthRoute, GuestRoute, AdminRoute } from './middlewares/index';
import { Header, Footer } from './components/layout';
import { Login, Logout } from './components/auth';
import { Home, EmployeesRequests, Account, Notifications } from './components/pages';
import { Home as DashboardHome, OneEmployee } from './components/dashboard';
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
                    <AuthRoute exact path="/holidays/" component={Home} />
                    <GuestRoute path="/holidays/login" component={Login} />
                    <AuthRoute path="/holidays/employees/requests" component={EmployeesRequests} />
                    <AuthRoute path="/holidays/logout" component={Logout} />
                    <AuthRoute path="/holidays/account" component={Account}/>
                    <AuthRoute path='/holidays/notifications' component={Notifications}/>
                    <AdminRoute path='/holidays/dashboard/employees/:id' component={OneEmployee}/>
                    <AdminRoute path='/holidays/dashboard' component={DashboardHome}/>
                </Switch>
            </main>
            <Footer/>
        </BrowserRouter>
    )
}

export default App;
