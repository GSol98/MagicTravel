import React from "react";
import Logout from "../components/Gestione Account/Logout/Logout.js";

const NavbarLogged = () => {

    //Recupero le informazioni dell'utente
    let utente = sessionStorage.getItem('utente');

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-secondary mb-5">

            {/*Icona per il toggle della navbar per schermi piccoli*/}
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            {/*Navbar contenente i pulsanti Gestione Annunci, Prenotazioni Ricevute, Prenotazioni Effettuate, Gestione Account*/}
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav container" id="lista-navbar">
                    <li className="nav-item dropdown">
                        <a href="/#" className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Gestione Annunci
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <a className="dropdown-item" href="/CreaAnnuncio">Crea Annuncio</a>
                            <a className="dropdown-item" href="/VisualizzaListaAnnunci">Visualizza lista annunci</a>
                        </div>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/ListaPrenotazioniRicevute">Prenotazioni Ricevute</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/PrenotazioniEffettuate">Prenotazioni Effettuate</a>
                    </li>
                    <li className="nav-item dropdown">
                        <a href="/#" className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Gestione Account
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <p className="dropdown-item my-1">Ciao {utente}</p>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="/GestioneEconomica">Gestione Economica</a>
                            <a className="dropdown-item" href="/ModificaPassword">Modifica Password</a>
                            <a className="dropdown-item" onClick={Logout} href="/">Logout</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav >
    );
}

export default NavbarLogged;