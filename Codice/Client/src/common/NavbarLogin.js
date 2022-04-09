import React from "react";

const NavbarLogin = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-secondary mb-5">
            {/*Bottone per il toggle della navbar per schermi piccoli*/}
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            {/*Navbar contenente soltanto il pulsante di Login per l'autenticazione*/}
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav container" id="lista-navbar">
                    <li className="nav-item"></li>
                    <li className="nav-item">
                        <a className="nav-link" href="/Login">Login</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavbarLogin;