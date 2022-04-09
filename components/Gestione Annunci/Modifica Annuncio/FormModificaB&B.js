import React from "react";
import TitoloAnnuncio from "../Crea Annuncio/TitoloAnnuncio.js";
import Locazione from "../Crea Annuncio/Locazione.js";
import Descrizione from "../Crea Annuncio/Descrizione.js";
import Servizi from "./ServiziB&B.js";
import ServiziAggiuntivi from "../Crea Annuncio/ServiziAggiuntivi.js";
import Immagini from "./Immagini.js";
import TassaDiSoggiorno from "../Crea Annuncio/TassaDiSoggiorno.js";

class FinestraModificaBeB extends React.Component {
    render() {
        /**
        * Riutilizzo le stesse componenti di creazione annuncio a cui vengono subito assegnati i valori
        * recuperati dal database
        */
        return (
            <form className="container was-validated" onSubmit={this.props.handleSubmit}>
                <label className="lead" style={{ fontSize: "1.3em" }}>Tipo Alloggio: <strong>{this.props.state.tipo_alloggio}</strong></label>

                <TitoloAnnuncio
                    state={this.props.state}
                    handleChange={this.props.handleChange}
                />

                <Locazione
                    state={this.props.state}
                    handleChange={this.props.handleChange}
                />

                <Descrizione
                    state={this.props.state}
                    handleChange={this.props.handleChange}
                />

                <Servizi
                    state={this.props.state}
                    stanze={this.props.stanze}
                    handleChange={this.props.handleChangeStanze}
                />

                <ServiziAggiuntivi
                    state={this.props.serviziAggiuntivi}
                    handleChange={this.props.handleChangeServiziAggiuntivi}
                />

                <Immagini
                    state={this.props.state}
                    tipo="B&B"
                    imageFetch={this.props.imageFetch}
                    imageDelete={this.props.imageDelete}
                />

                <TassaDiSoggiorno
                    state={this.props.state}
                    handleChange={this.props.handleChange}
                />
                <button style={{ float: "right" }} className="btn btn-secondary mt-5">Modifica</button>
                <br /><br /><br />
            </form>
        )
    }
}

export default FinestraModificaBeB;