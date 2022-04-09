import React from "react";

const CodiceFiscale = props => {
    return (
        <div className="form-label-group was-validated mt-4">
            <input 
                type="text" 
                id="codiceFiscale" 
                name="CodiceFiscale"
                className="form-control"
                pattern="^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$" 
                onChange={props.handleChange}
                placeholder="Codice Fiscale"
                required="required">
            </input>
        </div>
    )
}
export default CodiceFiscale;