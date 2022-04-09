import React from "react";
import FormRegistrazione from "./FormRegistrazione.js";

const Registrazione = () => {
    return(
        <div id="backgroundMain" className="container-fluid mt-5">
            <div className="overlay d-flex justify-content-center align-items-center container p-5">
                <FormRegistrazione />
            </div>
        </div>
    );
}

export default Registrazione;