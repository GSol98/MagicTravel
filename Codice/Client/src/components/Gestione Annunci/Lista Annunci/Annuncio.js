import React from "react";

/**
 * Al click su un annuncio inserisco il nell'url il tipo e l'id dell'annuncio
 * che è stato selezionato. Infine l'utente viene reindirizzato verso la pagina 
 * dei dettagli dell'annuncio.
 */

const Annuncio = props => {
    const destinazione = `/DettagliAnnuncio#C${props.annuncio.id_annuncio}`;

    return (
        <div className="my-5 p-3 border rounded shadow-lg">
            <a className="text-dark text-decoration-none" href={destinazione}>
                <div className='row'>
                    <div className="col-md-4 col-sm-12 col-12 d-flex justify-content-center align-items-center">
                        <img
                            className="img-fluid rounded"
                            src={`/images/ImmaginiAnnunci/CasaVacanze${props.annuncio.id_annuncio}/00copertina.jpeg`}
                            alt="immagine sfondo"
                            style={{ maxHeight: "200px", height: "100vw" }}
                        />
                    </div>

                    <div className="p-3 col-md-5 col-sm-12 col-12 testo">
                        <h4 className="m-0"> <b>{props.annuncio.titolo}</b></h4>
                        <div className="mt-3">
                            <p className="m-0">Tipo alloggio: {props.annuncio.tipo_alloggio}</p>
                            <p className="m-0">{props.annuncio.nome_comune}, {props.annuncio.indirizzo} {props.annuncio.numero_civico}</p>
                            <p className="mt-0">Ultima modifica: {props.annuncio.data_creazione}</p>
                        </div>
                        <p style={{ fontSize: "1.2em", marginBottom: '-3px' }}>Prezzo: <b>{props.annuncio.costo}€</b>/notte </p>
                        <p>*Tasse escluse</p>
                    </div>

                    <div className="col-md-3 col-sm-12 col-12 p-3 text-center">
                        <h5 className="m-0 statoAnnuncio"> Stato: <b> {props.annuncio.nascosto === 0 ? "Visibile" : "Nascosto"} </b></h5>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default Annuncio;
