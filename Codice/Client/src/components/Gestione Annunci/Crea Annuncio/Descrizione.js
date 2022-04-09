import React from "react";

const Descrizione = props => {
    return (
        <div className="form-group mt-5">
            <label className="lead" htmlFor="descrizione">DESCRIZIONE STRUTTURA</label>
            <textarea 
                className="form-control" 
                id="descrizione" 
                name="descrizione" 
                value={props.state.descrizione}
                rows="5" 
                onChange={props.handleChange}
                required 
            />
            <p id="conteggio"></p>
            <div className="invalid-feedback">
                Inserire una descrizione della struttura.
            </div>
        </div>
    );
};
export default Descrizione;