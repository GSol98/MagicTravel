import React from "react";
import TipoAlloggio from "./TipoAlloggio.js";
import FormContainerBeB from "./FormContainerB&B.js";
import FormContainerCasaVacanza from "./FormContainerCasaVacanza.js";

class CreaAnnuncio extends React.Component {
    constructor() {
        super();
        this.state = {
            tipoAlloggio: ""
        }
    }

    // Salvo nello state il risultato della scelta tra B&B e Casa Vacanza
    handleClick = event => { this.setState({ tipoAlloggio: event.target.value }); }

    render() {
        //Controllo il form da stampare 
        let form;
        if (this.state.tipoAlloggio === "BeB")
            form = <FormContainerBeB />;

        else if (this.state.tipoAlloggio === "casaVacanze")
            form = <FormContainerCasaVacanza />;

        else
            form = <div style={{ textAlign: "center", margin: '50px', padding: '20px', fontSize: '3vw' }}>Selezionare la tipologia di alloggio</div>

        // Inizialmente non è stata fatta una scelta tra B&B e Casa Vacanze quindi, essendo this.state.tipoAlloggio = ""
        // vengono saltati i controlli precedenti e viene renderizzata la finestra di scelta del tipo di alloggio
        return (
            <div className="container mt-5 rounded shadow-lg impaginazione py-5">
                <div className="py-5">
                    <h1 style={{ textAlign: "center", fontSize: "3em" }}>Crea Il Tuo Annuncio</h1>
                </div>

                <TipoAlloggio
                    handleClick={this.handleClick}
                />

                <div className='d-flex justify-content-center'>
                    {form}
                </div>
            </div>
        );
    }
}

export default CreaAnnuncio;