import React from "react";

const Password = props => {
    return (
        <div className="form-label-group was-validated mt-4">
            <input
                name="Password"
                id="pass"
                type="password"
                className="form-control was-validated"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
                size="32"
                maxLength="40"
                placeholder="Password"
                onChange={props.handleChange}
                required
            />
            <p className="text-white font-weight-bolder">Almeno 8 caratteri di cui uno maiuscolo e un numero</p>
        </div>
    )
}
export default Password;