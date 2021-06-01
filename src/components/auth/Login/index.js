import React from 'react';
import { login } from '../../../requests';
import './style.scss';

const Login = props => {
    
    const submit = e => {
        e.preventDefault();
        const { email, token } = e.target;
        login(email.value, token.value);
    }

    return(
        <React.Fragment>
            <form onSubmit={submit} className="p-5 border mx-auto shadow" id="login-form">
                <h3>Logowanie</h3>
                <label className="mt-5">
                    Email
                    <div class="input-group mb-3">
                        <div class="input-group-prepend p-2">
                            <i className="fa fa-user"></i>
                        </div>
                        <input type="email" class="form-control" name="email" aria-label="Example text with button addon" aria-describedby="button-addon1"/>
                    </div>
                </label>
                <br/>
                <label className="mt-3">
                    Token
                    <div class="input-group mb-3">
                        <div class="input-group-prepend p-2">
                            <i className="fa fa-lock"></i>
                        </div>
                        <input type="password" class="form-control" name="token" aria-label="Example text with button addon" aria-describedby="button-addon1"/>
                    </div>
                </label>
                <br/>
                <button type="submit" className="btn btn-primary">Gotowe</button>
                <br/><br/>
                <a href="http://192.168.0.234/token-reminder" className="text-muted" target="_blank">Nie pamiętam tokenu</a>
            </form>
            <img src="/calendar.jpg" alt="Kalendarz" id="calendar-img"/>
        </React.Fragment>
    )
}


export default Login;