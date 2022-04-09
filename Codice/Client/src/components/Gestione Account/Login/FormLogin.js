import React from "react";
import EmailLogin from "./EmailLogin.js";
import PasswordLogin from "./PasswordLogin.js";

class FormLogin extends React.Component {
    constructor () {
        super();
        this.state = {
            Email: "",
            Password: "",
        }
    }

    handleChange = event => {
        const {name, value} = event.target;
        this.setState( {[name]: value} );
    }

    handleSubmit = event => {
        event.preventDefault();
        //inizializzo la destinazione come la pagina principale
        let destinazione = "/"
        //prelievo dall'url l'url da dove è stato chiamato il login per poterlo poi rendirizzare
        let url = window.location.hash.substring(1);
        let campi = url.split('#');
        //altrimenti la destinazione diventa l'url dell'annuncio che stavi visualizzando
        if(campi[1] && campi[1] !== "") {destinazione = destinazione + url; }
        
        //Disattivo il pulsante per evitare problemi causati da doppi click
        document.getElementById('pulsanteLogin').disabled = true;

        fetch("/autenticazione/login", {
            method: "POST", 
            body: JSON.stringify({
                state: this.state
            }),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json() )
        .then(data => {
            if(data.length === 0) {
                alert('Email o passaword non corretti');
                document.getElementById('pulsanteLogin').disabled = false;
            }
            else {
                sessionStorage.setItem("id_account", data[0].id_account); 
                sessionStorage.setItem("email" , this.state.Email);
                sessionStorage.setItem("utente", `${data[0].nome} ${data[0].cognome}`)
                alert("Login Effettuato Con Successo");
                window.location.href = destinazione;    
            }
        })
        .catch(err => {

            //Riattivo il pulsante
            document.getElementById('pulsanteLogin').disabled = false;

            throw err;
        });

        
    }

    render () {
        return(
            <form className="form-signin " onSubmit={this.handleSubmit}>    
                <div className="text-center mb-4">  
                    <img className="" src="/images/logo.png" alt="logo" width="80" height="80"></img>
                    <h1 className="h3 mb-3 font-weight-normal text-white font-weight-bold">Autenticati</h1>
                </div>
                
                <EmailLogin 
                    state = {this.state}
                    handleChange = {this.handleChange} 
                />
                
                <PasswordLogin 
                    state = {this.state}
                    handleChange = {this.handleChange} 
                />

                <button className="btn btn-lg btn-secondary btn-block" id='pulsanteLogin'>Login</button>
                <a 
                    style={{fontSize:"1.1em"}} 
                    className="text-white font-italic font-weight-bolder" 
                    href="/ReimpostaPassword"> 
                        Hai dimenticato la password? 
                </a>
                <br></br>
                <a 
                    style={{fontSize:"1.1em"}} 
                    className="text-white font-italic font-weight-bolder" 
                    href="/Registrazione">
                        Non sei ancora registrato? Registrati.
                </a>
            </form>
        );
    }
}
export default FormLogin;
