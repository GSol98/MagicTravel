import React from "react";

const TitoloAnnuncio = props => {
    return (
        <div className="my-3">
            <label htmlFor="titoloAnnuncio" className="lead">TITOLO ANNUNCIO</label>
            <input 
                type="text" 
                id="titolonnuncio" 
                name="titolo" 
                value={props.state.titolo}
                className="form-control" 
                maxLength="40" 
                onChange={props.handleChange}
                required 
            />
            <div className="invalid-feedback">
                Inserire un titolo per l'annuncio
            </div>
        </div>
    );
}

export default TitoloAnnuncio;