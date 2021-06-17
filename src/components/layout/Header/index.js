import React, { useEffect, useState } from 'react';
import { getUser, getNotifications } from './../../../requests';
import { withRouter } from 'react-router';
import './style.scss';

const Header = () => {

    const [user, setUser] = useState(getUser());
    const [notificationsQuantity, setNotificationsQuantity] = useState(0);
    useEffect(() => {
        if(user) {
            getNotifications()
            .then(res => {
                if(res){
                    setNotificationsQuantity(res.data.filter(i => i.readed == false).length);
                }
            });
        }
    }, [user])

    return(
        <header>
            <nav className="navbar navbar-expand-lg">
                <a className="navbar-brand text-light" href="/holidays/">URLOPY</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="fa fa-bars"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav h6" style={{ width: '100%' }}>
                        <a className="nav-item nav-link" href="/holidays/"><i className="fa fa-home mr-2"></i>Home</a>
                        {user && 
                            <React.Fragment>
                                <a className="nav-item nav-link" href="/holidays/employees/requests"><i className="fa fa-glass-cheers mr-2"></i>Urlopy pracowników</a>
                                <a className="nav-item nav-link" href="/holidays/notifications"><i className="fa fa-info mr-2"></i>Powiadomienia</a>
                                {notificationsQuantity !== 0 && 
                                    <p 
                                        className="text-center text-light bg-danger"
                                        style={{
                                            width: '30px',
                                            borderRadius: '15px',
                                            position: 'relative',
                                            top: '20px',
                                            right: '18px'
                                        }}
                                    >
                                        {notificationsQuantity}
                                    </p>
                                }
                                <div className="dropdown ml-auto mr-5">
                                    <button className="btn dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fa fa-user mr-2"></i> {user.first_name} {user.last_name}
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <a className="dropdown-item text-muted" href="/holidays/account"><i className="fa fa-user mr-2"></i>Konto</a>
                                        {user.is_admin &&
                                            <a className="dropdown-item text-muted" href="/holidays/dashboard"><i className="fa fa-server mr-2"></i>Panel administratora</a>
                                        }
                                        <a className="dropdown-item text-muted" href="/holidays/logout"><i className="fa fa-sign-out-alt mr-2"></i>Wyloguj się</a>
                                    </div>
                                </div>
                            </React.Fragment>
                        }
                        {!user &&
                            <a className="nav-item nav-link h6 mb-0" href="/holidays/login"><i className="fa fa-sign-in-alt mr-2"></i>Zaloguj się</a>
                        }
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default withRouter(Header);