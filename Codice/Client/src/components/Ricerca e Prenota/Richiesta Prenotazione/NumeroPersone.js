import React from "react";

const NumeroPersone = props => {
    return (
        <div className="input-group">
            <div className="input-group-prepend">
                <div className="input-group-text" style={{ width: "100%", height: "38px" }}>Numero Partecipanti</div>
            </div>

            <input
                id="numero Persone"
                name="NumeroPersone"
                type="number"
                value={props.state.NumeroPersone}
                className="form-control col-md-2 col-sm-3 col-12"
                maxLength="40"
                min="1"
                onChange={props.handleChange}
                required
            />
        </div>
    )
}
export default NumeroPersone;