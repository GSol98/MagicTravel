import React from "react";

const Nome = props => {
    return(
        <div className="form-label-group was-validated mt-3">
            <input  
                id="inputNome" 
                name="Nome"
                className="form-control" 
                type="text" 
                placeholder="Nome"  
                onChange={props.handleChange} 
                required
            />
        </div>
    )

}

export default Nome;