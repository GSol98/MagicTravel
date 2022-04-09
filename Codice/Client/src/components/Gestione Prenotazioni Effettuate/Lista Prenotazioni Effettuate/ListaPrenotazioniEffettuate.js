import React from "react";
import Prenotazione from "./Prenotazione";
import BarraNavigazione from "../../../common/BarraNavigazione.js";
import decripta from "../../../functions/decripta.js"; 

class ListaPrenotazioniEffettuate extends React.Component {

    //==============================================
    //Costruttore
    //==============================================

    constructor()
    {
        super();

        //Inizializzo lo state con le variabili che utilizzerò
        this.state = {
            prenotazioni: [],
            pagina: 1,
            caricamentoDati: true
        };
    }

    //==============================================
    //Funzione cambiaPagine()
    //==============================================

    //Viene richiamata quando clicchiamo un bottone di una pagina diversa
    cambiaPagina = event => { this.setState({
            pagina: Number.parseInt(event.target.value),
        }); 
    }

    //==============================================
    //Funzione componentDidMount()
    //==============================================
    
    componentDidMount(){

        let prenotazioni = [];

        //Richiesta al server delle richieste di prenotazione
        //Prima le case vacanze...
        let id = decripta(window.sessionStorage.getItem("id_account") , window.sessionStorage.getItem("email")) 
        fetch("/prenotazioni_effettuate/casa_vacanze", {
            method: "POST", 
            body: JSON.stringify({id: id}),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(data => {
            prenotazioni = data
            
            //... poi b&b
            fetch("/prenotazioni_effettuate/beb", {
                method: "POST", 
                body: JSON.stringify({id: id}),
                headers: {"Content-Type": "application/json"}
            })
            .then(res => res.json())
            .then(data => {

                //Ordino le prenotazioni
                prenotazioni = this.ordina(prenotazioni.concat(data));
 
                this.setState({
                    prenotazioni: prenotazioni,
                    caricamentoDati: false
                });
            })       
            .catch(err => { throw err; });
        })
        .catch(err => { throw err; });
    }

    //==============================================
    //Funzione ordina()
    //==============================================

    //Ordina le prenotazioni secondo questa logica:
    //- per stato
    //- distanza temporale
    ordina(prenotazioni) {
        let ordinato = [];

        //Prima inserisco le prenotazioni ancora in attesa e inserisco quelle che sono prossime alla scadenza
        ordinato = ordinato.concat(prenotazioni
            .filter(elem => { return elem.stato === 'in attesa' })
            .sort((a,b) => {return new Date(a.data_richiesta) - new Date(b.data_richiesta)}));

        //Poi inserisco quelle accettate mostrando prima quelle con la data di check-in più vicina
        ordinato = ordinato.concat(prenotazioni
            .filter(elem => { return elem.stato === 'accettata' })
            .sort((a,b) => { return new Date(a.check_in) - new Date(b.check_in) }));

        //Poi inserisco tutte le altre in ordine temporale
        ordinato = ordinato.concat(prenotazioni
            .filter(elem => { return (elem.stato !== 'in attesa' && elem.stato !== 'accettata') })
            .sort((a,b) => { return new Date(b.check_out) - new Date(a.check_out) }));

        return ordinato;
    }

    //==============================================
    //Funzione render()
    //==============================================
    
    render() {

        //La funzione setState esegue il rendere. Questo if permette di bloccare la renderizzazione fin quando tutti i dati
        //dal db sono stati ricevuti
        if(this.state.caricamentoDati)
            return( <h1 style={{textAlign: "center", height: "500px", lineHeight:"500px", fontSize:'4vw'}}>Caricamento...</h1> );    
            
        // Gestisco il caso in cui l'utente non abbia fatto annunci
        if(this.state.prenotazioni.length === 0)
            return( <h1 style={{textAlign: "center", height: "500px", lineHeight:"500px", fontSize:'4vw'}}>Non hai effettuato richieste di prenotazione</h1> );
            
        //Inizializzo tutte le variabili per gestire le pagine. Procedura necessaria se presenti troppi annunci
        let stampa = [];
        let pagina = this.state.pagina;
        let annunciPerPagina = 10;

        //Inserisco in un array i soli annunci da stampare
        for(let i=(pagina-1)*annunciPerPagina; i<(Math.min(pagina*annunciPerPagina, this.state.prenotazioni.length)); i++) {
            stampa.push(
                <Prenotazione key={i}
                prenotazione = {this.state.prenotazioni[i]} 
                tipo = {this.state.prenotazioni[i].tipo_alloggio === 'B&B' ? 'B&B' : 'Casa vacanza'}/>
            ); 
        }

        return (
            <div className='container'>
                <h1 style={{fontSize:"3em", textAlign:"center"}} className="my-5">Prenotazioni effettuate</h1>
                <h3>Prenotazioni trovate: {this.state.prenotazioni.length}</h3>
                {stampa}

            <BarraNavigazione 
                numero_pagine={Math.ceil(this.state.prenotazioni.length/annunciPerPagina)}
                pagina_attuale={this.state.pagina}
                cambia_pagina={this.cambiaPagina}
                />
            </div>
        );
    }
}

export default ListaPrenotazioniEffettuate;
