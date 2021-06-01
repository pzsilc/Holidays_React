import React, { useState } from 'react';
import { getUser } from './../../../requests';

const Header = () => {

    const [user, setUser] = useState(getUser());

    return(
        <header>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <a className="nav-item nav-link" href="/">Home</a>
                        {user && 
                            <React.Fragment>
                                <a className="nav-item nav-link" href="/account">Konto</a>
                                <a className="nav-item nav-link" href="/employees/management">Twoi pracownicy</a>
                                <a className="nav-item nav-link" href="/logout">Wyloguj się</a>
                                |
                                <i>{user.first_name} {user.last_name} | {user.email}</i>
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

export default Header;