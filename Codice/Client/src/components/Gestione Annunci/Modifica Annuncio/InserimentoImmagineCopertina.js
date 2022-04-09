import React from "react";

const ImmagineCopertina = props => {
    return (
        <div className="my-3 col-12 col-sm-12 col-md-6">
            <label className="lead">Immagine Di Copertina</label>
            <p style={{ fontSize: "0.8em" }}>Se inserita sostituisce quella precedente</p>
            <br />
            <input
                type="file"
                id="fileInput"
                name="immagineCopertina"
                accept="image/jpeg, image/png"
                onChange={props.imageFetch}
            />
        </div>
    );
}

export default ImmagineCopertina;