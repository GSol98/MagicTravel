import React from "react";
import FormLogin from "./FormLogin.js";

const Login = () => {
    return(
        <div className="container-fluid mt-5" id='backgroundMain'>
            <div className="overlay d-flex justify-content-center align-items-center container p-5">
                <FormLogin />
            </div>
        </div>
    );
}

export default Login;