import React from "react";

const NumeroTelefono = props => {
    return (
        <div className="form-label-group mt-4">
            <input 
                id="inumeroTelefono" 
                className="form-control" 
                name="NumeroTelefono"
                type="number" 
                placeholder="Numero di Cellulare"  
                onChange={props.handleChange} 
                
            />
            
        </div>
    )
}
export default NumeroTelefono;