import React from 'react';
import { login } from '../../../requests';

const Login = () => {
    
    const submit = e => {
        e.preventDefault();
        const { email, token } = e.target;
        login(email.value, token.value);
    }

    return(
        <form onSubmit={submit} className="p-5 border mx-auto" id="login-form">
            <label>
                Email
                <input type="email" className="form-control" name="email"/>
            </label>
            <label className="mt-3">
                Token
                <input type="password" className="form-control" name="token"/>
            </label>
            <button type="submit" className="btn btn-primary">Gotowe</button>
            <a href="http://192.168.0.234/token-reminder" className="text-muted">Nie pamiętam tokenu</a>
        </form>
    )
}


export default Login;