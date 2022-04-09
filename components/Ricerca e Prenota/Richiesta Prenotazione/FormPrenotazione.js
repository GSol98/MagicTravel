import React from "react";
import NumeroPersone from "./NumeroPersone.js";
import CheckIn from "./checkIn.js";
import CheckOut from "./checkOut.js";
import DatiPersona from "./DatiPersona.js";
import Intestazione from "../../Gestione Annunci/Dettagli Annuncio/Intestazione.js";
import PagaTasse from "./pagamentoTasse.js";
import ServiziCasaVacanze from "../../Gestione Annunci/Dettagli Annuncio/ServiziCasaVacanze.js";
import StanzeAnnuncio from "./stanzeAnnuncio.js";
import Calendario from "./Calendario.js";
import decripta from "../../../functions/decripta.js";
class FormPrenotazione extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            proprietario: false,
            prenotazioni: [],
            annuncio: {},
            stanze: [],
            paga_tasse: '',
            NumeroPersone: 1,
            CheckIn: "",
            CheckOut: "",
            Nome: [],
            Cognome: [],
            CodiceFiscale: [],
            DataDiNascita: [],
            NumeroDiTelefono: [],
            idStanzeDaPrenotare: [],
            costoPrenotazioneBeB: 0
        }
    }

    //==================================
    //Funzione componentDidMount()
    //==================================

    componentDidMount() {

        //Prendo l'id per controllare che l'annuncio non sia dell'utente che lo sta visualizzando.
        //In tal caso non verrà mostrato il pulsante prenota.
        //Il vero controllo sarà effettuato alla fine della funzione
        let id = decripta(window.sessionStorage.getItem("id_account"), window.sessionStorage.getItem("email"));

        //Prendo i dati utili dall'url
        let url = window.location.hash.substring(1);
        let campi = url.split('_');

        let annuncio = {}
        let stanze = [];

        //Recupero le informazioni dell'annuncio
        fetch("/richiesta_prenotazione/informazioni_annuncio", {
            method: "POST",
            body: JSON.stringify({
                idAnnuncio: campi[0],
                TipoAnnuncio: campi[1][0]
            }),
            headers: { "Content-Type": "application/json" }
        })
            .then(res => res.json())
            .then(data => {
                annuncio = data[0];

                //Se il tipo è b&b
                if (campi[1] === "B&B") {

                    //Recupero le stanze del b&b
                    fetch("/richiesta_prenotazione/stanze_annuncio_beb", {
                        method: "POST",
                        body: JSON.stringify({ idAnnuncio: campi[0] }),
                        headers: { "Content-Type": "application/json" }
                    })
                        .then(res => res.json())
                        .then(data1 => {
                            stanze = data1;

                            //Recupero le prenotazioni del b&b
                            fetch("/richiesta_prenotazione/recupero_prenotazioni_beb", {
                                method: "POST",
                                body: JSON.stringify({ idAnnuncio: campi[0] }),
                                headers: { "Content-Type": "application/json" }
                            })
                                .then(res => res.json())
                                .then(data2 => {
                                    let controllo = false;

                                    //Controllo se l'utente che sta visualizzando l'annuncio è il proprietario
                                    if (Number.parseInt(id) === annuncio.ref_proprietario)
                                        controllo = true;

                                    this.setState({
                                        prenotazioni: data2,
                                        stanze: stanze,
                                        annuncio: annuncio,
                                        loading: false,
                                        proprietario: controllo
                                    });
                                })
                                .catch(err => { throw err; });
                        })
                        .catch(err => { throw err; });
                }

                //Se l'annuncio è di una casa vacanza
                if (campi[1][0] === "C") {

                    //Recupero le prenotazioni della casa vacanza
                    fetch("/richiesta_prenotazione/recupero_prenotazioni_cv", {
                        method: "POST",
                        body: JSON.stringify({
                            idAnnuncio: campi[0],
                            TipoAnnuncio: campi[1]
                        }),
                        headers: { "Content-Type": "application/json" }
                    })
                        .then(res => res.json())
                        .then(data1 => {
                            let controllo = false;

                            //Controllo se l'utente che sta visualizzando l'annuncio è il proprietario
                            if (Number.parseInt(id) === annuncio.ref_proprietario)
                                controllo = true;

                            this.setState({
                                prenotazioni: data1,
                                annuncio: annuncio,
                                loading: false,
                                proprietario: controllo
                            });
                        })
                        .catch(err => { throw err; });
                }
            })
    }

    //=============================
    //Funzione handleChange()
    //=============================

    //Usato per conteggiare il numero di persone che parteciperà alla prenotazione,
    //per impostare il pagamento delle tasse insieme al totale e
    //per impostare le date di check_in e check_out
    handleChange = event => {
        const { type, name, value, checked } = event.target;
        if (name === "NumeroPersone") {
            this.setState({ [name]: Number.parseInt(value) })
        }
        else {
            type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
        }
    }

    //===================================
    //Funzione handleChangeDatiPersona()
    //===================================

    //Cattura l'inserimento di dati nei form Persona
    handleChangeDatiPersona = event => {
        const { name, value } = event.target;
        let nome = name.substring(0, 1);
        let id = name.substring(1, name.length);

        //Catturo il nome
        if (nome === "N") {
            let nomeState = this.state.Nome;
            nomeState[id] = value;
            this.setState({
                Nome: nomeState
            })
        }

        //Catturo il cognome
        else if (nome === "C") {
            let cognomeState = this.state.Cognome;
            cognomeState[id] = value;
            this.setState({
                Cognome: cognomeState
            })
        }

        //Catturo il codice fiscale
        else if (nome === "F") {
            let codiceFiscaleState = this.state.CodiceFiscale;
            codiceFiscaleState[id] = value;
            this.setState({
                CodiceFiscale: codiceFiscaleState
            })
        }

        //Catturo la data di nascita
        else if (nome === "D") {
            let dataDiNascitaState = this.state.DataDiNascita;
            dataDiNascitaState[id] = value;
            this.setState({
                DataDiNascita: dataDiNascitaState
            })
        }

        //Catturo il numero di telefono
        else if (nome === "H") {
            let numeroTelefono = this.state.NumeroDiTelefono;
            numeroTelefono[id] = value;
            this.setState({
                NumeroDiTelefono: numeroTelefono
            })
        }
    }

    //==========================================
    //Funzione handleChangeStanzeDaPrenotare()
    //==========================================

    //Permette di selezionare le stanze che si vogliono prenotare
    handleChangeStanzeDaPrenotare = event => {
        const { name, value, checked } = event.target;

        //Se è checked
        if (checked) {

            //Aggiungo l'id della stanza nell'array
            let idStanze = this.state.idStanzeDaPrenotare;
            idStanze.push(Number.parseInt(name));

            //Salvo l'id e il costo nello stato
            this.setState({
                idStanzeDaPrenotare: idStanze,
                costoPrenotazioneBeB: this.state.costoPrenotazioneBeB + Number.parseInt(value)
            })
        }

        //Se non è checked
        else {

            //Rimuovo l'id della stanza dall'array
            let idStanze = this.state.idStanzeDaPrenotare;
            idStanze.splice(idStanze.indexOf(Number.parseInt(name)), 1);

            //Aggiorno lo stato con gli id e il prezzo
            this.setState({
                idStanzeDaPrenotare: idStanze,
                costoPrenotazioneBeB: this.state.costoPrenotazioneBeB - Number.parseInt(value)
            })
        }
    }

    //=========================================
    //Funzione handleSubmitCasaVacanze()
    //=========================================

    //Avvia tutti i vari controlli per effettuare la prenotazione ed infine prenota
    handleSubmitCasaVacanze = event => {
        event.preventDefault();

        let controllo = false
        let prenotazioniFatteDaUtente = [];
        let id = decripta(window.sessionStorage.getItem("id_account"), window.sessionStorage.getItem("email"));

        //Controllo nel periodo inserito la casa cavanza sia disponibile
        let prenotata = false;
        for (let prenotazione of this.state.prenotazioni) {
            if ((this.state.CheckIn >= prenotazione.check_in && this.state.CheckIn <= prenotazione.check_out) ||
                (this.state.CheckOut >= prenotazione.check_in && this.state.CheckOut <= prenotazione.check_out) ||
                (this.state.CheckIn <= prenotazione.check_in && this.state.CheckOut >= prenotazione.check_out))
                prenotata = true;

            //Poichè l'utente non può prenotazre una casa vacanza per più di 28 giorni in
            //un anno, seleziono le sue prenotazioni per fare il conteggio dopo
            if (prenotazione.ref_cliente === Number.parseInt(id))
                prenotazioniFatteDaUtente.push(prenotazione);
        }

        //Se la casa è già stata prenotata nel periodo scelto invio un alert e imposto controllo a true
        if (prenotata) {
            alert("La casa vacanze è già prenotata in queste date")
            controllo = true;
        }

        //Controllo che le date di check-in e check-out siano inserite
        if (this.state.CheckIn === "" || this.state.CheckOut === "") {
            alert("Non hai inserito le date")
            controllo = true;
        }

        //Controllo che la data di check_in sia successiva alla data odierna
        if (new Date(this.state.CheckIn) < new Date()) {
            alert("La data di check-in non può essere minore o uguale al giorno corrente")
            controllo = true;
        }

        //Controllo che il check-out sia dopo il check-in
        if (new Date(this.state.CheckOut) < new Date(this.state.CheckIn)) {
            alert("Il checkout non può avvenire prima del checkIn")
            controllo = true;
        }

        //Controllo che l'utente non abbia superato i 28 giorni annui prenotazbili
        //Nel caso in cui le date di check-in e check-out fossero in anni diversi 
        //devo effettuare il controllo per tutti gli anni
        let giorniPrenotati;
        for (let anno = (new Date(this.state.CheckIn)).getFullYear(); anno <= (new Date(this.state.CheckOut)).getFullYear(); anno++) {
            giorniPrenotati = 0;

            //Prima controllo le prenotazioni già effettuate nell'anno corrente
            for (let prenotazione of prenotazioniFatteDaUtente) {

                //Incremento i giorni prenotati nell'anno corrente
                //Se il check-in o il check-out di una prenotazione è fuori anno considero rispettivamente il
                //primo o l'ultimo dell'anno
                if ((new Date(prenotazione.check_in)).getFullYear() === anno || (new Date(prenotazione.check_out)).getFullYear() === anno)
                    giorniPrenotati += ((Math.min(new Date(prenotazione.check_out), new Date(anno, 11, 31)) - Math.max(new Date(anno, 0, 1), new Date(prenotazione.check_in))) / (1000 * 60 * 60 * 24)) + 1;
            }

            //Dopo controllo le date prenotate
            giorniPrenotati += ((Math.min(new Date(this.state.CheckOut), new Date(anno, 11, 31)) - Math.max(new Date(anno, 0, 1), new Date(this.state.CheckIn))) / (1000 * 60 * 60 * 24)) + 1;

            //Se supera i 28 giorni non può prenotare
            if (giorniPrenotati > 28) {
                alert(`Non puoi prenotare la casa vacanze per più di 28 giorni cumulativi annui`);
                controllo = true;
                break;
            }
        }

        //Controllo che il numero di persone non sia superiore ai posti letto
        if ((this.state.NumeroPersone) > this.state.annuncio.numero_posti_letto) {
            alert("Il numero di persone indicato è superiore al numero di posti letto")
            controllo = true;
        }

        //Se la richiesta passa tutti i controlli salvo la prenotazione
        if (!controllo) {

            //Disattivo il pulsante in modo da non richiedere più prenotazioni
            document.getElementById('bottonePrenotazione').disabled = true;

            fetch("/richiesta_prenotazione/effettua_prenotazione_casa_vacanze", {
                method: "POST",
                body: JSON.stringify({
                    state: this.state,
                    idUtente: id
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => {
                    if (res.status === 200) {
                        alert("Prenotazione effettuata");
                        window.location.href = "/PrenotazioniEffettuate";
                    }
                    else
                        throw new Error();
                })
                .catch(err => {

                    //Riattivo il pulsante
                    document.getElementById('bottonePrenotazione').disabled = false;
                    alert("Errore: Impossibile effettuare la prenotazione")
                });
        }
    }

    //=============================
    //Funzione handleSubmitBeB()
    //=============================

    handleSubmitBeB = event => {
        event.preventDefault();

        //Recuper l'id dal sessionStorege. Verrà utilizzato dopo per effettuare la richiesta
        let id = decripta(window.sessionStorage.getItem("id_account"), window.sessionStorage.getItem("email"))

        let numero_posti_letto = 0;
        let controllo = false;

        //Sommo il numero dei posti letto delle stanze selezionate
        for (let stanzaA of this.state.stanze) {
            for (let stanzaP of this.state.idStanzeDaPrenotare)
                if (stanzaA.id_stanza === stanzaP)
                    numero_posti_letto += stanzaA.numero_posti_letto;
        }

        //Controllo che il numero dei posti letto selezionati sia superiore del numero di persone
        if (numero_posti_letto < this.state.NumeroPersone) {
            alert("Il numero dei posti letto non può esser inferiore al numero di persone")
            controllo = true;
        }

        //Controllo che le date di check-in e check-out siano inserite
        if (this.state.CheckIn === "" || this.state.CheckOut === "") {
            alert("Non hai inserito le date")
            controllo = true;
        }

        //Controllo che la data di check_in sia successiva alla data odierna
        if (new Date(this.state.CheckIn) < new Date()) {
            alert("La data di check-in non può essere minore o uguale al giorno corrente")
            controllo = true;
        }

        //Controllo che il check-out sia dopo il check-in
        if (new Date(this.state.CheckOut) < new Date(this.state.CheckIn)) {
            alert("Il checkout non può avvenire prima del checkIn")
            controllo = true;
        }

        //Se sono stati passati tutti i controlli invio la richiesta per memorizzare la prenotazione
        if (!controllo) {

            //Disattivo il pulsante in modo da non richiedere più prenotazioni
            document.getElementById('bottonePrenotazione').disabled = true;

            fetch("/richiesta_prenotazione/effettua_prenotazione_beb", {
                method: "POST",
                body: JSON.stringify({
                    state: this.state,
                    idUtente: id,
                    idStanzeDaPrenotare: this.state.idStanzeDaPrenotare
                }),
                headers: { "Content-Type": "application/json" }
            })
                .then(res => {
                    if (res.status === 200) {
                        alert("Prenotazione effettuata");
                        window.location.href = "/PrenotazioniEffettuate";
                    }
                    else
                        throw new Error();
                })
                .catch(err => {

                    //Riattivo il pulsante
                    document.getElementById('bottonePrenotazione').disabled = false;
                    alert("Errore: Impossibile effettuare la prenotazione")
                });
        }
    }

    //=============================
    //Funzione render()
    //=============================

    render() {

        //Attendo di ricevere tutti i dati prima di iniziare il render
        if (this.state.loading)
            return (<h1 style={{ textAlign: "center", height: "500px", lineHeight: "500px", fontSize: '4vw' }}>Caricamento...</h1>);

        //Calcolo il numero di giorni prenotati quando sono stati inseriti correttamente
        let numeroGiorni = 0;
        if (this.state.CheckIn !== "" && this.state.CheckOut !== "")
            numeroGiorni = (new Date(this.state.CheckOut) - new Date(this.state.CheckIn)) / (1000 * 60 * 60 * 24) + 1;

        //Eseguo una serie di controlli sulle date
        let controllo = false;

        //Controllo che la data di check_in sia successiva alla data odierna
        if (new Date(this.state.CheckIn) < new Date()) {
            controllo = true;
        }

        //Controllo che il check-out sia dopo il check-in
        if (new Date(this.state.CheckOut) < new Date(this.state.CheckIn)) {
            controllo = true;
        }

        //Se ci sono problemi stampo un'avvertenza
        let avvertenza = '';
        if (controllo)
            avvertenza = <p className='text-danger ml-3'>Le date inserite non permetteranno di effettuare la prenotazione</p>;

        //Creo tanti form persona secondo il numero inserito dall'utente
        let listaPersone = []
        for (var i = 0; i < this.state.NumeroPersone - 1; i++) {
            var titolo = `Persona ${(i + 1)}`
            listaPersone.push(<DatiPersona
                key={i}
                id={i}
                Persona={titolo}
                state={this.state}
                handleChange={this.handleChangeDatiPersona}
            />)
        }


        //Calcolo il prezzo totale della prenotazione
        let costoTotale = this.state.annuncio.tipo_alloggio === 'B&B' ?
            this.state.costoPrenotazioneBeB * numeroGiorni :
            this.state.annuncio.costo * numeroGiorni;

        //Se viene spuntata la checkbox per pagare le tasse con il totale
        if (this.state.paga_tasse === true)
            costoTotale += (this.state.annuncio.tassa_soggiorno * this.state.NumeroPersone * (numeroGiorni < 1 ? 0 : numeroGiorni - 1));

        //Creo tanti oggetti stanze quante le stanze dell'annuncio
        let riepilogoStanze = [];
        if (this.state.annuncio.tipo_alloggio === 'B&B') {
            for (let [index, stanza] of this.state.stanze.entries()) {
                riepilogoStanze.push(
                    <StanzeAnnuncio
                        key={index}
                        id={index}
                        idStanza={stanza.id_stanza}
                        prezzo={stanza.prezzo}
                        state={stanza}
                        handleChange={this.handleChangeStanzeDaPrenotare}
                        prenotazioni={this.state.prenotazioni}
                        stato={this.state}
                    />
                )
            }
        }


        return (
            <form className="container was-validated mb-5" onSubmit={
                this.state.annuncio.tipo_alloggio === 'B&B' ?
                    this.handleSubmitBeB :
                    this.handleSubmitCasaVacanze
            }>
                <div style={{ marginBottom: '100px', marginTop: '40px' }}>
                    <b><Intestazione state={this.state.annuncio} /></b>
                </div>

                {this.state.annuncio.tipo_alloggio !== 'B&B' ?
                    <div style={{ margin: '100px 0px' }}>
                        <ServiziCasaVacanze state={this.state.annuncio} />
                    </div> : ''}

                <h3>Seleziona il numero di viaggiatori e il periodo in cui si desidera prenotare</h3>
                <p>Nell'inserimento dei dati personali il proprietario dell'account non verrà conteggiato</p>

                <div className="my-5">
                    <div className="my-3">
                        <NumeroPersone
                            state={this.state}
                            handleChange={this.handleChange}
                        />
                    </div>
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-6 my-3">
                            <CheckIn
                                state={this.state}
                                handleChange={this.handleChange}
                            />
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 my-3">
                            <CheckOut
                                state={this.state}
                                handleChange={this.handleChange}
                            />
                        </div>
                        {avvertenza}
                    </div>
                </div>

                {
                    this.state.annuncio.tipo_alloggio === 'B&B' ?
                        ''
                        :
                        <div className="d-flex justify-content-center">
                            <Calendario listaPrenotazioni={this.state.prenotazioni} />
                        </div>
                }

                <div className="my-5">
                    {listaPersone}
                </div>

                {this.state.annuncio.tipo_alloggio === 'B&B' ? <div className="mt-3"><h3>Stanze disponibili</h3><p>(Spuntare le stanze che si vogliono prenotazre)</p>{riepilogoStanze}</div> : ''}

                <h4 className="mt-5">Costo prenotazione al giorno: {this.state.annuncio.tipo_alloggio === 'B&B' ?
                    this.state.costoPrenotazioneBeB :
                    this.state.annuncio.costo}€</h4>
                <h4>Tasse Di Soggiorno a notte: {this.state.annuncio.tassa_soggiorno * this.state.NumeroPersone}€</h4>
                <h4>Giorni prenotati: {numeroGiorni} giorni</h4>
                <h2>Costo totale: {costoTotale}€</h2>

                <PagaTasse
                    state={this.state}
                    handleChange={this.handleChange}
                />

                <br />
                <p className="text-danger">Nb: dopo aver effettuato la richiesta, sarà possibile, in prenotazioni effettuate, caricare i documenti dei partecipanti per semplificare le operazioni di check_in!</p>
                <br />
                {!this.state.proprietario ?
                    <button id='bottonePrenotazione' className="btn btn-lg btn-secondary btn-block mt-3">Prenota</button> :
                    'Sei il proprietario di questo annuncio. Hai solo la possibilità di simulare una prenotazione.'}
            </form>
        )
    }
}

export default FormPrenotazione;
