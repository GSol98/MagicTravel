import React from "react";

const Costo = props => {
    let prezzi = contaCosti(props.stanze);
    let riepilogo = [];

    prezzi.forEach(prezzo => {
        riepilogo.push(composizione(prezzo));
    });

    return (
        <div style={{ marginTop: '80px' }} className="col-xl-8 col-lg-9 col-md-10 col-sm-11 col-12">
            <h4>- Costi alloggio</h4>
            <div className="ml-5">
                <p style={{ fontSize: "1.2em", marginTop: '20px' }}>Tassa di soggiorno: <strong>{props.state.tassa_soggiorno}€</strong>/giorno</p>
                <div style={{ fontSize: "1.2em" }}>Prezzi per notte: <br /> {riepilogo}</div>
            </div>
        </div>
    );
}

const contaCosti = stanze => {
    let prezzi = [];
    stanze.forEach(stanza => {
        let esiste = false;
        for (let prezzo of prezzi) {
            if (prezzo[0] === stanza.numero_posti_letto) {
                esiste = true
                break;
            }
        }
        if (!esiste)
            prezzi.push([stanza.numero_posti_letto, stanza.prezzo])
    });
    return prezzi;
};

const composizione = prezzo => {
    return (
        <p className="ml-2 my-2" key={prezzo}> Camere da <strong>{prezzo[0]}</strong> posti: <strong>{prezzo[1]}€</strong>/notte </p>
    )
}

export default Costo;