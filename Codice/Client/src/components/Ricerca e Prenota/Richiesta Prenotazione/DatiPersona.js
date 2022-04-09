import React from "react";

const DatiPersona = props => {
    return(
        <div id={props.id} className="mt-5">
            <h2>{props.Persona}</h2>
        <div className="form-label-group was-validated mt-3">
            <input  
                id="inputNome" 
                name={`N${props.id}`}
                className="form-control" 
                type="text" 
                placeholder="Nome"  
                onChange={props.handleChange} 
                required
            />
        </div>

        <div className="form-label-group was-validated mt-3">
            <input  
                id="inputCognome" 
                name={`C${props.id}`}
                className="form-control" 
                type="text" 
                placeholder="Cognome"  
                onChange={props.handleChange} 
                required
            />
        </div>

        <div className="form-label-group was-validated mt-4">
            <input 
                type="text" 
                id="codiceFiscale" 
                name={`F${props.id}`}
                className="form-control"
                pattern="^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$" 
                onChange={props.handleChange}
                placeholder="Codice Fiscale"
                required="required">
            </input>
        </div>

         <div className="form-label-group was-validated mt-4">
            <span className="label label-default">DataDiNascita </span>
            <input 
                className="form-control" 
                id="date-input" 
                name={`D${props.id}`}
                type="date" 
                onChange={props.handleChange}
                placeholder="inserisci la data in formato gg/mm/aaaa"
                required = "required"
            />
        </div>

        <div className="form-label-group mt-4">
            <span className="label label-default">Numero Telefono</span>
            <input  
                id="numeroTelefono" 
                className="form-control col-md-4 col-sm-4" 
                name={`H${props.id}`}
                type="number" 
                placeholder="ES: 3458787987"  
                onChange={props.handleChange}   
            />
        </div>
        </div>
    )
}
export default DatiPersona;