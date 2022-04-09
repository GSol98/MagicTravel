import React from "react";

const EmailLogin = props => {
    return (
        <div className="form-label-group mb-4">
            <input 
                id="inputEmail" 
                name="Email"
                className="form-control" 
                type="email" 
                placeholder="Indirizzo Email" 
                required="required" 
                onChange={props.handleChange}    
            />
        </div>
    )
}
export default EmailLogin;