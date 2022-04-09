import React from "react";

const TipoAlloggio = props => {
    // L'elemento è formato da due bottoni che consentono la scelta di B&B o Casa Vacanza
    return (
        <div style={{textAlign: "center"}}>
            <label className="lead col-12" style={{fontSize:"1.5em"}}>Tipologia Alloggio</label>
            <div className="col-12">
                <button className="btn btn-secondary m-3" value="casaVacanze" onClick={props.handleClick}>Casa Vacanze</button>
                <button className="btn btn-secondary m-3" value="BeB" onClick={props.handleClick}>B&B</button>
            </div>
        </div>
    );
}

export default TipoAlloggio;