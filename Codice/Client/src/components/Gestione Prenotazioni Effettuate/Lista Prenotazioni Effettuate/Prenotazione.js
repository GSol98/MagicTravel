import React from "react";

const Prenotazione = props => {

    //Imposto le due variabili sotto, utili per dare la colorazione alla scritta e 
    //nella composizione dell'URL della pagina dettaglio della prenotazione
    let statoTrasmissione;
    let statoColore;

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

    //Codifico tipo per la creazione dell'URL della pagina dettaglio della prenotazione
    let tipo = props.tipo === 'B&B' ? 'B' : 'C';

    //Creo URL della pagina dettaglio della prenotazione
    let destinazione = `/DettagliPrenotazioneEffettuata#${tipo}${props.prenotazione.id_prenotazione}${statoTrasmissione}`;

    let numeroStanza;

    if (tipo === "B")
        numeroStanza = `Numero Stanza: ${props.prenotazione.numero_stanza}`;

    return (
        <div className="my-5 p-3 border rounded shadow-lg" id="prenotazione" >
            <a href={destinazione} className="text-dark text-decoration-none" id="collegamentoPrenotazione" >
                <div className="row">
                    <div className="col-md-4 col-sm-12 col-12 d-flex justify-content-center align-items-center">
                        <img
                            className="img-fluid rounded"
                            src={`/images/immaginiAnnunci/${(props.tipo === "B&B") ? "B&B" : "CasaVacanze"}${props.prenotazione.ref_annuncio}/00copertina.jpeg`}
                            style={{ maxHeight: "200px", height: "1000vw" }}
                            alt="immagine sfondo"
                        />
                    </div>
                    <div className="p-3 col-md-4 col-sm-12 col-12 testo">
                        <h4 className="m-0"> <b>{props.prenotazione.titolo}</b></h4>
                        <p className="m-0"> Data richiesta: {props.prenotazione.data_richiesta}</p>
                        <p className="m-0"> <b style={{ color: "blue" }}> Check_in: </b> {props.prenotazione.check_in}</p>
                        <p className="m-0"> <b style={{ color: "blue" }}> Check_out: </b> {props.prenotazione.check_out}</p>
                        <p className="m-0"> Persone: {props.prenotazione.numero_partecipanti}</p>
                        <p className="m-0"> Tipo struttura: {props.tipo}</p>
                        <p>{numeroStanza}</p>
                    </div>
                    <div className="pt-3 col-md-4 col-sm-12 col-12 text-center">
                        <h5 className="m-0 statoAnnuncio"> Stato: <span style={statoColore}> {props.prenotazione.stato} </span></h5>
                        <p className="m-0"> Costo: <b>{props.prenotazione.prezzo_con_tasse}€</b></p>
                        <p className="m-0"> Tasse di soggiorno a persona: {props.prenotazione.tassa_soggiorno}</p>
                        <p className="m-0"> Giorni di pernottamento: {(new Date(props.prenotazione.check_out) - new Date(props.prenotazione.check_in)) / (1000 * 24 * 60 * 60)}</p>
                    </div>
                </div>
            </a>
        </div>
    );
}

export default Prenotazione;