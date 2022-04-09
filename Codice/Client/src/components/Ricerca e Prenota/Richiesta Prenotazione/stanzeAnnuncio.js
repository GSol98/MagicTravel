import React from "react";
import Calendario from "./Calendario";

const stanzeAnnuncio = props => {

    //Controllo che la stanza nel periodo in cui si vuole prenotare non sia impegnata
    let corrispondenza = false;

    let prenotazioni = props.prenotazioni.filter(prenotazione => { return prenotazione.ref_stanza === props.idStanza });

    if (controlloData(props.stato.CheckIn) && controlloData(props.stato.CheckOut)) {
        console.log('controllo')
        for (let prenotazione of prenotazioni) {
            if (((new Date(props.stato.CheckIn) >= new Date(prenotazione.check_in) && new Date(props.stato.CheckIn) <= new Date(prenotazione.check_out)) ||
                (new Date(props.stato.CheckOut) >= new Date(prenotazione.check_in) && new Date(props.stato.CheckOut) <= new Date(prenotazione.check_out)) ||
                (new Date(props.stato.CheckIn) <= new Date(prenotazione.check_in) && new Date(props.stato.CheckOut) >= new Date(prenotazione.check_out))))
                corrispondenza = true;
        }
    }

    return (
        <div style={{ display: 'inline-block' }} className="col-12 col-sm-12 col-md-6 col-lg-4 my-5 p-0">
            <div>
                <h4>
                    Stanza {props.id + 1}

                    {!corrispondenza ? <input
                        className="mx-3"
                        name={props.idStanza}
                        type="checkbox"
                        value={props.prezzo}
                        onChange={props.handleChange}
                    /> :
                        ' non disponibile'}
                </h4>
            </div>
            <div>
                <h5>Posti letto: {props.state.numero_posti_letto}</h5>
            </div>
            <div>
                <h5>Prezzo: {props.state.prezzo}€/per notte</h5>
            </div>
            <div style={{ sizes: '10%' }}>
                <Calendario listaPrenotazioni={prenotazioni} />
            </div>
        </div>

    )
}

//Controllo se val è una data e se è superiore al 2000
const controlloData = (val) => {

    if (Number.parseInt(val.split('-')[0]) > 2000)
        return true;

    return false;
}

export default stanzeAnnuncio;
