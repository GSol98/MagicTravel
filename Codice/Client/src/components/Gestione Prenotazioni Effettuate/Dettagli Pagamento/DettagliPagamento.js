import React from "react";
import decripta from "../../../functions/decripta.js"; //*
class DettagliPagamento extends React.Component {
    //==============================================
    //Costruttore
    //==============================================

    constructor() {
        super();

        //Inizializzo lo state con le variabili che utilizzerò
        this.state = {
            caricamentoDettagli: true,
            dettagliPagamento: []                   
        }
    }

    //==============================================
    //Funzione componentDidMount()
    //==============================================

    componentDidMount() {
        //Catturo il codice, ricevuto dalla pagina precedente, che contiene tipo e id
        let dati = window.location.hash.substring(1);
        let tipo= dati.substring(0, 1);
        let id = dati.substring(1, dati.length);
        let idAccount = decripta(window.sessionStorage.getItem("id_account") , window.sessionStorage.getItem("email")) //*
        //Se la richiesta è di una casa vacanza
        if(tipo === 'C') {
            
            //Richiedo i dettagli del pagamento al db
            fetch("/gestione_prenotazione/dettagli_pagamento/casa_vacanze", {
                    method: "POST", 
                    body: JSON.stringify({
                        id: idAccount, //*
                        id_prenotazione: id
                    }),
                    headers: {"Content-Type": "application/json"}
                })
                .then(res => res.json())
                .then(data => this.setState( {
                    dettagliPagamento: data[0],
                    caricamentoDettagli: false
                } ))    
                .catch(err => { throw err; });
        }

        //Se la richiesta è di un b&b
        else {
          
            //Richiedo i dettagli del pagamento al db
                fetch("/gestione_prenotazione/dettagli_pagamento/beb", {
                    method: "POST", 
                    body: JSON.stringify({
                       id: idAccount, //*
                        id_prenotazione: id
                    }),
                    headers: ({"Content-Type": "application/json"})
                })
                .then(res => res.json())
                .then(data => this.setState( {
                    dettagliPagamento: data[0],
                    caricamentoDettagli: false
                } ))    
                .catch(err => { throw err; });   
        }   
        console.log(this.state)
    }

    render() {
        //Attendo l'arrivo dei dati dal db
        if(this.state.caricamentoDettagli) 
            return( <h1 style={{textAlign: "center", height: "500px", lineHeight:"500px", fontSize:'4vw'}}>Caricamento...</h1> );

        return(
            <div style={{height: "400px"}}>
                <div className="container justify-content-center mt-4 responsive">
                    <h4 style={{textAlign: "center"}}><b>Riepilogo pagamento</b></h4>
                    <hr color="#39FF0E"/>
                    <div>
                        <p className="mt-0">Data Pagamento: <b>{this.state.dettagliPagamento.data}</b></p>
                        <p className="mt-0">Importo: €<b>{(-1)*this.state.dettagliPagamento.importo}</b></p>
                    </div>
                </div>
            </div> 
        );
       
    }
}

export default DettagliPagamento;
