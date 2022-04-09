import React from "react";

const Email = props => {
    return (
        <div className="form-label-group was-validated mt-4">
            <input 
                id="inputEmail" 
                className="form-control" 
                name="Email"
                type="email" 
                placeholder="Indirizzo Email"  
                onChange={props.handleChange} 
                required="required" />
        </div>
    )
}
export default Email;