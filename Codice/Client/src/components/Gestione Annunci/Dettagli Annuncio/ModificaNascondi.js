import React from "react";
import NascondiAnnuncio from "../Nascondi Annuncio/Nascondi Annuncio";
import RendiVisibile from "../Rendi Visibile Annuncio/RendiVisibile";

const ModificaCancella = props => {
    return (
        <div className="jumbotron text-left" style={{backgroundColor: "white"}}>
            <div className="d-flex flex-row flex-wrap justify-content-around">
                <div>
                    <button 
                        className="btn btn-secondary mb-3" 
                        value={`${props.state.tipo_alloggio === "B&B" ? "B" : "C"}${props.state.id_annuncio}`} 
                        onClick={props.modifica}>
                        Modifica Annuncio
                    </button>
                </div>
                <div>
                    <NascondiAnnuncio 
                        state={props.state}
                        nascondi={props.nascondi}
                    />
                    <RendiVisibile 
                        state={props.state}
                        mostra={props.mostra}
                    />
                </div>
            </div>
        </div>
    );
}

export default ModificaCancella;