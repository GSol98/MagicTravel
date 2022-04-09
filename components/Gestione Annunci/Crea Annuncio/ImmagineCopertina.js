import React from "react";

const ImmagineCopertina = props => {
    return (
        <div className="my-3 col-12 col-sm-12 col-md-6">
            <label className="lead mb-3">Immagine Di Copertina</label>
            <br />
            <input 
                type="file" 
                id="fileInput" 
                name="immagineCopertina"
                accept= "image/jpeg, image/png"
                onChange={props.imageFetch} 
                required 
            />
            <div className="invalid-feedback">
                Inserire l'immagine di copertina dell'annuncio
            </div>
        </div>
    );
}

export default ImmagineCopertina;