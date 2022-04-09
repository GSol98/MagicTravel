import React from "react";

const Cognome = props => {
    return(
        <div className="form-label-group was-validated mt-3">
            <input  
                id="inputCognome" 
                name="Cognome"
                className="form-control" 
                type="text" 
                placeholder="Cognome"  
                onChange={props.handleChange} 
                required/>
        </div>
    )
}
export default Cognome;