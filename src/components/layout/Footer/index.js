import React from 'react';
import './style.scss';

const Footer = () => {
    const year = new Date().getFullYear();
    return(
        <footer className="text-center text-muted p-2 pb-5">
            &copy; Silcare {year}
        </footer>
    )
}

export default Footer;