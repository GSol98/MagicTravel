import React from "react";

const Immagini = props => {
    return (
        <div className="my-3 col-12 col-sm-12 col-md-6">
            <label className="lead">Immagini Aggiuntive</label>
            <p style={{ fontSize: "0.8em" }}>L'inserimento non comporta la modifica delle immagini dell'annuncio</p>
            <br />
            <input
                type="file"
                id="fileInput"
                name="immagini"
                accept="image/jpeg, image/png"
                onChange={props.imageFetch}
                multiple
            />
        </div>
    );
};

export default Immagini;