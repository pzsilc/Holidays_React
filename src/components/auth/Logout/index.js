import { useEffect } from 'react';
import { logout } from '../../../requests';

const Logout = props => {

    useEffect(() => {
        logout();
    }, []);

    return (
        null
    )
}

export default Logout;