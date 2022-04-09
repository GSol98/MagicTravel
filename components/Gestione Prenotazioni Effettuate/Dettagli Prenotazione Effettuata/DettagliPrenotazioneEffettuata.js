import React from "react";
import DatiClienti from "./DatiClienti";
import DettagliRichiesta from "./DettagliRichiesta";

class DettagliPrenotazioneEffettuata extends React.Component {
    //==============================================
    //Costruttore
    //==============================================

    constructor() {
        super();

        //Inizializzo lo state con le variabili che utilizzerò
        this.state = {
            caricamentoDati: true,
            dettagliRichiesta: [],
            datiClienti: [],
            annullaPrenotazione: false,
            motivoAnnullamento: ""
        }
    }

    //==============================================
    //Funzione componentDidMount()
    //==============================================

    componentDidMount() {
        //Catturo il codice, ricevuto dalla pagina prenotazioni effettuate, che contiene id, tipo e stato
        let dati = window.location.hash.substring(1);
        let tipo = dati.substring(0, 1);
        let id = dati.substring(1, dati.length - 1);
        //Se la richiesta è di una casa vacanza
        if (tipo === 'C') {

            //Richiedo i dettagli della richiesta al db
            fetch("/dettagli_prenotazione_effettuata/dettagli_richiesta/casa_vacanze", {
                method: "POST",
                body: JSON.stringify({
                    id: id
                }),
                headers: ({ "Content-Type": "application/json" })
            })
                .then(res => res.json())
                .then(data => {
                    let dettagliRichiesta = data[0];

                    //Richiedo i dettagli dei clienti
                    fetch("/dettagli_prenotazione_effettuata/dati_clienti/casa_vacanze", {
                        method: "POST",
                        body: JSON.stringify({
                            id: id
                        }),
                        headers: ({ "Content-Type": "application/json" })
                    })
                        .then(res => res.json())
                        .then(data => this.setState({
                            dettagliRichiesta,
                            datiClienti: data,
                            caricamentoDati: false
                        }))
                        .catch(err => { throw err; });
                })
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
                headers: ({ "Content-Type": "application/json" })
            })
                .then(res => res.json())
                .then(data => {
                    let dettagliRichiesta = data[0];

                    //Richiedo i dettagli dei clienti
                    fetch("/dettagli_prenotazione_effettuata/dati_clienti/beb", {
                        method: "POST",
                        body: JSON.stringify({
                            id: id
                        }),
                        headers: ({ "Content-Type": "application/json" })
                    })
                        .then(res => res.json())
                        .then(data => this.setState({
                            dettagliRichiesta,
                            datiClienti: data,
                            caricamentoDati: false
                        }))
                        .catch(err => { throw err; });
                })
                .catch(err => { throw err; });
        }
    }

    handlePay = () => {
        //Riprendo i dati dall'URL
        let dati = window.location.hash.substring(1);
        let tipo = dati[0];

        window.location.href = `/FinestraPagamento#${tipo}${this.state.dettagliRichiesta.id_prenotazione}`;
    }

    dettagliPagamento = event => {
        //Riprendo i dati dall'URL
        let dati = window.location.hash.substring(1);
        let tipo = dati[0];

        window.location.href = `/DettagliPagamento#${tipo}${this.state.dettagliRichiesta.id_prenotazione}`;
    }


    handleCanceled = event => {
        //Riprendo i dati dall'URL
        let dati = window.location.hash.substring(1);
        let tipo = dati[0];

        window.location.href = `/AnnullaPrenotazioneEffettuata#${tipo}${this.state.dettagliRichiesta.id_prenotazione}`;

    }



    //==============================================
    //Funzione render()
    //==============================================

    render() {

        //Attendo l'arrivo dei dati dal db
        if (this.state.caricamentoDati)
            return (<h1 style={{ textAlign: "center", height: "500px", lineHeight: "500px", fontSize: '4vw' }}>Caricamento...</h1>);

        //Riprendo i dati dall'URL
        let dati = window.location.hash.substring(1);
        let tipo = dati[0];


        let bottoni = [];
        //Se lo stato è accettata stampo il bottone per poter effettuare il pagamento
        if (this.state.dettagliRichiesta.stato === "accettata") {
            bottoni.push
                (
                    <button
                        key="1"
                        type="button"
                        id="bottonePagamento"
                        className="btn btn-secondary btn-lg btn-block"
                        style={{ borderRadius: "12px" }}
                        onClick={this.handlePay}>
                        Effettua pagamento
                </button>
                );
            bottoni.push(
                <button
                    key="2"
                    type="button"
                    id="bottoneAnnullaPrenotazione"
                    className="btn btn-secondary btn-lg btn-block"
                    style={{ borderRadius: "12px", backgroundColor: "#f44336" }}
                    onClick={this.handleCanceled}>
                    Annulla prenotazione
                </button>
            );
        } else if (this.state.dettagliRichiesta.stato === "in attesa") {
            bottoni.push(
                <button
                    key="3"
                    type="button"
                    id="bottoneAnnullaPrenotazione"
                    className="btn btn-secondary btn-lg btn-block"
                    style={{ borderRadius: "12px", backgroundColor: "#f44336" }}
                    onClick={this.handleCanceled}>
                    Annulla prenotazione
                </button>
            );
        } else if (this.state.dettagliRichiesta.stato === "pagata") {
            bottoni.push(
                <button
                    key="4"
                    type="button"
                    id="bottoneRiepilogoPagamento"
                    className="btn btn-secondary btn-lg btn-block"
                    style={{ borderRadius: "12px" }}
                    onClick={this.dettagliPagamento}>
                    Dettagli pagamento
                </button>
            );

            bottoni.push(
                <button
                    key="5"
                    type="button"
                    id="bottoneAnnullaPrenotazione"
                    className="btn btn-secondary btn-lg btn-block"
                    style={{ borderRadius: "12px", backgroundColor: "#f44336" }}
                    onClick={this.handleCanceled}>
                    Annulla prenotazione
                </button>
            );
        }

        return (
            <div id="corpoDettagliPrenotazioneEffettuata" className="container mt-5 rounded shadow-lg p-5 impaginazione">
                <h4 className="mt-2" id='statoRichiestaPrenotazione'> <b>Stato:</b> {this.state.dettagliRichiesta.stato}</h4>
                <div className="row mt-5">
                    <div className="col-sm-6 ">
                        <DettagliRichiesta dettagli={this.state.dettagliRichiesta}
                            tipo={tipo} />
                        <p id="dettagliOrdine"></p>
                    </div>

                    <div className="col-sm-6">
                        <h4 style={{ textAlign: "center" }}> <b>Informazioni clienti: </b></h4>
                        <DatiClienti
                            datiClienti={this.state.datiClienti}
                            id_prenotazione={this.state.dettagliRichiesta.id_prenotazione}
                            tipo={tipo}
                            gestione_legale={this.state.dettagliRichiesta.gestione_legale}
                        />
                        <p id="datiClienti"></p>
                    </div>
                </div>
                <div>
                    {bottoni}

                </div>
            </div>
        );
    }
}
export default DettagliPrenotazioneEffettuata;