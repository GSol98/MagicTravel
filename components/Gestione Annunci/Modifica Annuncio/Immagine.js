import React from "react";

const Immagine = props => {
    return (
        <div className="mb-5 col-12 col-sm-12 col-md-6 col-xl-4" style={{ position: "relative" }}>
            <img
                style={{ height: "200px", maxWidth: "250px" }}
                src={`/images/ImmaginiAnnunci/${props.tipo}${props.id_annuncio}/${props.nome}`}
                alt={`immagine${props.numero}`}
            />
            <input type="checkbox" name={props.nome} onChange={props.imageDelete} style={{ position: "absolute", left: "15px" }} />
        </div>
    )
}

export default Immagine;
