import { useEffect } from 'react';
import { logout } from '../../../requests';

const Logout = () => {

    useEffect(() => {
        logout();
    }, []);

    return (
        null
    )
}

export default Logout;