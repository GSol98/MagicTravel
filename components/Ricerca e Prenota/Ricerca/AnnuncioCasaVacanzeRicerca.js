import React from "react";

const AnnuncioCasaVacanzeRicerca = props => {

    //Creo il path da inviare nel caso in cui si volessero visualizzare i dettagli
    let destinazione = `/DettagliAnnuncioRicerca#C${props.annuncio.id_annuncio}`;

    //Stampo l'annuncio
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

                    <div className="p-3 col-md-8 col-sm-12 col-12 testo">
                        <h4 className="m-0"> <b>{props.annuncio.titolo}</b></h4>
                        <div className="mt-3">
                            <p className="m-0">Tipo alloggio: {props.annuncio.tipo_alloggio}</p>
                            <p className="m-0">{props.annuncio.nome}, {props.annuncio.indirizzo} {props.annuncio.numero_civico}</p>
                            <p className="mt-0">Ultima modifica: {props.annuncio.data_creazione}</p>
                        </div>
                        <p style={{ fontSize: "1.2em", marginBottom: '-3px' }}>Prezzo: <b>{props.annuncio.costo}€</b>/notte </p>
                        <p>*Tasse escluse</p>
                    </div>
                </div>
            </a>
        </div>
    );
};

export default AnnuncioCasaVacanzeRicerca;
