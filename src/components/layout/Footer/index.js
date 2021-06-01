import React from 'react';

const Footer = () => {
    const year = new Date().getFullYear();
    return(
        <footer className="text-center text-muted p-2 py-5 mt-5">
            &copy; Silcare {year}
        </footer>
    )
}

export default Footer;