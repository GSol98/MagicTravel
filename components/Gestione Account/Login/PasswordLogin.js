import React from "react";

const PasswordLogin = props => {
    return (
        <div className="form-label-group mb-4">
            <input 
                id="inputPassword" 
                name="Password"
                className="form-control" 
                type="password" 
                placeholder="Password"
                onChange={props.handleChange}  
                required="required"  
            />
        </div>
    )
}
export default PasswordLogin;