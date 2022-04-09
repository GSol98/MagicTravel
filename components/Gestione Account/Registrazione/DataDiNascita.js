import React from "react";

const DataDiNascita = props => {
    return (
            <div className="form-label-group was-validated mt-4">
                <input 
                className="form-control" 
                id="date-input" 
                name="DataDiNascita"
                type="date" 
                onChange={props.handleChange}
                placeholder="inserisci la data in formato gg/mm/aaaa"
                required = "required"
                />
            </div>
    )
}
export default DataDiNascita;