import React from "react";

const Immagini = props => {
    return (
        <div className="my-3 col-12 col-sm-12 col-md-6">
            <label className="lead mb-3">Immagini Aggiuntive</label>
            <br />
            <input 
                type="file" 
                id="fileInput" 
                name="immagini"
                accept= "image/jpeg, image/png"
                onChange={props.imageFetch} 
                multiple 
                required
            />
            <div className="invalid-feedback">
                Inserire delle immagini della struttura
            </div>
        </div>
    );
};

export default Immagini;