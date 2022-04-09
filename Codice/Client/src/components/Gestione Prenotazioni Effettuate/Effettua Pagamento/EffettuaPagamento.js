import React from "react";
import Pagamento from "./Pagamento";

class EffettuaPagamento extends React.Component {
    
    //==============================================
    //Costruttore
    //==============================================

    constructor() {
        super();

        //Inizializzo lo state con le variabili che utilizzerò
        this.state = {
            caricamentoDati: true,
            dettagliRichiesta: [], 
                  
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
        //Se la richiesta è di una casa vacanza
        if(tipo === 'C') {

            //Richiedo i dettagli della richiesta al db
            fetch("/dettagli_prenotazione_effettuata/dettagli_richiesta/casa_vacanze", {
                method: "POST", 
                body: JSON.stringify({
                    id: id
                }),
                headers: {"Content-Type": "application/json"}
            })
            .then(res => res.json())
            .then(data => this.setState( {
                dettagliRichiesta: data[0],
                caricamentoDati: false
            } ))    
            .catch(err => { throw err; });
         
        }

        //Se la richiesta è di un b&b
        else {

            //Richiedo i dettagli della richiesta
            fetch("/dettagli_prenotazione_effettuata/dettagli_richiesta/beb", {
                method: "POST", 
                body: JSON.stringify({
                    id: id
                }),
                headers: new Headers ({"Content-Type": "application/json"})
            })
            .then(res => res.json())
            .then(data => this.setState( {
                dettagliRichiesta: data[0],
                caricamentoDati: false          
             } ))    
            .catch(err => { throw err; });
        
        }   
    }

    //==============================================
    //Funzione paga()
    //==============================================

    paga = event => {
        event.preventDefault();
        //Catturo il codice, ricevuto dalla pagina precedente, che contiene tipo e id
        let dati = window.location.hash.substring(1);
        let tipo = dati[0];

        let res = window.confirm("Sei sicuro di voler procedere?");
        
        if(res) {

            //Disattivo il pulsante pagamento per evitare problemi legati al duppio click
            document.getElementById('pulsantePagamento').disabled = true;

            //Se è una richiesta per una casa vacanze
            if(tipo === 'C') {
                fetch("/gestione_prenotazione/pagamento/casa_vacanze", {
                    method: "POST", 
                    body: JSON.stringify({
                        dettagli: this.state.dettagliRichiesta                      
                    }),
                    headers: {"Content-Type": "application/json"}
                })
                .then(res => {
                    if(res.status === 200) {
                        
                        //Stampo un allert con un messagio
                        window.alert("Pagamento Effettuato");

                        window.location.href = `/DettagliPagamento#${tipo}${this.state.dettagliRichiesta.id_prenotazione}`;
                    }
                })
                .catch(err => { 

                    //Riattivo il pulsante
                    document.getElementById('pulsantePagamento').disabled = false;
                    throw err; 
                }); 
            }

            //Se è una richiesta per un beb
            else {
                fetch("/gestione_prenotazione/pagamento/beb", {
                    method: "POST", 
                    body: JSON.stringify({
                        dettagli: this.state.dettagliRichiesta
                    }),
                    headers: new Headers ({"Content-Type": "application/json"})
                })
                .then(res => {
                    if(res.status === 200) {
                        
                        //Stampo un allert con un messagio
                        window.alert("Pagamento Effettuato");

                        window.location.href = `/DettagliPagamento#${tipo}${this.state.dettagliRichiesta.id_prenotazione}`;
                    }
                })
                .catch(err => { 
                    
                    //Riattivo il pulsante
                    document.getElementById('pulsantePagamento').disabled = false;
                    throw err; 
                }); 
            }
        }
    }
     
    render() {
        //Attendo l'arrivo dei dati dal db
        if(this.state.caricamentoDati) 
            return( <h1 style={{textAlign: "center", height: "400px", lineHeight:"400px"}}>Caricamento...</h1> );
        
        return(
            <div className="container mt-5 rounded shadow-lg impaginazione py-5">
                <Pagamento importo={this.state.dettagliRichiesta.prezzo_no_tasse}
                            paga={this.paga}/>
            </div>
            );
    }
}

export default EffettuaPagamento;