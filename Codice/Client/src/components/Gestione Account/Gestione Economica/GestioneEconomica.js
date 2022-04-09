import React from "react";
import Transazione from "./Transazione";
import BarraNavigazione from "../../../common/BarraNavigazione.js";
import decripta from "../../../functions/decripta.js";

class GestioneEconomica extends React.Component {

    //==============================================
    //Costruttore
    //==============================================

    constructor()
    {
        super();

        //Inizializzo lo state con le variabili che utilizzerò
        this.state = {
            listaTransazioni: [],
            totale: 0,
            primo: true,
            pagina: 1,
            caricamentoDati: true,
            
        };
    }

    
    //==============================================
    //Funzione componentDidMount()
    //==============================================
    
    componentDidMount(){
        let id = decripta(window.sessionStorage.getItem("id_account") , window.sessionStorage.getItem("email"));
        let listaTransazioni = [];

        //Richiesta al server dei dettagli delle transazioni 
        //Prima le transazioni come proprietario...
            fetch("/gestione_economica/casa_vacanze", {
                method: "POST", 
                 body: JSON.stringify({id: id}),
                headers: ({"Content-Type": "application/json"})
            })
            .then(res => res.json())
            .then(data => {

                //Memorizzo le transazioni delle case vacanze e richiedo quelle dei b&b
                listaTransazioni = data;

                fetch("/gestione_economica/beb", {
                    method: "POST", 
                    body: JSON.stringify({id: id}),
                    headers: ({"Content-Type": "application/json"})
                })
                .then(res => res.json())
                .then(data1 => {

                    //Dispongo in ordine cronologico le transazioni
                    listaTransazioni = listaTransazioni.concat(data1)
                        .sort((a,b) => {
                            return new Date(b.data) - new Date(a.data);
                        });

                    //Eseguo il conteggio delle spese totali
                    let tot = 0;
                    listaTransazioni.forEach(elem => {tot += elem.importo});

                    this.setState({
                        listaTransazioni: listaTransazioni,
                        totale: tot,
                        caricamentoDati: false
                    });
                })
                .catch(err => { throw err; });
            })
            .catch(err => { throw err; });    
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
    //Funzione render()
    //==============================================
    
    render() {
       
        //La funzione setState esegue il render. Questo if permette di bloccare la renderizzazione fin quando tutti i dati
        //da db sono stati ricevuti
        if(this.state.caricamentoDati)
            return( <h1 style={{textAlign: "center", height: "500px", lineHeight:"500px", fontSize:'4vw'}}>Caricamento...</h1> );

        if(this.state.listaTransazioni.length === 0)
            return( <h1 style={{textAlign: "center", height: "500px", lineHeight:"500px", fontSize:'4vw'}}>Nessun movimento effettuato.</h1> );
        
        //Inizializzo tutte le variabili per gestire le pagine. Procedura necessaria se presenti troppe transazioni
        let stampa = [];
        let pagina = this.state.pagina;
        let transazioniPerPagina = 8;

        //Inserisco in un array le sole transazioni da stampare 
        for(let i=(pagina-1)*transazioniPerPagina; i<(Math.min(pagina*transazioniPerPagina, this.state.listaTransazioni.length)); i++) {
            stampa.push(
                <Transazione key={`${this.state.listaTransazioni[i].tipo_alloggio === 'B&B' ? 'PB' : 'CV'}${this.state.listaTransazioni[i].id_transazione}`} 
                            titolo = {this.state.listaTransazioni[i].titolo}
                            data = {this.state.listaTransazioni[i].data}
                            tipo_alloggio = {this.state.listaTransazioni[i].tipo_alloggio}
                            importo = {this.state.listaTransazioni[i].importo}
                            descrizione = {this.state.listaTransazioni[i].descrizione}
                            nome={this.state.listaTransazioni[i].nome}
                            cognome={this.state.listaTransazioni[i].cognome}/>
            );
        }

        return (
            <div className="container mt-5 rounded shadow-lg p-5 impaginazione" id="corpoDettagliPrenotazioneRicevuta">

                <h4 className="m-4 text-italic text-center"> Movimenti economici </h4>
                <p className="text-center">La lista sottostante riassume i movimenti economici da lei effettuati all'interno del nostro sito.</p>
                <div className='my-5 container'>
                    <h5>Totale uscite/entrate: {this.state.totale}€</h5>
                </div>
                <div className="container mb-5">
                    {stampa}
                </div> 
                        
                <BarraNavigazione 
                    numero_pagine={Math.ceil(this.state.listaTransazioni.length/transazioniPerPagina)}
                    pagina_attuale={this.state.pagina}
                    cambia_pagina={this.cambiaPagina}
                    />
               
            </div>
        );
        
    }
}

export default GestioneEconomica;
