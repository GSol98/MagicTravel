import React from "react";

const ConfermaPassword = props => {
    return (
        <div className="form-label-group">
            <input 
                name="ConfermaPassword" 
                id="passConfirm" 
                type="password" 
                className="form-control was-validated" 
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
                size="32" 
                maxLength="40" 
                placeholder="Conferma Password" 
                onChange={props.handleChange}
                required="required"
                />
        </div>
    )
}
export default ConfermaPassword;