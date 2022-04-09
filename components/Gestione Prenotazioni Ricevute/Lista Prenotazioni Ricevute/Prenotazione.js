import React from "react";

const Prenotazione = props => {

    //Imposto le due variabili sotto, utili per dare la colorazione alla scritta e 
    //nella composizione dell'URL della pagina dettaglio della prenotazione
    let statoTrasmissione;
    let statoColore
    switch (props.prenotazione.stato) {
        case 'in attesa':
            statoTrasmissione = 0;
            statoColore = { color: 'gray' };
            break;

        case 'accettata':
            statoTrasmissione = 1;
            statoColore = { color: '#EFCD00' };
            break;

        case 'rifiutata':
            statoTrasmissione = 2;
            statoColore = { color: 'red' };
            break;

        case 'annullata':
            statoTrasmissione = 3;
            statoColore = { color: 'black' };
            break;

        case 'pagata':
            statoTrasmissione = 4;
            statoColore = { color: 'green' };
            break;

        default:
            break;
    }

    //Codifico tipo sempre per la creazione dell'URL
    let tipo = props.tipo === 'B&B' ? 'B' : 'C';

    //Creo URL
    let destinazione = `/DettagliPrenotazioneRicevuta#${tipo}${props.prenotazione.id_prenotazione}${statoTrasmissione}`;

    //Controllo se le tasse sono state già pagate o no
    let statoTassaDiSoggiorno = (props.prenotazione.tassa_soggiorno_tot === 0) ? 'da pagare' : 'pagate';

    //Se le tasse devono essere ancora pagate calcolo quanti giorni mancano alla scadenza (tre mesi dalla data di richiesta)
    if (statoTassaDiSoggiorno === 'da pagare') {
        let check_out = new Date(props.prenotazione.check_out);
        let dataScadenza = new Date(
            (check_out.getMonth() + 3 > 11) ? check_out.getFullYear() + 1 : check_out.getFullYear(),
            (check_out.getMonth() + 3) % 12,
            check_out.getDate()
        );
        if (new Date() - dataScadenza > 0)
            statoTassaDiSoggiorno = <b>sono passati più di tre mesi dal check out!</b>;
        else
            statoTassaDiSoggiorno = `mancano ${Math.floor((dataScadenza - new Date()) / (1000 * 60 * 60 * 24))} giorni alla scadenza`;
    }

    //Controllo se gestione legale è già stata eseguita o no e imposto la stringa da stampare di conseguenza
    let statoGestioneLegale = (props.prenotazione.gestione_legale === 1) ? 'inviata' : 'da inviare'

    //Controllo se lo stato è pagato per dare indicazioni riguardo le tasse di soggiorno
    //e la gestione legale
    let gestione = null;
    if (props.prenotazione.stato === 'pagata')
        gestione = <div><p className="m-0"> Tasse di soggiorno: {statoTassaDiSoggiorno}</p>
            <p className="m-0"> Gestione legale: {statoGestioneLegale}</p></div>;

    //Se è un b&b stampo il numero della stanza
    let id_stanza = props.tipo === 'B&B' ? `Numero Stanza: ${props.prenotazione.numero_stanza}` : '';

    return (
        <div className="my-5 p-3 border rounded shadow-lg" id="prenotazione">
            <a href={destinazione} className="text-decoration-none text-dark" id="collegamentoPrenotazione">
                <div className="row">
                    <div className="col-md-4 col-sm-12 col-12 d-flex justify-content-center align-items-center">
                        <img
                            className="img-fluid rounded"
                            src={`/images/ImmaginiAnnunci/${(props.tipo === "B&B") ? "B&B" : "CasaVacanze"}${props.prenotazione.id_annuncio}/00copertina.jpeg`}
                            style={{ maxHeight: "200px", height: "100vw" }}
                            alt="immagine sfondo"
                        />
                    </div>
                    <div className="p-3 col-md-5 col-sm-12 col-12 testo">
                        <h4 className="m-0"> <b>{props.prenotazione.titolo}</b></h4>
                        <p className="m-0"> Data richiesta: {props.prenotazione.data_richiesta}</p>
                        <p className="m-0"><b style={{ color: "blue" }}> Check_in: </b> {props.prenotazione.check_in}</p>
                        <p className="m-0"><b style={{ color: "blue" }}> Check_out: </b> {props.prenotazione.check_out}</p>
                        <p className="m-0"> Persone: {props.prenotazione.numero_partecipanti}</p>
                        <p className="m-0"> Tipo struttura: {props.tipo}</p>
                        {gestione}
                        {id_stanza}
                    </div>
                    <div className="pt-3 col-md-3 col-sm-12 col-12">
                        <h5 className="m-0 statoAnnuncio"> Stato: <span style={statoColore}>{props.prenotazione.stato}</span></h5>
                    </div>
                </div>
            </a>
        </div>
    );
}

export default Prenotazione;
