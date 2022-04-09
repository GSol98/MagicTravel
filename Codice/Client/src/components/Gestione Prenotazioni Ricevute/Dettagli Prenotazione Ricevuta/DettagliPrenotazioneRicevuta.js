import React from "react";
import DettagliRichiesta from "./DettagliRichiesta";
import DatiClienti from "./DatiClienti";
import TasseDiSoggiorno from "../Tasse Di Soggiorno/TasseDiSoggiorno";
import GestioneLegale from "../Gestione Legale/GestioneLegale";
import AnnullaPrenotazioneRicevuta from "../Annulla Prenotazione Ricevuta/AnnullaPrenotazioneRicevuta";

class DettagliPrenotazioneRicevuta extends React.Component {

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
            tasse: false,
            gestioneLegale: false,
            annullaPrenotazione: false,
            motivoAnnullamento: ""
        }
    }

    //==============================================
    //Funzione componentDidMount()
    //==============================================

    componentDidMount() {
        //Catturo il codice, ricevuto dalla pagina lista, che contiene id, tipo e stato
        let dati = window.location.hash.substring(1);

        //Se la richiesta è di una casa vacanza
        if (dati[0] === 'C') {

            //Richiedo i dettagli della richiesta al db
            fetch("/dettagli_prenotazioni_ricevute/dettagli_richiesta/casa_vacanze", {
                method: "POST",
                body: JSON.stringify({
                    id: dati.slice(1, dati.length - 1)
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => res.json())
                .then(data => {
                    let dettagliRichiesta = data[0];

                    //Richiedo i dettagli dei clienti
                    fetch("/dettagli_prenotazioni_ricevute/dati_clienti/casa_vacanze", {
                        method: "POST",
                        body: JSON.stringify({
                            id: dati.slice(1, dati.length - 1)
                        }),
                        headers: { "Content-Type": "application/json" }
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
            fetch("/dettagli_prenotazioni_ricevute/dettagli_richiesta/beb", {
                method: "POST",
                body: JSON.stringify({
                    id: dati.slice(1, dati.length - 1)
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => res.json())
                .then(data => {
                    let dettagliRichiesta = data[0];

                    //Richiedo i dettagli dei clienti
                    fetch("/dettagli_prenotazioni_ricevute/dati_clienti/beb", {
                        method: "POST",
                        body: JSON.stringify({
                            id: dati.slice(1, dati.length - 1)
                        }),
                        headers: { "Content-Type": "application/json" }
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

    //==============================================
    //Funzione cambiaStato()
    //==============================================

    //Cambia lo stato di una prenotazione
    cambiaStato = event => {

        //Disabilito i pulsanti per evitare errori causati da click doppi
        document.getElementById('bottoneAccetta').disabled = true;
        document.getElementById('bottoneRifiuta').disabled = true;

        //Prendo i dati del campo value e ne faccio lo split 
        let arr = event.target.value.split('/');

        //Se è la prenotazione di una casa vacanza
        if (arr[1] === 'C') {
            fetch("/dettagli_prenotazioni_ricevute/casa_vacanza/cambia_stato", {
                method: "POST",
                body: JSON.stringify({
                    id: arr[0],
                    stato: arr[2]
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => {
                    if (res.status === 200) {
                        //Ricarico l'intera pagina in modo da avere il nuovo stato
                        window.location.reload();
                    }
                })
                .catch(err => { throw err; });
        }

        //Se è la prenotazione di un b&b
        else {

            fetch("/dettagli_prenotazioni_ricevute/beb/cambia_stato", {
                method: "POST",
                body: JSON.stringify({
                    dettagli: this.state.dettagliRichiesta,
                    stato: arr[2]
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => {
                    if (res.status === 200) {
                        //Ricarico l'intera pagina in modo da avere il nuovo stato
                        window.location.reload();
                    }
                })
                .catch(err => { throw err; });
        }
    }

    //==============================================
    //Funzione gestioneTasse()
    //==============================================

    //Permette di visualizzare la finestra per la gestione delle tasse di soggiorno
    gestioneTasse = () => {
        this.setState({
            tasse: !this.state.tasse
        });
    }

    //==============================================
    //Funzione gestioneLegale()
    //==============================================

    //Permette di visualizzare la finestra per l'invio dei dati alla questura
    gestioneLegale = () => {
        this.setState({
            gestioneLegale: !this.state.gestioneLegale
        });
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
    //Funzione pagaTasse()
    //==============================================

    pagaTasse = () => {

        //Disabilito il bottone in modo da risolvere alcuni problemi dati dal doppio click
        document.getElementById('bottoneTassaSoggiorno').disabled = true;

        //Prendo le informazioni dall'URL
        let dati = window.location.hash.substring(1);

        //Se è una richiesta per una casa vacanze
        if (dati[0] === 'C') {

            //Pago la tassa di soggiorno
            fetch("/dettagli_prenotazioni_ricevute/tassa_soggiorno/casa_vacanze", {
                method: "POST",
                body: JSON.stringify({
                    dettagli: this.state.dettagliRichiesta,
                    datiClienti: this.state.datiClienti
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => {
                    if (res.status === 200) {
                        window.alert('Pagamento effettuato. È stata inviata una email al settore del turismo. I tempi di invio sono proporzionali alle dimensioni degli allegati.');

                        //Ricarico la pagina per avere i nuovi dati dal db
                        window.location.reload();
                    }
                })
                .catch(err => {

                    //Riabilito il pulsante
                    document.getElementById('bottoneTassaSoggiorno').disabled = false;
                    throw err;
                });
        }

        //Se è una richiesta per un beb
        else {

            //Pago la tassa di soggiorno
            fetch("/dettagli_prenotazioni_ricevute/tassa_soggiorno/beb", {
                method: "POST",
                body: JSON.stringify({
                    dettagli: this.state.dettagliRichiesta,
                    datiClienti: this.state.datiClienti
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => {
                    if (res.status === 200) {
                        window.alert('Pagamento effettuato. È stata inviata una email al settore del turismo. I tempi di invio sono proporzionali alle dimensioni degli allegati.');

                        //Ricarico la pagina per avere i nuovi dati dal db
                        window.location.reload();
                    }
                })
                .catch(err => {

                    //Riabilito il pulsante
                    document.getElementById('bottoneTassaSoggiorno').disabled = false;
                    throw err;
                });
        }
    }

    //==============================================
    //Funzione inviaDatiQuestura()
    //==============================================

    inviaDatiQuestura = () => {

        //Disabilito il bottone in modo da risolvere alcuni problemi legati al doppio click
        document.getElementById('bottoneGestioneLegale').disabled = true;

        //Prendo le informazioni dall'URL
        let dati = window.location.hash.substring(1);

        //Se è una richiesta per una casa vacanze
        if (dati[0] === 'C') {

            //Invio i dati alla questura
            fetch("/dettagli_prenotazioni_ricevute/gestione_legale/casa_vacanze", {
                method: "POST",
                body: JSON.stringify({
                    datiClienti: this.state.datiClienti,
                    id_prenotazione: this.state.dettagliRichiesta.id_prenotazione,
                    ref_proprietario: this.state.dettagliRichiesta.ref_proprietario
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => {
                    if (res.status === 200) {
                        alert('Dati correttamente inviati alla questura!\nPer maggiori informazioni visionare lo stato delle tasse di soggiorni!');

                        //Ricarico la pagina per avere i nuovi dati dal db
                        window.location.reload();
                    }
                    if (res.status === 500)
                        alert('Inserire documenti');
                })
                .catch(err => {

                    //Riabilito il pulsante
                    document.getElementById('bottoneGestioneLegale').disabled = false;
                    throw err;
                });
        }

        //Se è una richiesta per un beb
        else {

            //Invio i dati alla questura
            fetch("/dettagli_prenotazioni_ricevute/gestione_legale/beb", {
                method: "POST",
                body: JSON.stringify({
                    datiClienti: this.state.datiClienti,
                    dettagli: this.state.dettagliRichiesta
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => {
                    if (res.status === 200) {
                        alert('Dati correttamente inviati alla questura!\nPer maggiori informazioni visionare lo stato delle tasse di soggiorni!');

                        //Ricarico la pagina per avere i nuovi dati dal db
                        window.location.reload();
                    }
                    if (res.status === 500)
                        alert('Inserire documenti');
                })
                .catch(err => {

                    //Riabilito il pulsante
                    document.getElementById('bottoneGestioneLegale').disabled = false;
                    throw err;
                });
        }
    }

    //==============================================
    //Funzione cambiaStatoAnnullaPrenotazione()
    //==============================================

    //Cambiando lo stato ad annullaPrenotazione invece del bottone annulla renderizzo 
    //il modullo per annullare
    cambiaStatoAnnullaPrenotazione = () => {
        this.setState({
            annullaPrenotazione: true
        });
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

    //==============================================
    //Funzione inviaEmailAnnullamento
    //==============================================

    inviaEmailAnnullamento = () => {

        //Disattivo il pulsante per evitare problemi legati al doppio click
        document.getElementById('annullaPrenotazioneRicevutaBottoneAnnulla').disabled = true;

        //Prendo informazioni dall'URL
        let dati = window.location.hash.substring(1);

        //Se è un prenotazione per una casa vacanza
        if (dati[0] === 'C') {

            //Annullo la richiesta
            fetch("/dettagli_prenotazioni_ricevute/annulla_prenotazione/casa_vacanze", {
                method: "POST",
                body: JSON.stringify({
                    dettagli: this.state.dettagliRichiesta,
                    motivo: this.state.motivoAnnullamento
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => {
                    if (res.status === 200) {

                        //Stampo un allert con un messagio
                        window.alert("Abbiamo inoltrato una email per l'annullamento della prenotazione");

                        //Ricarico l'intera pagina per avere le nuove informazioni
                        window.location.reload();
                    }
                })
                .catch(err => {

                    //Riattivo il pulsante
                    document.getElementById('annullaPrenotazioneRicevutaBottoneAnnulla').disabled = false;
                    throw err;
                });
        }

        //Se è un annuncio per un b&b
        else {

            //Annullo la richiesta
            fetch("/dettagli_prenotazioni_ricevute/annulla_prenotazione/beb", {
                method: "POST",
                body: JSON.stringify({
                    dettagli: this.state.dettagliRichiesta,
                    motivo: this.state.motivoAnnullamento
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => {
                    if (res.status === 200) {

                        //Stampo un allert con un messagio
                        window.alert("Abbiamo inoltrato una email per l'annullamento della prenotazione");

                        //Ricarico l'intera pagina per avere le nuove informazioni
                        window.location.reload();
                    }
                })
                .catch(err => {

                    //Riattivo il pulsante
                    document.getElementById('annullaPrenotazioneRicevutaBottoneAnnulla').disabled = false;
                    throw err;
                });
        }
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

        //Se lo stato è in attesa stampo i bottoni accetta e rifiuta
        let perStato = [];
        if (this.state.dettagliRichiesta.stato === 'in attesa') {
            perStato.push(<button key="1" type="button" id='bottoneAccetta' className="btn btn-success" value={`${this.state.dettagliRichiesta.id_prenotazione}/${tipo}/accettata`} onClick={this.cambiaStato}>Accetta</button>);
            perStato.push(<button key="2" type="button" id='bottoneRifiuta' className="btn btn-danger" value={`${this.state.dettagliRichiesta.id_prenotazione}/${tipo}/rifiutata`} onClick={this.cambiaStato}>Rifiuta</button>);
        }

        //Controllo se lo stato è 'accettata' o 'pagata' e se ci sono più di due settimane 
        //dalla data di check-in per permettere l'annullamento della prenotazione
        let finestraAnnulla;
        if (this.giorni_tra(new Date(this.state.dettagliRichiesta.check_in), new Date()) > 14 && (this.state.dettagliRichiesta.stato === 'accettata' || this.state.dettagliRichiesta.stato === 'pagata'))
            finestraAnnulla = <AnnullaPrenotazioneRicevuta stampaModulo={this.state.annullaPrenotazione}
                cambiaStatoStampaModulo={this.cambiaStatoAnnullaPrenotazione}
                aggiornaMotivoAnnullamento={this.aggiornaMotivoAnnullamento}
                inviaEmailAnnullamento={this.inviaEmailAnnullamento} />

        //Se lo stato è diverso da 'annullata' mostro i pulsanti gestione legale e tassa di soggiorno 
        let pulsanti = [];

        //Se la richiesta è pagata controllo le gestioni (tasse e legali)
        if (this.state.dettagliRichiesta.stato === 'pagata') {

            //Controllo se le tasse sono state già pagate o no
            let statoTassaDiSoggiorno = (this.state.dettagliRichiesta.tassa_soggiorno_tot === 0) ? 'da pagare' : 'pagate';

            //Se le tasse devono essere ancora pagate calcolo quanti giorni mancano alla scadenza (tre mesi dalla data di richiesta)
            if (statoTassaDiSoggiorno === 'da pagare') {
                let check_out = new Date(this.state.dettagliRichiesta.check_out);
                let dataScadenza = new Date(
                    (check_out.getMonth() + 3 > 11) ? check_out.getFullYear() + 1 : check_out.getFullYear(),
                    (check_out.getMonth() + 3) % 12,
                    check_out.getDate()
                );
                if (new Date() - dataScadenza > 0)
                    statoTassaDiSoggiorno = <b>sono passati più di tre mesi dal check out!'</b>;
                else
                    statoTassaDiSoggiorno = `mancano ${Math.floor((dataScadenza - new Date()) / (1000 * 60 * 60 * 24))} giorni alla scadenza`;
            }

            //Gestisco le tasse di soggiorno
            pulsanti.push(<button key="1" type="button" onClick={this.gestioneTasse} id="bottoneTasseSoggiorno" className="btn btn-secondary btn-lg btn-block">Gestione tasse di soggiorno</button>);
            if (this.state.tasse) pulsanti.push(<TasseDiSoggiorno key="2" tasse={this.state.dettagliRichiesta.tassa_soggiorno_tot}
                numeroPersone={this.state.dettagliRichiesta.numero_partecipanti}
                tassaAPersona={this.state.dettagliRichiesta.tassa_soggiorno}
                pagaTasse={this.pagaTasse}
                statoTassaDiSoggiorno={statoTassaDiSoggiorno}
                giorniPernottamento={this.giorni_tra(new Date(this.state.dettagliRichiesta.check_out), new Date(this.state.dettagliRichiesta.check_in))} />);

            //Gestisco l'invio dei dati dei clienti alla questura
            pulsanti.push(<button key="3" type="button" onClick={this.gestioneLegale} id="bottoneGestioneLegale" className="btn btn-secondary btn-lg btn-block">Gestione legale</button>);
            if (this.state.gestioneLegale) pulsanti.push(<GestioneLegale key="4" gestioneLegale={this.state.dettagliRichiesta.gestione_legale}
                inviaDati={this.inviaDatiQuestura}
                id_prenotazione={this.state.dettagliRichiesta.id_prenotazione}
                tipo={tipo} />);
        }

        return (
            <div className="container mt-5 rounded shadow-lg p-5 impaginazione" id="corpoDettagliPrenotazioneRicevuta">
                <div id='statoRichiestaPrenotazione'>
                    <h4 className="mt-2"><b>Stato:</b> {this.state.dettagliRichiesta.stato}</h4>
                    {perStato}
                    {finestraAnnulla}
                </div>
                <div className="row mt-5" id="dettagliClientiEPrenotazione">
                    <div className="col-sm-6">
                        <DettagliRichiesta dettagli={this.state.dettagliRichiesta}
                            tipo={tipo} />
                        <p id="dettagliOrdine"></p>
                    </div>
                    <div className="col-sm-6">
                        <h4 style={{ textAlign: "center" }}><b>Informazioni clienti: </b></h4>
                        <DatiClienti datiClienti={this.state.datiClienti} />
                        <p id="datiClienti"></p>
                    </div>
                </div>
                <div>
                    {pulsanti}
                </div>
            </div>
        );
    }
}

export default DettagliPrenotazioneRicevuta;
