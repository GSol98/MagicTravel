import React from "react";

class AnnullaPrenotazioneEffettuata extends React.Component {

    //==============================================
    //Costruttore
    //==============================================

    constructor() {
        super();

        //Inizializzo lo state con le variabili che utilizzerò
        this.state = {
            caricamentoDati: true,
            dettagliRichiesta: [],
            motivoAnnullamento: ""
        }
    }

    //==============================================
    //Funzione componentDidMount()
    //==============================================

    componentDidMount() {
        //Catturo il codice, ricevuto dalla pagina precedente, che contiene tipo e id
        let dati = window.location.hash.substring(1);
        let tipo = dati.substring(0, 1);
        let id = dati.substring(1, dati.length);

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
                .then(data => this.setState({
                    dettagliRichiesta: data[0],
                    caricamentoDati: false
                }))
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
                .then(data => this.setState({
                    dettagliRichiesta: data[0],
                    caricamentoDati: false
                }))
                .catch(err => { throw err; });

        }
    }

    //==============================================
    //Funzione aggiornaMotivoAnnullamento()
    //==============================================

    //Mentre l'utente inserisce la motivazione questa viene memorizzata in
    //motivoAnnullamento
    aggiornaMotivoAnnullamento = event => {
        this.setState({
            motivoAnnullamento: event.target.value
        });
    }

    rimborso = () => {
        //Catturo il codice, ricevuto dalla pagina precedente, che contiene tipo e id
        let dati = window.location.hash.substring(1);
        let tipo = dati[0];

        //Se la richiesta è di una casa vacanza
        if (tipo === 'C') {
            //Effettuo il rimborso
            fetch("/gestione_prenotazione/rimborso_pagamento/casa_vacanze", {
                method: "POST",
                body: JSON.stringify({
                    dettagli: this.state.dettagliRichiesta
                }),

                headers: ({ "Content-Type": "application/json" })
            })
                .then(res => {

                    if (res.status === 200) {
                        window.location.href = `/DettagliPrenotazioneEffettuata#${tipo}${this.state.dettagliRichiesta.id_prenotazione}${this.state.dettagliRichiesta.stato}`;
                        window.alert("Rimborso Effettuato. Per maggiori informazioni visionare la pagina gestione economica in gestione account.");
                    }

                })
                .catch(err => { throw err; });
        } else {

            //Effettuo il rimborso
            fetch("/gestione_prenotazione/rimborso_pagamento/beb", {
                method: "POST",
                body: JSON.stringify({
                    dettagli: this.state.dettagliRichiesta
                }),

                headers: ({ "Content-Type": "application/json" })
            })
                .then(res => {

                    if (res.status === 200) {
                        window.location.href = `/DettagliPrenotazioneEffettuata#${tipo}${this.state.dettagliRichiesta.id_prenotazione}${this.state.dettagliRichiesta.stato}`;
                        window.alert("Rimborso Effettuato. Per maggiori informazioni visionare la pagina gestione economica in gestione account.");
                    }

                })
                .catch(err => { throw err; });
        }
    }

    //==============================================
    //Funzione giorni_tra
    //==============================================

    //Calcola la differenza tra due giorni
    giorni_tra = (date1, date2) => {
        var ONE_DAY = 1000 * 60 * 60 * 24;
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();
        var difference_ms = date1_ms - date2_ms;
        return Math.round(difference_ms / ONE_DAY);
    }

    //==============================================
    //Funzione inviaEmailAnnullamento
    //==============================================

    inviaEmailAnnullamento = () => {

        //Catturo il codice, ricevuto dalla pagina precedente, che contiene tipo e id
        let dati = window.location.hash.substring(1);
        let tipo = dati[0];

        let res = window.confirm("Sei sicuro di voler annullare la prenotazione?");

        //Stampo un allert con un messagio
        window.alert("Invieremo un'email al proprietario dell'annuncio, in cui comunicheremo l'annullamento della prenotazione.")

        if (res) {

            //Disattivo il pulsante annula per evitare problemi legati al doppio click
            document.getElementById('annullaPrenotazioneEffettuataBottoneConferma').disabled = true;

            //Se è un prenotazione per una casa vacanza
            if (tipo === 'C') {

                //Annullo la richiesta
                fetch("/gestione_prenotazione/annulla_prenotazione/casa_vacanze", {
                    method: "POST",
                    body: JSON.stringify({
                        dettagli: this.state.dettagliRichiesta,
                        motivo: this.state.motivoAnnullamento,

                    }),
                    headers: ({ "Content-Type": "application/json" })
                })
                    .then(res => {
                        if (res.status === 200) {

                            //Stampo un allert
                            alert('Prenotazione annullata');

                            //Se l'utente effettua l'annullamento entro 7 giorni dalla data di chek-in si procede al rimborso 
                            if ((this.giorni_tra(new Date(this.state.dettagliRichiesta.check_in), new Date()) > 7) && this.state.dettagliRichiesta.stato === "pagata")
                                this.rimborso()
                            else
                                window.location.href = `/DettagliPrenotazioneEffettuata#${tipo}${this.state.dettagliRichiesta.id_prenotazione}${this.state.dettagliRichiesta.stato}`;
                        }
                    })
                    .catch(err => {

                        //Riattivo il pulsante
                        document.getElementById('annullaPrenotazioneEffettuataBottoneConferma').disabled = false;
                        throw err;
                    });

            }

            //Se è un annuncio per un b&b
            else {

                //Annullo la richiesta
                fetch("/gestione_prenotazione/annulla_prenotazione/beb", {
                    method: "POST",
                    body: JSON.stringify({
                        dettagli: this.state.dettagliRichiesta,
                        motivo: this.state.motivoAnnullamento,

                    }),
                    headers: ({ "Content-Type": "application/json" })
                })
                    .then(res => {
                        if (res.status === 200) {

                            //Stampo un allert
                            alert('Prenotazione annullata');

                            //Se l'utente effettua l'annullamento entro 7 giorni dalla data di chek-in si procede al rimborso 
                            if ((this.giorni_tra(new Date(this.state.dettagliRichiesta.check_in), new Date()) > 7) && this.state.dettagliRichiesta.stato === "pagata")
                                this.rimborso()
                            else
                                window.location.href = `/DettagliPrenotazioneEffettuata#${tipo}${this.state.dettagliRichiesta.id_prenotazione}${this.state.dettagliRichiesta.stato}`;
                        }
                    })
                    .catch(err => {

                        //Riattivo il pulsante
                        document.getElementById('annullaPrenotazioneEffettuataBottoneConferma').disabled = false;
                        throw err;
                    });

            }
        }
    }




    render() {
        //Attendo l'arrivo dei dati dal db
        if (this.state.caricamentoDati)
            return (<h1 style={{ textAlign: "center", height: "500px", lineHeight: "500px", fontSize: '4vw' }}>Caricamento...</h1>);

        return (
            <div className="container d-flex justify-content-center mt-5 rounded shadow-lg p-5 impaginazione" id="corpoDettagliPrenotazioneRicevuta">

                <form >
                    <h3 className="d-flex justify-content-center mt-5"> <b>Annulla prenotazione</b></h3>
                    <h5>Quali sono le motivazioni dell'annullamento? </h5>

                    <div>
                        <label htmlFor="annullaPrenotazioneEffettuataTextarea"> La risposta è facoltativa, ma rispondendo ci aiuterai a fornirti un servizio migliore.</label>
                        <textarea className="border-dark form-control" placeholder="(facoltativo)" onChange={this.aggiornaMotivoAnnullamento} name="messaggio" id="annullaPrenotazioneEffettuataTextarea" rows="10"></textarea>
                    </div>

                    <div>
                        <br />
                        <button id="annullaPrenotazioneEffettuataBottoneConferma" type="button" className="btn btn-success btn-block mb-5" onClick={this.inviaEmailAnnullamento}>Conferma</button>
                    </div>

                </form>

            </div>
        )

    }
}

export default AnnullaPrenotazioneEffettuata;