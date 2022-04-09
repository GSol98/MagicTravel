import React from "react";
import GestisciPDF from "../../../common/GestisciPDF.js";

class GestioneLegale extends React.Component {

    render() 
    {   
        //Se i dati non sono ancora stati inviati alla questura stampa un bottone che permette l'invio
        if(this.props.gestioneLegale === 0) {
            return(
                <div id="corpoGestioneLegale1">
                    <h4>Gestione legale</h4>
                    <div id="sottoCorpoGestioneLegale1">
                        <p className="mb-0">Stato: da inviare</p>
                        <p className="mt-0">Con il tasto invio verranno inoltrati i dati dei clienti, sopra mostrati, direttamente alla questura.{this.props.numeroPersone}</p>
                        <GestisciPDF id_prenotazione={this.props.id_prenotazione}
                                        tipo={this.props.tipo} />
                        <button id='bottoneGestioneLegale' onClick={this.props.inviaDati} className="btn btn-secondary btn-sm">Invia dati</button>
                    </div>
                </div>
            );
        }

        //Se i dati sono già stati inviati, viene comunicato
        else {
            return(
                <div id="corpoGestioneLegale2">
                    <h4>Gestione legale</h4>
                    <div id="sottoCorpoGestioneLegale2">
                        <p>Stato: inviato</p>
                    </div>       
                </div>
            );
        }
    }
}

export default GestioneLegale;