import React from "react";
import AnnuncioCasaVacanzeRicerca from "./AnnuncioCasaVacanzeRicerca.js";
import AnnuncioBeBRicerca from "./AnnuncioB&BRicerca.js";
import BarraNavigazione from "../../../common/BarraNavigazione.js";

class AnnunciRicerca extends React.Component
{
    
    constructor()
    {
        super();
        this.state = {
            loading: true,
            listaAnnunci: [],
            pagina: 1
        };
    }

    //==============================================
    //Funzione componentDidMount()
    //==============================================

    componentDidMount() {

        //Richiedo tutti gli anni secondo i filtri richiesti
        fetch("/trova_annunci/ricerca_annunci", {
            method: "POST",
            body: JSON.stringify({
                Destinazione: window.localStorage.getItem("Destinazione"), 
                TipoAnnuncio: window.localStorage.getItem("Tipo"), 
                Prezzo: window.localStorage.getItem("Prezzo"), 
                Dal: window.localStorage.getItem("Dal"), 
                Al: window.localStorage.getItem("Al"), 
                Persone: window.localStorage.getItem("Persone"),
                Altro: window.localStorage.getItem("Altro")
            }),
            headers: {"Content-Type": "application/json"}
        })
        .then(res => res.json())
        .then(data => {

            //Salvo la lista nello state
            this.setState({ 
                listaAnnunci: data,
                loading: false
            });
        })
        .catch(err => {throw err; });
    }

    //==============================================
    //Funzione cambiaPagina()
    //==============================================

    //Viene richiamata quando clicchiamo un bottone di una pagina diversa
    cambiaPagina = event => { 
        this.setState({
            pagina: Number.parseInt(event.target.value),
        }); 
    }

    //==============================================
    //Funzione render()
    //==============================================

    render() {
 
        //Non mostro la lista fin quando non l'ho ricevuta
        if(this.state.loading)
            return( <h1 style={{textAlign: "center", height: "500px", lineHeight:"500px", fontSize:'4vw'}}>Caricamento...</h1> );
        
        //Controllo se ci sono annunci
        if((this.state.listaAnnunci.length === 0))
            return( <h1 style={{textAlign: "center", height: "500px", lineHeight:"500px", fontSize:'4vw'}}>Nessun risultato di ricerca trovato</h1> );

        //Inizializzo tutte le variabili per gestire le pagine. Procedura necessaria se presenti troppi annunci
        let stampa = [];
        let pagina = this.state.pagina;
        let annunciPerPagina = 10;

        //Inserisco in un array i soli annunci da stampare
        for(let i=(pagina-1)*annunciPerPagina; i<(Math.min(pagina*annunciPerPagina, this.state.listaAnnunci.length)); i++) {
            stampa.push(
                (this.state.listaAnnunci[i].tipo_alloggio === 'B&B') ?
                <AnnuncioBeBRicerca
                                    key={`${this.state.listaAnnunci[i].tipo_alloggio}${this.state.listaAnnunci[i].id_annuncio}`} 
                                    annuncio={this.state.listaAnnunci[i]}
                /> :
                <AnnuncioCasaVacanzeRicerca
                                    key={`${this.state.listaAnnunci[i].tipo_alloggio}${this.state.listaAnnunci[i].id_annuncio}`} 
                                    annuncio={this.state.listaAnnunci[i]}
                />
            );
        }

        //Stampo gli annunci
        return( 
            <div className="container">
                <h1 style={{fontSize:"3em", textAlign:"center"}} className="my-5">Risultati Ricerca</h1>
                <h3>Risultati trovati: {this.state.listaAnnunci.length}</h3>
                {stampa}
                
                <BarraNavigazione 
                    numero_pagine={Math.ceil(this.state.listaAnnunci.length/annunciPerPagina)}
                    pagina_attuale={this.state.pagina}
                    cambia_pagina={this.cambiaPagina}
                />
            </div>
        );
    }
}

export default AnnunciRicerca;
