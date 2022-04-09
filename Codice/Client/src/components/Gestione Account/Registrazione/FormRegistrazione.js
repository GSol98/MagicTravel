import React from "react";
import Nome from "./Nome.js";
import Email from "./Email.js";
import Password from "./Password.js";
import ConfermaPassword from "./ConfermaPassword.js";
import Cognome from "./Cognome.js";
import CodiceFiscale from "./CodiceFiscale.js";
import DataDiNascita from "./DataDiNascita.js"
import NumeroTelefono from "./NumeroTelefono.js";

class FormRegistrazione extends React.Component
{
    constructor()
    {
        super();
        this.state = {
            Nome: "",
            Cognome: "",
            DataDiNascita: "",
            CodiceFiscale: "",
            NumeroTelefono: "",
            Email: "",
            Password: "",
            ConfermaPassword: ""
        }
    }

    handleChange = event => {
        const {name, value} = event.target;
        this.setState( {[name]: value} );
    }

    handleSubmit = event => {
        event.preventDefault();
        let controllo = false;
        let dataDiNascita = new Date(this.state.DataDiNascita)

        //CONTROLLO CHE PASSWORD E CONFERMA PASSWORD SIANO UGUALI
        if(this.state.Password !== this.state.ConfermaPassword) {
            alert("Password e Conferma Password non sono uguali")
            controllo = true;
        }

        //CONTROLLO CHE L'UTENTE CHE SI STA REGISTRANDO NON ABBIA ETA INFERIORE AI 14 ANNI
        if((new Date()).getFullYear() - dataDiNascita.getFullYear() < 14) {
            alert("Devi avere almeno 14 anni per poterti registrare")
            controllo = true;
        }
        
        if(!controllo) {
            event.preventDefault();

            //Disattivo il pulsante per evitare problemi legati al doppio click
            document.getElementById('pulsanteRegistrazione').disabled = true;
            
            fetch("/registrazione/nuovo_utente", {
                method: "POST", 
                body: JSON.stringify({
                    state: this.state
                }),
                headers: {"Content-Type": "application/json"}
            })
            .then(res => {
                if(res.status === 200)
                {
                    alert("Account Creato");
                    window.location.href = "/Login";
                }
                else if(res.status === 500) {
                    alert("Esiste già un account riferito a questa email. Riprova");
                    window.location.href = "/Registrazione";
                }
                else
                    throw new Error();
            })
            .catch(err => console.log("Impossibile Creare L'account"));
        }
    }
    
    render() 
    {
        return(
            <form className="form-signin was-validated"  onSubmit={this.handleSubmit}>
                <Nome 
                    state = {this.state}
                    handleChange = {this.handleChange} 
                />
                <Cognome 
                    state = {this.state}
                    handleChange = {this.handleChange}
                />
                
                <DataDiNascita 
                    state = {this.state}
                    handleChange = {this.handleChange}
                />

                <NumeroTelefono 
                    state = {this.state}
                    handleChange = {this.handleChange}
                />

                <CodiceFiscale 
                    state = {this.state}
                    handleChange = {this.handleChange}
                />

                <Email 
                    state = {this.state}
                    handleChange = {this.handleChange}
                />

                <Password 
                    state = {this.state}
                    handleChange = {this.handleChange}
                />

                <ConfermaPassword 
                    state = {this.state}
                    handleChange = {this.handleChange}
                   
                />

                <button className="btn btn-lg btn-secondary btn-block mt-3" id='pulsanteRegistrazione'>Registrati</button>

            </form>
        )
    }
}
export default FormRegistrazione;