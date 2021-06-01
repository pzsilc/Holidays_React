import React, { useState } from 'react';
import { getUser } from './../../../requests';
import { withRouter } from 'react-router';
import './style.scss';

const Header = () => {

    const [user, setUser] = useState(getUser());

    return(
        <header>
            <nav className="navbar navbar-expand-lg">
                <a className="navbar-brand" href="#">URLOPY</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="fa fa-bars"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-item nav-link" href="/">Home</a>
                        {user && 
                            <React.Fragment>
                                <a className="nav-item nav-link" href="/employees/management">Twoi pracownicy</a>
                                <a className="nav-item nav-link" href="/logout">Wyloguj się</a>
                                <div className="user">
                                    <i className="fa fa-user mr-2"></i>
                                    <span>{user.first_name} {user.last_name}</span>
                                </div>
                            </React.Fragment>
                        }
                        {!user &&
                            <a className="nav-item nav-link" href="/login">Zaloguj się</a>
                        }
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default withRouter(Header);